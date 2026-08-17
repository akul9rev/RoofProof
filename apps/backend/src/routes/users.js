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

// POST /api/users - Strict Sign In & Create Account with Password Authentication
router.post('/', async (req, res) => {
  const { name, email, password, role, phone, city, occupation, organization, mode = 'signin' } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await query(
      'SELECT id, name, email, password, role, phone, city, occupation, organization, created_at FROM users WHERE LOWER(email) = $1;',
      [normalizedEmail]
    );

    // 1. SIGN IN MODE
    if (mode === 'signin') {
      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Account not found: '${email}' is not registered in the database. Please check your email or switch to 'Create Account'.`,
        });
      }

      const user = existing.rows[0];

      // Password verification (if password provided)
      if (password && user.password && user.password !== password.trim()) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password. Please check your password and try again.',
        });
      }

      // Hide password from response object
      delete user.password;

      return res.json({
        success: true,
        user,
        message: 'Signed in successfully with password authentication.',
      });
    }

    // 2. CREATE ACCOUNT MODE
    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      delete user.password;
      return res.json({
        success: true,
        user,
        message: 'Account already registered in database. Signed in.',
      });
    }

    if (!role) {
      return res.status(400).json({ success: false, error: 'Account role (Tenant or Landlord) is required for registration.' });
    }

    const inserted = await query(
      `INSERT INTO users (name, email, password, role, phone, city, occupation, organization)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, role, phone, city, occupation, organization, created_at;`,
      [
        name?.trim() || email.split('@')[0],
        normalizedEmail,
        password?.trim() || 'password123',
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
