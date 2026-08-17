import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import usersRoutes from './routes/users.js';
import propertiesRoutes from './routes/properties.js';
import applicationsRoutes from './routes/applications.js';
import healthRoutes from './routes/health.js';
import pdfExtractRoutes from './routes/pdfExtract.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// Production CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://roofproof-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/pdf', pdfExtractRoutes);
app.use('/api/form16', pdfExtractRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = Number(process.env.PORT || config.port || 4000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[RoofProof Backend] Server running on 0.0.0.0:${PORT}`);
  console.log(`[RoofProof Backend] Midnight Preview Contract: ${config.midnight.contractAddress}`);
});

export default app;
