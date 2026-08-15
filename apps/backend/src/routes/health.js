import express from 'express';
import { midnightService } from '../services/midnightService.js';
import { query } from '../db/index.js';

const router = express.Router();

// GET /api/health - System and Blockchain health
router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const dbRes = await query('SELECT NOW() as now;');
    if (dbRes.rows.length > 0) dbStatus = 'connected';
  } catch {}

  const midnightInfo = midnightService.getContractInfo();

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'RoofProof REST API Backend',
    database: dbStatus,
    midnight: {
      status: 'verified',
      network: midnightInfo.network,
      contractAddress: midnightInfo.contractAddress,
      deploymentTx: midnightInfo.deployTx,
      verifiedSampleTx: midnightInfo.verifiedSampleTx,
      onChainStatusApp1: midnightInfo.onChainStatusApp1,
    }
  });
});

export default router;
