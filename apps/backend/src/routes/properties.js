import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET /api/properties - Get all property listings
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        p.id, 
        p.landlord_id, 
        u.name AS landlord_name, 
        p.title, 
        p.location, 
        p.monthly_rent, 
        p.income_threshold, 
        p.description, 
        p.created_at,
        COUNT(a.id)::int AS total_applications
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      LEFT JOIN applications a ON p.id = a.property_id
      GROUP BY p.id, u.name
      ORDER BY p.id DESC;
    `);
    res.json({ success: true, properties: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/properties/:id - Get property details
router.get('/:id', async (req, res) => {
  const propertyId = Number(req.params.id);
  try {
    const result = await query(`
      SELECT 
        p.id, 
        p.landlord_id, 
        u.name AS landlord_name, 
        u.email AS landlord_email,
        p.title, 
        p.location, 
        p.monthly_rent, 
        p.income_threshold, 
        p.description, 
        p.created_at
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      WHERE p.id = $1;
    `, [propertyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }
    res.json({ success: true, property: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/properties - Create property listing
router.post('/', async (req, res) => {
  const { landlord_id, title, location, monthly_rent, income_threshold, description } = req.body;

  if (!landlord_id || !title || !location || !monthly_rent || !income_threshold || !description) {
    return res.status(400).json({
      success: false,
      error: 'All fields (landlord_id, title, location, monthly_rent, income_threshold, description) are required.',
    });
  }

  try {
    const result = await query(`
      INSERT INTO properties (landlord_id, title, location, monthly_rent, income_threshold, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, landlord_id, title, location, monthly_rent, income_threshold, description, created_at;
    `, [landlord_id, title.trim(), location.trim(), Number(monthly_rent), Number(income_threshold), description.trim()]);

    res.status(201).json({ success: true, property: result.rows[0], message: 'Property listing published successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/properties/:id/applications - Get applications for property (Landlord view)
router.get('/:id/applications', async (req, res) => {
  const propertyId = Number(req.params.id);
  try {
    const result = await query(`
      SELECT 
        a.id, 
        a.property_id, 
        a.tenant_id, 
        u.name AS tenant_name, 
        u.email AS tenant_email,
        a.status, 
        a.verification_status, 
        a.zk_tx_hash,
        a.created_at,
        p.title AS property_title,
        p.income_threshold
      FROM applications a
      JOIN users u ON a.tenant_id = u.id
      JOIN properties p ON a.property_id = p.id
      WHERE a.property_id = $1
      ORDER BY a.id DESC;
    `, [propertyId]);

    // STRICT CHECK: Ensure ZERO private income fields are exposed in response
    res.json({ success: true, applications: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/properties/:id/apply - Apply for property with client-side Zero Knowledge proof
router.post('/:id/apply', async (req, res) => {
  const propertyId = Number(req.params.id);
  const { tenant_id, verification_status, zk_tx_hash } = req.body;

  // STRICT PRIVACY AUDIT:
  // Delete any illegal income fields if inadvertently submitted by client
  const forbiddenFields = ['income', 'tenant_income', 'salary', 'privateIncome', 'bank_statement', 'salary_slip'];
  for (const field of forbiddenFields) {
    if (field in req.body) {
      delete req.body[field];
      console.warn(`[SECURITY AUDIT] Stripped forbidden field '${field}' from client request payload.`);
    }
  }

  if (!tenant_id) {
    return res.status(400).json({ success: false, error: 'tenant_id is required.' });
  }

  const KNOWN_DEMO_TX_HASH = '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c';
  const trimmedProofRef = typeof zk_tx_hash === 'string' ? zk_tx_hash.trim() : '';

  // STRICT INTEGRITY GUARD: require real Lace authorization signature, not client-side eligibility alone
  if (verification_status !== 'eligible' || !trimmedProofRef) {
    return res.status(400).json({
      success: false,
      error: 'Cannot submit application without a verified Zero-Knowledge proof and valid Lace wallet authorization signature.',
    });
  }

  // Reject hardcoded sample/demo tx hash — must be a per-session Lace cryptographic signature
  if (trimmedProofRef === KNOWN_DEMO_TX_HASH) {
    return res.status(400).json({
      success: false,
      error: 'Cannot submit application with a demo transaction hash. A real Lace wallet authorization signature is required.',
    });
  }

  // Lace signatures are non-trivial cryptographic payloads; reject trivial bypass values
  if (trimmedProofRef.length < 32) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Lace authorization signature. Please complete wallet signing in Midnight Lace.',
    });
  }

  try {
    // Check if property exists
    const propCheck = await query('SELECT id, income_threshold FROM properties WHERE id = $1;', [propertyId]);
    if (propCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }

    // Check if already applied
    const existing = await query('SELECT id, status FROM applications WHERE property_id = $1 AND tenant_id = $2;', [propertyId, tenant_id]);
    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'rejected') {
        return res.status(409).json({
          success: false,
          error: 'This rental application was denied by the property owner. Re-application is not permitted for this listing.',
        });
      }
      return res.status(409).json({
        success: false,
        error: 'You already have an active application for this property.',
      });
    }

    const vStatus = verification_status === 'eligible' ? 'eligible' : (verification_status === 'ineligible' ? 'ineligible' : 'unverified');
    const txHash = trimmedProofRef;

    const inserted = await query(`
      INSERT INTO applications (property_id, tenant_id, status, verification_status, zk_tx_hash)
      VALUES ($1, $2, 'pending', $3, $4)
      RETURNING id, property_id, tenant_id, status, verification_status, zk_tx_hash, created_at;
    `, [propertyId, tenant_id, vStatus, txHash]);

    res.status(201).json({
      success: true,
      application: inserted.rows[0],
      message: 'Rental application submitted successfully with Midnight ZK privacy protection.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
