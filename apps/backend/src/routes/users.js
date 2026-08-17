import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET /api/users - List users
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, phone, city, occupation, organization, created_at FROM users ORDER BY id ASC;');
    res.json({ success: true, users: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users - Login or create user with detailed profile fields
router.post('/', async (req, res) => {
  const { name, email, role, phone, city, occupation, organization } = req.body;
  if (!email || !role) {
    return res.status(400).json({ success: false, error: 'Email and role (tenant/landlord) are required.' });
  }

  try {
    const existing = await query('SELECT id, name, email, role, phone, city, occupation, organization, created_at FROM users WHERE email = $1;', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.json({ success: true, user: existing.rows[0], message: 'Logged in as existing user' });
    }

    const inserted = await query(
      `INSERT INTO users (name, email, role, phone, city, occupation, organization)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, phone, city, occupation, organization, created_at;`,
      [
        name?.trim() || email.split('@')[0],
        email.trim().toLowerCase(),
        role,
        phone?.trim() || null,
        city?.trim() || null,
        occupation?.trim() || null,
        organization?.trim() || null,
      ]
    );
    res.status(201).json({ success: true, user: inserted.rows[0], message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
