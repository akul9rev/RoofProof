import { pool } from './index.js';

/**
 * Initializes tables if they do not exist, and automatically seeds initial
 * users and listings if the database is empty on server startup.
 */
export async function initDb() {
  const client = await pool.connect();
  try {
    // 1. Create tables if they do not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL DEFAULT 'password123',
        role VARCHAR(50) NOT NULL CHECK (role IN ('tenant', 'landlord')),
        phone VARCHAR(50),
        city VARCHAR(100),
        occupation VARCHAR(100),
        organization VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        landlord_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        property_type VARCHAR(100) DEFAULT 'Family Apartment',
        location VARCHAR(255) NOT NULL,
        monthly_rent NUMERIC(12, 2) NOT NULL,
        income_threshold NUMERIC(12, 2) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        verification_status VARCHAR(50) NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'eligible', 'ineligible')),
        zk_tx_hash VARCHAR(255),
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Extended Specification & Gallery Columns
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms VARCHAR(100) DEFAULT '3 BHK';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms VARCHAR(100) DEFAULT '3 Bathrooms';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing VARCHAR(100) DEFAULT 'Fully Furnished';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_sqft VARCHAR(100) DEFAULT '2,150 sq.ft';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking VARCHAR(255) DEFAULT 'Covered Parking';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS deposit VARCHAR(100) DEFAULT '2 Months Rent';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS preferred_tenants VARCHAR(255) DEFAULT 'Families & Working Professionals';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_from VARCHAR(100) DEFAULT 'Immediate Move-in';
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
    `);

    // 2. Check if users table is empty; if so, automatically seed
    const userCountRes = await client.query('SELECT COUNT(*)::int AS count FROM users');
    const userCount = userCountRes.rows[0]?.count || 0;

    if (userCount === 0) {
      console.log('[RoofProof DB] Fresh database detected. Auto-seeding initial users and properties...');
      await seedData(client);
    } else {
      console.log(`[RoofProof DB] ✓ Database connected (${userCount} users found).`);
    }
  } catch (err) {
    console.warn('[RoofProof DB] Auto-init skipped / connection pending:', err.message);
  } finally {
    client.release();
  }
}

export async function seedData(passedClient) {
  const client = passedClient || await pool.connect();
  const shouldRelease = !passedClient;
  try {
    const users = [
      ['Rohan Mehta', 'rohan.mehta@roofproof.demo', 'password123', 'landlord', '+91 98200 11223', 'Coorg, KA', null, 'Mehta Luxury Estates'],
      ['Priya Nair', 'priya.nair@roofproof.demo', 'password123', 'landlord', '+91 98450 33445', 'Jaipur, RJ', null, 'Heritage Living India'],
      ['Arjun Sharma', 'arjun.sharma@roofproof.demo', 'password123', 'tenant', '+91 98765 43210', 'Bangalore, KA', 'Senior Software Engineer', null],
      ['Neha Kapoor', 'neha.kapoor@roofproof.demo', 'password123', 'tenant', '+91 98111 22334', 'Mumbai, MH', 'Product Lead', null],
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO users (name, email, password, role, phone, city, occupation, organization)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING
      `, u);
    }

    const props = [
      [1, 'Misty Valley Villa', 'Luxury Villa', 'Coorg, Karnataka', 65000, 195000, '3 BHK luxury villa with mountain views.', '/houses/house1.jpg', '3 BHK', '3 Bathrooms', 'Fully Furnished', '2,400 sq.ft', 'Covered (2 Cars + 2 Bikes)', '₹1,30,000 (2 Months)', 'Families & Working Professionals', 'Immediate Move-in', JSON.stringify(['Mountain View', 'Private Balcony', 'Modular Kitchen', '24/7 Power Backup'])],
      [1, 'Royal Courtyard Residence', 'Heritage House', 'Udaipur, Rajasthan', 55000, 165000, 'Spacious heritage residence.', '/houses/house2.jpg', '3 BHK', '3 Bathrooms', 'Fully Furnished', '2,100 sq.ft', 'Open Courtyard (2 Cars)', '₹1,10,000 (2 Months)', 'Families & Expats', 'Immediate Move-in', JSON.stringify(['Private Courtyard', 'Traditional Architecture', 'Modular Kitchen'])],
      [1, 'Heritage Garden Bungalow', 'Bungalow', 'Ooty, Tamil Nadu', 48000, 144000, 'Charming bungalow with garden.', '/houses/house3.jpg', '3 BHK', '2 Bathrooms', 'Semi-Furnished', '1,950 sq.ft', 'Dedicated Car Porch (1 Car)', '₹96,000 (2 Months)', 'Families & Remote Workers', 'Immediate Move-in', JSON.stringify(['Private Botanical Garden', 'Fireplace'])],
      [1, 'Greenview Family Home', 'Family House', 'Bangalore, Karnataka', 38000, 114000, 'Comfortable 3 BHK family home.', '/houses/house4.jpg', '3 BHK', '2 Bathrooms', 'Semi-Furnished', '1,650 sq.ft', 'Covered Parking (1 Car)', '₹76,000 (2 Months)', 'Families & Professionals', 'Immediate Move-in', JSON.stringify(['Multiple Balconies', 'Park Facing'])],
      [2, 'Pink Palace Residence', 'Luxury Residence', 'Jaipur, Rajasthan', 72000, 216000, 'Elegant 3 BHK Jaipur residence.', '/houses/house5.jpg', '3 BHK', '3 Bathrooms', 'Fully Furnished', '2,600 sq.ft', 'Covered Parking (2 Cars)', '₹1,44,000 (2 Months)', 'Families & Corporate Executives', 'Immediate Move-in', JSON.stringify(['Rooftop Terrace', 'Jaipur Architecture'])],
      [2, 'Glassfront Modern Estate', 'Modern Villa', 'Kolkata, West Bengal', 52000, 156000, 'Modern villa with glass facades.', '/houses/house6.jpg', '3 BHK', '3 Bathrooms', 'Fully Furnished', '2,300 sq.ft', 'Covered Parking (1 Car + 2 Bikes)', '₹1,04,000 (2 Months)', 'Any Working Professionals', 'Immediate Move-in', JSON.stringify(['Floor-to-Ceiling Glass', 'Private Garden'])],
    ];

    for (const p of props) {
      await client.query(`
        INSERT INTO properties (landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url, bedrooms, bathrooms, furnishing, area_sqft, parking, deposit, preferred_tenants, available_from, amenities)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb)
      `, p);
    }

    console.log('[RoofProof DB] Seed completed successfully.');
  } finally {
    if (shouldRelease) {
      client.release();
    }
  }
}
