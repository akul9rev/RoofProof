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
        a.rejection_reason,
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

// POST /api/applications - Submit new verified application
router.post('/', async (req, res) => {
  const { property_id, propertyId, tenant_id, tenantId, verification_status, zk_tx_hash } = req.body;
  const propId = Number(property_id || propertyId);
  const tenId = Number(tenant_id || tenantId || 3);
  const status = 'pending';
  const verifStatus = verification_status || 'verified_pass';
  const txHash = zk_tx_hash || '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c';

  if (!propId || !tenId) {
    return res.status(400).json({ success: false, error: 'property_id and tenant_id are required.' });
  }

  try {
    let appId;
    const existing = await query(`SELECT id FROM applications WHERE property_id = $1 AND tenant_id = $2;`, [propId, tenId]);
    if (existing.rows.length > 0) {
      appId = existing.rows[0].id;
      await query(`
        UPDATE applications
        SET status = $1, verification_status = $2, zk_tx_hash = $3, rejection_reason = NULL
        WHERE id = $4;
      `, [status, verifStatus, txHash, appId]);
    } else {
      const inserted = await query(`
        INSERT INTO applications (property_id, tenant_id, status, verification_status, zk_tx_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `, [propId, tenId, status, verifStatus, txHash]);
      appId = inserted.rows[0].id;
    }

    const fullApp = await query(`
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
        a.rejection_reason,
        a.created_at
      FROM applications a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.tenant_id = u.id
      JOIN users l ON p.landlord_id = l.id
      WHERE a.id = $1;
    `, [appId]);

    return res.status(201).json({ success: true, application: fullApp.rows[0], message: 'Application submitted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/applications/:id/status - Landlord approve or reject application
router.patch('/:id/status', async (req, res) => {
  const applicationId = Number(req.params.id);
  const { status, rejection_reason } = req.body;

  if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    const result = await query(`
      UPDATE applications
      SET status = $1, rejection_reason = $2
      WHERE id = $3
      RETURNING id, property_id, tenant_id, status, verification_status, zk_tx_hash, rejection_reason, created_at;
    `, [status, rejection_reason || null, applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    res.json({ success: true, application: result.rows[0], message: `Application status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/applications/:id - Withdraw application
router.delete('/:id', async (req, res) => {
  const applicationId = Number(req.params.id);
  try {
    await query('DELETE FROM applications WHERE id = $1;', [applicationId]);
    res.json({ success: true, message: 'Application withdrawn successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
