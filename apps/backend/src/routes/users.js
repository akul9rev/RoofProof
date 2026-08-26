import express from 'express';
import { pool } from '../db/index.js';
import { memoryStore } from '../db/memoryStore.js';

const router = express.Router();

// GET /api/users - List all registered users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, city, occupation, organization, created_at FROM users ORDER BY id ASC'
    );
    return res.json({ success: true, users: result.rows });
  } catch (err) {
    const safeUsers = memoryStore.users.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    return res.json({ success: true, users: safeUsers });
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
    const checkResult = await pool.query(
      'SELECT id, name, email, password, role, phone, city, occupation, organization, created_at FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );
    const existing = checkResult.rows[0];

    // 1. SIGN IN MODE
    if (mode === 'signin') {
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Account not found: '${email}' is not registered in the database. Please check your email or switch to 'Create Account'.`,
        });
      }

      if (password && existing.password && existing.password !== password.trim()) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password. Please check your password and try again.',
        });
      }

      const userObj = { ...existing };
      delete userObj.password;
      return res.json({ success: true, user: userObj, message: 'Signed in successfully with password authentication.' });
    }

    // 2. CREATE ACCOUNT MODE
    if (existing) {
      const userObj = { ...existing };
      delete userObj.password;
      return res.json({ success: true, user: userObj, message: 'Account already registered in database. Signed in.' });
    }

    if (!role) {
      return res.status(400).json({ success: false, error: 'Account role (Tenant or Landlord) is required for registration.' });
    }

    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, city, occupation, organization)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, role, phone, city, occupation, organization, created_at`,
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

    return res.status(201).json({
      success: true,
      user: insertResult.rows[0],
      message: 'New user account registered and saved to database.',
    });
  } catch (err) {
    // Graceful memoryStore fallback
    console.warn('[RoofProof DB] User operation falling back to memory store:', err.message);
    const existingMem = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (mode === 'signin') {
      if (!existingMem) {
        return res.status(404).json({
          success: false,
          error: `Account not found: '${email}' is not registered. Please switch to 'Create Account'.`,
        });
      }
      if (password && existingMem.password && existingMem.password !== password.trim()) {
        return res.status(401).json({ success: false, error: 'Invalid password.' });
      }
      const userObj = { ...existingMem };
      delete userObj.password;
      return res.json({ success: true, user: userObj });
    }

    if (existingMem) {
      const userObj = { ...existingMem };
      delete userObj.password;
      return res.json({ success: true, user: userObj });
    }

    const newUser = {
      id: Date.now(),
      name: name?.trim() || email.split('@')[0],
      email: normalizedEmail,
      password: password?.trim() || 'password123',
      role: role || 'tenant',
      phone: phone?.trim() || null,
      city: city?.trim() || null,
      occupation: occupation?.trim() || null,
      organization: organization?.trim() || null,
      created_at: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    const userObj = { ...newUser };
    delete userObj.password;
    return res.status(201).json({ success: true, user: userObj });
  }
});

export default router;
