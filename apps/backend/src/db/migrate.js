import { pool } from './index.js';

export async function migrate() {
  console.log('[DB Migrate] Running PostgreSQL migrations for RoofProof...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('tenant', 'landlord')),
        phone VARCHAR(50),
        city VARCHAR(100),
        occupation VARCHAR(100),
        organization VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
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

    // 4. Seed Real Landlords & Tenants if table is empty
    const userCheck = await client.query('SELECT COUNT(*) FROM users;');
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      console.log('[DB Migrate] Seeding real landlords & tenants...');
      await client.query(`
        INSERT INTO users (id, name, email, role, phone, city, occupation, organization) VALUES
        (1, 'Rohan Mehta', 'rohan.mehta@roofproof.demo', 'landlord', '+91 98200 11223', 'Coorg, KA', NULL, 'Mehta Luxury Estates'),
        (2, 'Priya Nair', 'priya.nair@roofproof.demo', 'landlord', '+91 98450 33445', 'Jaipur, RJ', NULL, 'Heritage Living India'),
        (3, 'Arjun Sharma', 'arjun.sharma@roofproof.demo', 'tenant', '+91 98765 43210', 'Bangalore, KA', 'Senior Software Engineer', NULL),
        (4, 'Neha Kapoor', 'neha.kapoor@roofproof.demo', 'tenant', '+91 98111 22334', 'Mumbai, MH', 'Product Lead', NULL);
        ALTER SEQUENCE users_id_seq RESTART WITH 5;
      `);
    }

    // 5. Seed Real Properties from landlords if table is empty
    const propCheck = await client.query('SELECT COUNT(*) FROM properties;');
    if (parseInt(propCheck.rows[0].count, 10) === 0) {
      console.log('[DB Migrate] Seeding real property listings from Rohan Mehta & Priya Nair...');
      await client.query(`
        INSERT INTO properties (id, landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url) VALUES
        (1, 1, 'Misty Valley Pool Villa', 'Luxury Villa', 'Coorg, Karnataka', 65000, 195000, '3 BHK luxury villa with a private pool, spacious outdoor area, mountain views, furnished living spaces, and a modern kitchen.', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
        (2, 1, 'Royal Courtyard Residence', 'Heritage House', 'Udaipur, Rajasthan', 55000, 165000, 'Spacious heritage-style residence with a private courtyard, traditional interiors, large living areas, and a peaceful setting.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
        (3, 1, 'Greenview Family Home', 'Family House', 'Bangalore, Karnataka', 38000, 114000, 'Comfortable 3 BHK family home with generous natural light, multiple balconies, a quiet neighborhood, and nearby residential amenities.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'),
        (4, 1, 'Heritage Garden Bungalow', 'Bungalow', 'Ooty, Tamil Nadu', 48000, 144000, 'Charming 3 BHK bungalow with a large garden, traditional architecture, wooden interiors, spacious rooms, and a peaceful hill-station setting.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'),
        (5, 2, 'Pink Palace Residence', 'Luxury Residence', 'Jaipur, Rajasthan', 72000, 216000, 'Elegant 3 BHK residence inspired by Jaipur architecture, featuring ornate interiors, spacious common areas, and a distinctive heritage character.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
        (6, 2, 'Colorful Heritage Home', 'Independent House', 'Kolkata, West Bengal', 32000, 96000, 'Characterful 2 BHK independent home with colorful traditional architecture, bright interiors, private entry, and a quiet residential setting.', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80'),
        (7, 2, 'Traditional Courtyard House', 'Family House', 'Madurai, Tamil Nadu', 28000, 84000, 'Traditional 3 BHK family house with a covered front veranda, spacious rooms, tiled flooring, classic woodwork, and a private entrance.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80');
        ALTER SEQUENCE properties_id_seq RESTART WITH 8;
      `);
    }

    await client.query('COMMIT');
    console.log('[DB Migrate] ✓ Migrations & Real Dataset Seeding completed successfully.');
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
