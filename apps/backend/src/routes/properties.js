import express from 'express';
import { pool } from '../db/index.js';
import { memoryStore } from '../db/memoryStore.js';

const router = express.Router();

// GET /api/properties - Get all property listings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
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
  const {
    title, location, monthly_rent, income_threshold, description, image_url, property_type,
    landlord_id, landlordId, bedrooms, bathrooms, furnishing, area_sqft, parking, deposit,
    preferred_tenants, available_from, amenities, gallery
  } = req.body;

  if (!title || !location || !monthly_rent || !income_threshold || !description) {
    return res.status(400).json({
      success: false,
      error: 'All required fields (title, location, monthly_rent, income_threshold, description) must be provided.',
    });
  }

  const lid = landlord_id || landlordId || 1;

  try {
    const result = await pool.query(`
      INSERT INTO properties (
        landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url,
        bedrooms, bathrooms, furnishing, area_sqft, parking, deposit, preferred_tenants, available_from, amenities, gallery
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18::jsonb)
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
      bedrooms || '3 BHK',
      bathrooms || '3 Bathrooms',
      furnishing || 'Fully Furnished',
      area_sqft || '2,150 sq.ft',
      parking || 'Covered Parking',
      deposit || `₹${(Number(monthly_rent) * 2).toLocaleString('en-IN')}`,
      preferred_tenants || 'Families & Working Professionals',
      available_from || 'Immediate Move-in',
      JSON.stringify(amenities || []),
      JSON.stringify(gallery || []),
    ]);

    const property = result.rows[0];
    const landlordRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [property.landlord_id]);
    property.landlord_name = landlordRes.rows[0]?.name || req.body.landlord_name || 'Landlord';
    property.landlord_email = landlordRes.rows[0]?.email || req.body.landlord_email || null;

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
      bedrooms: bedrooms || '3 BHK',
      bathrooms: bathrooms || '3 Bathrooms',
      furnishing: furnishing || 'Fully Furnished',
      area_sqft: area_sqft || '2,150 sq.ft',
      parking: parking || 'Covered Parking',
      deposit: deposit || `₹${(Number(monthly_rent) * 2).toLocaleString('en-IN')}`,
      preferred_tenants: preferred_tenants || 'Families & Working Professionals',
      available_from: available_from || 'Immediate Move-in',
      amenities: amenities || [],
      gallery: gallery || [],
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
      LEFT JOIN users u ON a.tenant_id = u.id
      LEFT JOIN properties p ON a.property_id = p.id
      WHERE a.property_id = $1
      ORDER BY a.created_at DESC
    `, [req.params.id]);

    return res.json({ success: true, applications: result.rows });
  } catch (err) {
    const apps = memoryStore.applications.filter(a => String(a.property_id) === String(req.params.id));
    return res.json({ success: true, applications: apps });
  }
});

// DELETE /api/properties/:id - Delete property listing
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    const index = memoryStore.properties.findIndex(p => String(p.id) === String(req.params.id));
    if (index !== -1) memoryStore.properties.splice(index, 1);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  }
});

export default router;
