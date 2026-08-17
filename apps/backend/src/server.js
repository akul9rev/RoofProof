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

// Middlewares
app.use(cors());
app.use(express.json());
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
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`[RoofProof Backend] Server running on http://localhost:${config.port}`);
  console.log(`[RoofProof Backend] Midnight Preview Contract: ${config.midnight.contractAddress}`);
});

export default app;
