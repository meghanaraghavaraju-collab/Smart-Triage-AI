
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seeds/seedDatabase.js';
import { Department } from './models/Department.js';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import triageRoutes from './routes/triageRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

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
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const db = await connectDB();

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

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Express] Smart Triage AI backend running on port ${PORT}`);
    });

  } catch (error) {
    console.error('[Server] Startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
