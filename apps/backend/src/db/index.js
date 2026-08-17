import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: (process.env.DATABASE_URL.includes('render.com') || process.env.NODE_ENV === 'production')
        ? { rejectUnauthorized: false }
        : false,
    }
  : {
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
    };

export const pool = new Pool({
  ...connectionConfig,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[DB Pool Error]', err.message);
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
