import express from 'express';
import { pool } from '../db/index.js';
import { seedData, initDb } from '../db/init.js';
import { midnightService } from '../services/midnightService.js';

const router = express.Router();

// GET /api/health - System and Blockchain health
router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = await pool.query('SELECT 1 as healthy');
    if (result.rows?.[0]?.healthy === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  const midnightInfo = midnightService.getContractInfo();

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'RoofProof REST API Backend',
    database: dbStatus,
    dbType: 'PostgreSQL',
    midnight: {
      status: 'verified',
      network: midnightInfo.network,
      contractAddress: midnightInfo.contractAddress,
      deploymentTx: midnightInfo.deployTx,
      verifiedSampleTx: midnightInfo.verifiedSampleTx,
      onChainStatusApp1: midnightInfo.onChainStatusApp1,
    },
  });
});

// POST /api/health/seed - 1-Click Database Reset / Re-seed Endpoint
router.post('/seed', async (req, res) => {
  try {
    await initDb();
    const result = await seedData();
    res.json({
      success: true,
      message: 'Database tables initialized and seeded with 4 demo users and 6 rental properties.',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
