import express from 'express';
import { pool } from '../db/index.js';
import { memoryStore } from '../db/memoryStore.js';

const router = express.Router();

// GET /api/properties - Get all property listings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.landlord_id,
        p.title,
        p.property_type,
        p.location,
        p.monthly_rent,
        p.income_threshold,
        p.description,
        p.image_url,
        p.created_at,
        u.name AS landlord_name,
        u.email AS landlord_email,
        COUNT(a.id)::int AS total_applications
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      LEFT JOIN applications a ON p.id = a.property_id
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
    `);
    return res.json({ success: true, properties: result.rows });
  } catch (err) {
    // Graceful fallback to memoryStore if DB is not connected
    console.warn('[RoofProof DB] DB query failed, serving from memory store:', err.message);
    return res.json({ success: true, properties: memoryStore.properties });
  }
});

// GET /api/properties/:id - Get property details
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.name AS landlord_name,
        u.email AS landlord_email
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }
    return res.json({ success: true, property: result.rows[0] });
  } catch (err) {
    const prop = memoryStore.properties.find(p => String(p.id) === String(req.params.id));
    if (prop) return res.json({ success: true, property: prop });
    return res.status(404).json({ success: false, error: 'Property not found.' });
  }
});

// POST /api/properties - Create property listing
router.post('/', async (req, res) => {
  const { title, location, monthly_rent, income_threshold, description, image_url, property_type, landlord_id, landlordId } = req.body;

  if (!title || !location || !monthly_rent || !income_threshold || !description) {
    return res.status(400).json({
      success: false,
      error: 'All required fields (title, location, monthly_rent, income_threshold, description) must be provided.',
    });
  }

  const lid = landlord_id || landlordId;
  if (!lid) {
    return res.status(400).json({ success: false, error: 'landlord_id is required.' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO properties (landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      lid,
      title.trim(),
      property_type || 'Family Apartment',
      location.trim(),
      Number(monthly_rent),
      Number(income_threshold),
      description.trim(),
      image_url || '/houses/house1.jpg',
    ]);

    const property = result.rows[0];
    const landlordRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [property.landlord_id]);
    property.landlord_name = landlordRes.rows[0]?.name || null;
    property.landlord_email = landlordRes.rows[0]?.email || null;

    return res.status(201).json({
      success: true,
      property,
      message: 'Property listing published successfully to database.',
    });
  } catch (err) {
    console.warn('[RoofProof DB] DB insert failed, saving to memory store:', err.message);
    const newProp = {
      id: Date.now(),
      landlord_id: lid,
      title: title.trim(),
      property_type: property_type || 'Family Apartment',
      location: location.trim(),
      monthly_rent: Number(monthly_rent),
      income_threshold: Number(income_threshold),
      description: description.trim(),
      image_url: image_url || '/houses/house1.jpg',
      landlord_name: req.body.landlord_name || 'Landlord',
      landlord_email: req.body.landlord_email || null,
      total_applications: 0,
      created_at: new Date().toISOString(),
    };
    memoryStore.properties.unshift(newProp);
    return res.status(201).json({
      success: true,
      property: newProp,
      message: 'Property listing published successfully.',
    });
  }
});

// GET /api/properties/:id/applications - Get applications for a property
router.get('/:id/applications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        u.name AS tenant_name,
        u.email AS tenant_email,
        p.title AS property_title,
        p.income_threshold
      FROM applications a
      JOIN users u ON a.tenant_id = u.id
      JOIN properties p ON a.property_id = p.id
      WHERE a.property_id = $1
      ORDER BY a.created_at DESC
    `, [req.params.id]);

    return res.json({ success: true, applications: result.rows });
  } catch (err) {
    const apps = memoryStore.applications.filter(a => String(a.property_id) === String(req.params.id));
    return res.json({ success: true, applications: apps });
  }
});

// POST /api/properties/:id/apply - Apply for property with Zero Knowledge proof
router.post('/:id/apply', async (req, res) => {
  const { tenant_id, verification_status, zk_tx_hash } = req.body;

  // Strict privacy audit: strip forbidden fields
  const forbiddenFields = ['income', 'tenant_income', 'salary', 'privateIncome', 'bank_statement', 'salary_slip'];
  for (const field of forbiddenFields) {
    if (field in req.body) {
      delete req.body[field];
      console.warn(`[SECURITY] Stripped forbidden field '${field}' from request.`);
    }
  }

  if (!tenant_id) {
    return res.status(400).json({ success: false, error: 'tenant_id is required.' });
  }

  const trimmedProofRef = typeof zk_tx_hash === 'string' ? zk_tx_hash.trim() : '';

  if (verification_status !== 'eligible' || !trimmedProofRef) {
    return res.status(400).json({
      success: false,
      error: 'Cannot submit application without a verified Zero-Knowledge proof and valid authorization signature.',
    });
  }

  if (trimmedProofRef.length < 32) {
    return res.status(400).json({
      success: false,
      error: 'Invalid authorization signature. Too short to be a valid cryptographic proof.',
    });
  }

  try {
    const propCheck = await pool.query('SELECT * FROM properties WHERE id = $1', [req.params.id]);
    if (propCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }

    const appCheck = await pool.query(
      'SELECT id, status FROM applications WHERE property_id = $1 AND tenant_id = $2',
      [req.params.id, tenant_id]
    );

    if (appCheck.rows.length > 0) {
      if (appCheck.rows[0].status === 'rejected') {
        return res.status(409).json({ success: false, error: 'This rental application was denied. Re-application is not permitted.' });
      }
      return res.status(409).json({ success: false, error: 'You already have an active application for this property.' });
    }

    const insertResult = await pool.query(`
      INSERT INTO applications (property_id, tenant_id, status, verification_status, zk_tx_hash)
      VALUES ($1, $2, 'pending', 'eligible', $3)
      RETURNING *
    `, [req.params.id, tenant_id, trimmedProofRef]);

    return res.status(201).json({
      success: true,
      application: insertResult.rows[0],
      message: 'Rental application submitted successfully with Midnight ZK privacy protection.',
    });
  } catch (err) {
    const newApp = {
      id: Date.now(),
      property_id: Number(req.params.id),
      tenant_id: Number(tenant_id),
      status: 'pending',
      verification_status: 'eligible',
      zk_tx_hash: trimmedProofRef,
      created_at: new Date().toISOString(),
    };
    memoryStore.applications.push(newApp);
    return res.status(201).json({
      success: true,
      application: newApp,
      message: 'Rental application submitted successfully with Midnight ZK privacy protection.',
    });
  }
});

// DELETE /api/properties/:id - Delete property listing
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM applications WHERE property_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }
    return res.json({ success: true, message: 'Property listing deleted successfully.', deleted_id: req.params.id });
  } catch (err) {
    memoryStore.properties = memoryStore.properties.filter(p => String(p.id) !== String(req.params.id));
    return res.json({ success: true, message: 'Property listing deleted successfully.', deleted_id: req.params.id });
  }
});

export default router;
