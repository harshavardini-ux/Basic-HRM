import express from 'express';
import {
  getAttendance,
  getMyAttendance,
  markAttendance,
  updateAttendance
} from '../controllers/attendanceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles('Admin', 'HR Manager'), getAttendance);
router.get('/my', getMyAttendance);
router.post('/mark', markAttendance);
router.put('/:id', authorizeRoles('Admin', 'HR Manager'), updateAttendance);

export default router;
