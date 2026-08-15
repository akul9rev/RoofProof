import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET /api/applications - Get applications by tenant or landlord
router.get('/', async (req, res) => {
  const { tenant_id, landlord_id } = req.query;

  try {
    let sql = `
      SELECT 
        a.id, 
        a.property_id, 
        a.tenant_id, 
        u.name AS tenant_name,
        u.email AS tenant_email,
        p.landlord_id,
        l.name AS landlord_name,
        p.title AS property_title,
        p.location AS property_location,
        p.monthly_rent,
        p.income_threshold,
        a.status, 
        a.verification_status, 
        a.zk_tx_hash,
        a.created_at
      FROM applications a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.tenant_id = u.id
      JOIN users l ON p.landlord_id = l.id
    `;
    const params = [];

    if (tenant_id) {
      params.push(Number(tenant_id));
      sql += ` WHERE a.tenant_id = $${params.length}`;
    } else if (landlord_id) {
      params.push(Number(landlord_id));
      sql += ` WHERE p.landlord_id = $${params.length}`;
    }

    sql += ' ORDER BY a.id DESC;';

    const result = await query(sql, params);
    res.json({ success: true, applications: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/applications/:id/status - Landlord approve or reject application
router.patch('/:id/status', async (req, res) => {
  const applicationId = Number(req.params.id);
  const { status } = req.body;

  if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    const result = await query(`
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING id, property_id, tenant_id, status, verification_status, zk_tx_hash, created_at;
    `, [status, applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    res.json({ success: true, application: result.rows[0], message: `Application marked as ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
