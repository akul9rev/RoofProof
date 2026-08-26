import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config.js';

export const pool = new Pool({
  connectionString: config.db.connectionString,
  ssl: config.db.ssl,
});

pool.on('error', (err) => {
  console.error('[RoofProof DB] Unexpected error on idle client:', err);
});

export default pool;
