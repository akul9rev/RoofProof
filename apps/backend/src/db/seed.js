import { pool } from './index.js';
import { migrate } from './migrate.js';

export async function seed() {
  await migrate();
  console.log('[DB Seed] Seeding demo users and rental properties...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clean existing records
    await client.query('TRUNCATE TABLE applications, properties, users RESTART IDENTITY CASCADE;');

    // Seed Landlord and Tenant
    const userRes = await client.query(`
      INSERT INTO users (name, email, role) VALUES
      ('Arjun Sharma (Landlord)', 'arjun.landlord@roofproof.io', 'landlord'),
      ('Priya Patel (Tenant)', 'priya.tenant@roofproof.io', 'tenant'),
      ('Rohit Verma (Tenant)', 'rohit.tenant@roofproof.io', 'tenant')
      RETURNING id, name, role;
    `);

    const landlordId = userRes.rows[0].id;
    const tenantId1 = userRes.rows[1].id;
    const tenantId2 = userRes.rows[2].id;

    // Seed Properties
    const propRes = await client.query(`
      INSERT INTO properties (landlord_id, title, location, monthly_rent, income_threshold, description) VALUES
      ($1, 'Luxury 2BHK High-Rise Apartment', 'Indiranagar, Bangalore', 25000.00, 60000.00, 'Modern, semi-furnished 2BHK with balcony, 24/7 power backup, gym, and swimming pool. Close to Metro.'),
      ($1, 'Spacious 3BHK Sea-View Penthouse', 'Bandra West, Mumbai', 65000.00, 150000.00, 'Ultra-luxury sea-facing penthouse with modular Italian kitchen, private terrace, and dedicated covered parking.'),
      ($1, 'Cozy 1BHK Studio Apartment', 'Cyber City, Gurgaon', 18000.00, 45000.00, 'Fully furnished studio apartment ideal for IT professionals. Includes high-speed WiFi and maintenance.')
      RETURNING id, title, income_threshold;
    `, [landlordId]);

    // Seed Verified Demo Application on Property 1 matching our verified on-chain Midnight verification
    await client.query(`
      INSERT INTO applications (property_id, tenant_id, status, verification_status, zk_tx_hash) VALUES
      ($1, $2, 'approved', 'eligible', '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c'),
      ($3, $4, 'pending', 'unverified', NULL);
    `, [propRes.rows[0].id, tenantId1, propRes.rows[1].id, tenantId2]);

    await client.query('COMMIT');
    console.log('[DB Seed] ✓ Seeding completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB Seed Error]', err.message);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
