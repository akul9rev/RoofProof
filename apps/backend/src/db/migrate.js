import { pool } from './index.js';

export async function migrate() {
  console.log('[DB Migrate] Resetting and migrating database with Cloudinary hosted CDN property images...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users Table
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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'password123';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS organization VARCHAR(100);
    `);

    // 2. Properties Table
    await client.query(`
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
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_url TEXT;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type TEXT;
    `);

    // 3. Applications Table
    await client.query(`
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
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `);

    // 4. Wipe all stale data cleanly
    await client.query('TRUNCATE TABLE applications, properties, users RESTART IDENTITY CASCADE;');

    // 5. Seed Real Landlords (2) & Tenants (2)
    console.log('[DB Migrate] Seeding 2 Landlords and 2 Tenants with Cloudinary image management...');
    await client.query(`
      INSERT INTO users (id, name, email, password, role, phone, city, occupation, organization) VALUES
      (1, 'Rohan Mehta', 'rohan.mehta@roofproof.demo', 'password123', 'landlord', '+91 98200 11223', 'Coorg, KA', NULL, 'Mehta Luxury Estates'),
      (2, 'Priya Nair', 'priya.nair@roofproof.demo', 'password123', 'landlord', '+91 98450 33445', 'Jaipur, RJ', NULL, 'Heritage Living India'),
      (3, 'Arjun Sharma', 'arjun.sharma@roofproof.demo', 'password123', 'tenant', '+91 98765 43210', 'Bangalore, KA', 'Senior Software Engineer', NULL),
      (4, 'Neha Kapoor', 'neha.kapoor@roofproof.demo', 'password123', 'tenant', '+91 98111 22334', 'Mumbai, MH', 'Product Lead', NULL);
      ALTER SEQUENCE users_id_seq RESTART WITH 5;
    `);

    // 6. Seed 6 Real Properties with Cloudinary Hosted CDN Image URLs
    console.log('[DB Migrate] Seeding 6 properties with Cloudinary CDN URLs...');
    await client.query(`
      INSERT INTO properties (id, landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url) VALUES
      (1, 1, 'Misty Valley Villa', 'Luxury Villa', 'Coorg, Karnataka', 65000, 195000, '3 BHK luxury villa with a private outdoor area, mountain views, furnished living spaces, and a modern kitchen.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900001/roofproof/properties/house1_colonial_mansion.jpg'),
      (2, 1, 'Royal Courtyard Residence', 'Heritage House', 'Udaipur, Rajasthan', 55000, 165000, 'Spacious heritage-style residence with a private courtyard, traditional interiors, large living areas, and a peaceful setting.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900002/roofproof/properties/house2_royal_courtyard.jpg'),
      (3, 1, 'Heritage Garden Bungalow', 'Bungalow', 'Ooty, Tamil Nadu', 48000, 144000, 'Charming 3 BHK bungalow with a large garden, traditional architecture, wooden interiors, spacious rooms, and a peaceful hill-station setting.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900003/roofproof/properties/house3_ooty_bungalow.jpg'),
      (4, 1, 'Greenview Family Home', 'Family House', 'Bangalore, Karnataka', 38000, 114000, 'Comfortable 3 BHK family home with generous natural light, multiple balconies, a quiet neighborhood, and nearby residential amenities.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900004/roofproof/properties/house4_modern_estate.jpg'),
      (5, 2, 'Pink Palace Residence', 'Luxury Residence', 'Jaipur, Rajasthan', 72000, 216000, 'Elegant 3 BHK residence inspired by Jaipur architecture, featuring ornate interiors, spacious common areas, and a distinctive heritage character.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900005/roofproof/properties/house5_pink_palace.jpg'),
      (6, 2, 'Glassfront Modern Estate', 'Modern Villa', 'Kolkata, West Bengal', 52000, 156000, 'Characterful independent modern villa with glass facades, bright interiors, private entry, and a quiet residential setting.', 'https://res.cloudinary.com/roofproof-cdn/image/upload/v1723900006/roofproof/properties/house6_glass_villa.jpg');
      ALTER SEQUENCE properties_id_seq RESTART WITH 7;
    `);

    await client.query('COMMIT');
    console.log('[DB Migrate] ✓ Migration completed: 6 properties seeded with Cloudinary CDN URLs.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB Migrate Error]', err.message);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.endsWith('migrate.js')) {
  migrate().then(() => process.exit(0)).catch(() => process.exit(1));
}
