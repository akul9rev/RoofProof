import express from 'express';
import { pool } from '../db/index.js';
import { memoryStore } from '../db/memoryStore.js';

const router = express.Router();

// GET /api/applications - Get applications by tenant or landlord
router.get('/', async (req, res) => {
  const { tenant_id, landlord_id } = req.query;
  try {
    let query = `
      SELECT 
        a.id,
        a.property_id,
        a.tenant_id,
        a.status,
        a.verification_status,
        a.zk_tx_hash,
        a.rejection_reason,
        a.created_at,
        u.name AS tenant_name,
        u.email AS tenant_email,
        p.title AS property_title,
        p.location AS property_location,
        p.monthly_rent,
        p.income_threshold,
        p.landlord_id,
        lu.name AS landlord_name
      FROM applications a
      JOIN users u ON a.tenant_id = u.id
      JOIN properties p ON a.property_id = p.id
      JOIN users lu ON p.landlord_id = lu.id
    `;
    const params = [];

    if (tenant_id) {
      params.push(tenant_id);
      query += ` WHERE a.tenant_id = $${params.length}`;
    } else if (landlord_id) {
      params.push(landlord_id);
      query += ` WHERE p.landlord_id = $${params.length}`;
    }

    query += ' ORDER BY a.created_at DESC';

    const result = await pool.query(query, params);
    return res.json({ success: true, applications: result.rows });
  } catch (err) {
    let apps = [...memoryStore.applications];
    if (tenant_id) {
      apps = apps.filter(a => String(a.tenant_id) === String(tenant_id));
    }
    return res.json({ success: true, applications: apps });
  }
});

// POST /api/applications - Submit new verified application
router.post('/', async (req, res) => {
  const { property_id, propertyId, tenant_id, tenantId, verification_status, zk_tx_hash } = req.body;
  const propId = property_id || propertyId;
  const tenId = tenant_id || tenantId;

  if (!propId || !tenId) {
    return res.status(400).json({ success: false, error: 'property_id and tenant_id are required.' });
  }

  const normalizedStatus = (verification_status === 'verified_pass' || verification_status === 'eligible')
    ? 'eligible'
    : (verification_status === 'ineligible' ? 'ineligible' : 'unverified');

  try {
    const existing = await pool.query(
      'SELECT id FROM applications WHERE property_id = $1 AND tenant_id = $2',
      [propId, tenId]
    );

    let application;
    if (existing.rows.length > 0) {
      const updateResult = await pool.query(`
        UPDATE applications
        SET status = 'pending', verification_status = $1, zk_tx_hash = COALESCE($2, zk_tx_hash), rejection_reason = NULL
        WHERE id = $3
        RETURNING *
      `, [normalizedStatus, zk_tx_hash || null, existing.rows[0].id]);
      application = updateResult.rows[0];
    } else {
      const insertResult = await pool.query(`
        INSERT INTO applications (property_id, tenant_id, status, verification_status, zk_tx_hash)
        VALUES ($1, $2, 'pending', $3, $4)
        RETURNING *
      `, [propId, tenId, normalizedStatus, zk_tx_hash || null]);
      application = insertResult.rows[0];
    }

    return res.status(201).json({ success: true, application, message: 'Application submitted successfully.' });
  } catch (err) {
    console.warn('[RoofProof DB] Application submit falling back to memory store:', err.message);
    const existingIdx = memoryStore.applications.findIndex(
      a => String(a.property_id) === String(propId) && String(a.tenant_id) === String(tenId)
    );

    const appObj = {
      id: Date.now(),
      property_id: Number(propId),
      tenant_id: Number(tenId),
      status: 'pending',
      verification_status: normalizedStatus,
      zk_tx_hash: zk_tx_hash || '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      rejection_reason: null,
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      memoryStore.applications[existingIdx] = appObj;
    } else {
      memoryStore.applications.unshift(appObj);
    }

    return res.status(201).json({ success: true, application: appObj, message: 'Application submitted successfully.' });
  }
});

// PATCH /api/applications/:id/status - Landlord approve or reject application
router.patch('/:id/status', async (req, res) => {
  const { status, rejection_reason } = req.body;

  if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    const result = await pool.query(`
      UPDATE applications 
      SET status = $1, rejection_reason = $2
      WHERE id = $3
      RETURNING *
    `, [status, rejection_reason || null, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    return res.json({ success: true, application: result.rows[0], message: `Application status updated to ${status}.` });
  } catch (err) {
    const app = memoryStore.applications.find(a => String(a.id) === String(req.params.id));
    if (app) {
      app.status = status;
      app.rejection_reason = rejection_reason || null;
      return res.json({ success: true, application: app, message: `Application status updated to ${status}.` });
    }
    return res.json({ success: true, message: `Status updated to ${status}` });
  }
});

// DELETE /api/applications/:id - Withdraw application
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }
    return res.json({ success: true, message: 'Application withdrawn successfully.' });
  } catch (err) {
    memoryStore.applications = memoryStore.applications.filter(a => String(a.id) !== String(req.params.id));
    return res.json({ success: true, message: 'Application withdrawn successfully.' });
  }
});

export default router;
