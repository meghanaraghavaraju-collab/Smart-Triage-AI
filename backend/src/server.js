import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seeds/seedDatabase.js';
import { Department } from './models/Department.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import triageRoutes from './routes/triageRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Process safety handlers
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});

dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Healthcheck & Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Triage AI – Healthcare Patient Triage API',
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      triage: '/api/triage',
      departments: '/api/departments',
      analytics: '/api/analytics',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Mount clinical routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server & Connect MongoDB
const startServer = async () => {
  const db = await connectDB();

  // If connected, check if departments exist; if not, seed initial data
  if (db) {
    try {
      const deptCount = await Department.countDocuments();
      if (deptCount === 0) {
        console.log('[Init] Fresh database detected. Seeding initial clinical data...');
        await seedDatabase();
      }
    } catch (e) {
      console.warn(`[Init] Auto-seed check skipped: ${e.message}`);
    }
  }

  app.listen(PORT, () => {
    console.log(`[Express] Smart Triage AI backend running on http://127.0.0.1:${PORT}`);
  });
};

startServer();

export default app;
