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

    // 3. Applications Table (STRICT: NO income, NO financial docs, NO private ZK witness)
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

    await client.query('COMMIT');
    console.log('[DB Migrate] ✓ Migrations completed successfully.');
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
