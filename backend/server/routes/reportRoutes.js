// ============================================================================
// Report & Analytics Routes (/api/reports)
// ============================================================================

import express from 'express';
import { getSummaryStats } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummaryStats);

export default router;
