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
    console.error('[RoofProof DB] Init error:', err.message);
  } finally {
    client.release();
  }
}

/**
 * Seeds initial demo landlords, tenants, and properties.
 */
export async function seedData(clientOrPool = pool) {
  const client = clientOrPool.connect ? await clientOrPool.connect() : clientOrPool;
  const shouldRelease = Boolean(clientOrPool.connect);

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE applications, properties, users RESTART IDENTITY CASCADE;');

    // Seed 2 Landlords & 2 Tenants
    await client.query(`
      INSERT INTO users (id, name, email, password, role, phone, city, occupation, organization) VALUES
      (1, 'Rohan Mehta', 'rohan.mehta@roofproof.demo', 'password123', 'landlord', '+91 98200 11223', 'Coorg, KA', NULL, 'Mehta Luxury Estates'),
      (2, 'Priya Nair', 'priya.nair@roofproof.demo', 'password123', 'landlord', '+91 98450 33445', 'Jaipur, RJ', NULL, 'Heritage Living India'),
      (3, 'Arjun Sharma', 'arjun.sharma@roofproof.demo', 'password123', 'tenant', '+91 98765 43210', 'Bangalore, KA', 'Senior Software Engineer', NULL),
      (4, 'Neha Kapoor', 'neha.kapoor@roofproof.demo', 'password123', 'tenant', '+91 98111 22334', 'Mumbai, MH', 'Product Lead', NULL);
      ALTER SEQUENCE users_id_seq RESTART WITH 5;
    `);

    // Seed 6 Properties
    await client.query(`
      INSERT INTO properties (id, landlord_id, title, property_type, location, monthly_rent, income_threshold, description, image_url) VALUES
      (1, 1, 'Misty Valley Villa', 'Luxury Villa', 'Coorg, Karnataka', 65000, 195000, '3 BHK luxury villa with a private outdoor area, mountain views, furnished living spaces, and a modern kitchen.', '/houses/house1.jpg'),
      (2, 1, 'Royal Courtyard Residence', 'Heritage House', 'Udaipur, Rajasthan', 55000, 165000, 'Spacious heritage-style residence with a private courtyard, traditional interiors, large living areas, and a peaceful setting.', '/houses/house2.jpg'),
      (3, 1, 'Heritage Garden Bungalow', 'Bungalow', 'Ooty, Tamil Nadu', 48000, 144000, 'Charming 3 BHK bungalow with a large garden, traditional architecture, wooden interiors, spacious rooms, and a peaceful hill-station setting.', '/houses/house3.jpg'),
      (4, 1, 'Greenview Family Home', 'Family House', 'Bangalore, Karnataka', 38000, 114000, 'Comfortable 3 BHK family home with generous natural light, multiple balconies, a quiet neighborhood, and nearby residential amenities.', '/houses/house4.jpg'),
      (5, 2, 'Pink Palace Residence', 'Luxury Residence', 'Jaipur, Rajasthan', 72000, 216000, 'Elegant 3 BHK residence inspired by Jaipur architecture, featuring ornate interiors, spacious common areas, and a distinctive heritage character.', '/houses/house5.jpg'),
      (6, 2, 'Glassfront Modern Estate', 'Modern Villa', 'Kolkata, West Bengal', 52000, 156000, 'Characterful independent modern villa with glass facades, bright interiors, private entry, and a quiet residential setting.', '/houses/house6.jpg');
      ALTER SEQUENCE properties_id_seq RESTART WITH 7;
    `);

    await client.query('COMMIT');
    console.log('[RoofProof DB] ✓ Successfully seeded database with 4 users and 6 properties.');
    return { success: true, message: 'Database seeded with 4 users and 6 properties' };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[RoofProof DB] Seed failed:', err.message);
    throw err;
  } finally {
    if (shouldRelease) client.release();
  }
}
