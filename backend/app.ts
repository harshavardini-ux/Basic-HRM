import express from 'express';
import cors from 'cors';
import { connectDB, getDbStatus } from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import employeeRoutes from './server/routes/employeeRoutes.js';
import departmentRoutes from './server/routes/departmentRoutes.js';
import attendanceRoutes from './server/routes/attendanceRoutes.js';
import leaveRoutes from './server/routes/leaveRoutes.js';
import performanceRoutes from './server/routes/performanceRoutes.js';
import announcementRoutes from './server/routes/announcementRoutes.js';
import reportRoutes from './server/routes/reportRoutes.js';
import { seedInitialData } from './server/controllers/authController.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Basic HRM - Human Resource Management System',
    database: getDbStatus(),
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]:', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

let backendReady: Promise<void> | null = null;

export const initializeBackend = () => {
  if (!backendReady) {
    backendReady = (async () => {
      await connectDB();

      try {
        const mockReq = { query: { force: 'false' } };
        const mockRes = { json: () => {}, status: () => ({ json: () => {} }) };
        await seedInitialData(mockReq, mockRes);
        console.log('[Server] Default seed data checked and ready.');
      } catch (err: any) {
        console.warn('[Server] Seed check error (non-fatal):', err?.message || err);
      }
    })().catch((error) => {
      backendReady = null;
      throw error;
    });
  }

  return backendReady;
};
