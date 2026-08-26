import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { initDb } from './db/init.js';
import usersRoutes from './routes/users.js';
import propertiesRoutes from './routes/properties.js';
import applicationsRoutes from './routes/applications.js';
import healthRoutes from './routes/health.js';
import pdfExtractRoutes from './routes/pdfExtract.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/pdf', pdfExtractRoutes);
app.use('/api/form16', pdfExtractRoutes);
app.use('/api/upload', uploadRoutes);

// Monolithic Static Frontend Serving (When built for production deployment)
const frontendDistPath = path.resolve(__dirname, '../../../apps/frontend/dist');
const altFrontendDistPath = path.resolve(__dirname, '../../frontend/dist');

const activeDistPath = fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : fs.existsSync(altFrontendDistPath)
  ? altFrontendDistPath
  : null;

if (activeDistPath) {
  console.log(`[RoofProof Monolith] Serving production React frontend from: ${activeDistPath}`);
  app.use(express.static(activeDistPath));

  // SPA Fallback for client-side routing (/tenant, /landlord, /privacy, etc.)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(activeDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Express Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = Number(process.env.PORT || config.port || 3001);

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[RoofProof Backend] Server running on 0.0.0.0:${PORT}`);
  console.log(`[RoofProof Backend] Midnight Preview Contract: ${config.midnight.contractAddress}`);

  // Automatically initialize tables & auto-seed if fresh database
  try {
    await initDb();
  } catch (err) {
    console.warn('[RoofProof DB] Auto-init skipped / connection pending:', err.message);
  }
});

export default app;
