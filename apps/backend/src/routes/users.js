import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET /api/users - List all registered users
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, phone, city, occupation, organization, created_at FROM users ORDER BY id ASC;');
    res.json({ success: true, users: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users - Strict Sign In or Create Account with DB verification
router.post('/', async (req, res) => {
  const { name, email, role, phone, city, occupation, organization, mode = 'signin' } = req.body;
  if (!email || !role) {
    return res.status(400).json({ success: false, error: 'Email and role (tenant/landlord) are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await query(
      'SELECT id, name, email, role, phone, city, occupation, organization, created_at FROM users WHERE LOWER(email) = $1;',
      [normalizedEmail]
    );

    // SIGN IN MODE: Strict verification that user exists in database
    if (mode === 'signin') {
      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Account not found: '${email}' is not registered in the database. Please verify your email or switch to 'Create Account' to register.`,
        });
      }
      return res.json({
        success: true,
        user: existing.rows[0],
        message: 'Signed in successfully as existing database user.',
      });
    }

    // SIGN UP / CREATE ACCOUNT MODE: Create new database record if not existing
    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        user: existing.rows[0],
        message: 'Account already registered in database. Signed in.',
      });
    }

    const inserted = await query(
      `INSERT INTO users (name, email, role, phone, city, occupation, organization)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, phone, city, occupation, organization, created_at;`,
      [
        name?.trim() || email.split('@')[0],
        normalizedEmail,
        role,
        phone?.trim() || null,
        city?.trim() || null,
        occupation?.trim() || null,
        organization?.trim() || null,
      ]
    );

    res.status(201).json({
      success: true,
      user: inserted.rows[0],
      message: 'New user account registered and saved to database.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
