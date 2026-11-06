import express from 'express';
import {
  getAllLeaves,
  getMyLeaves,
  applyLeave,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles('Admin', 'HR Manager'), getAllLeaves);
router.get('/my', getMyLeaves);
router.post('/', applyLeave);
router.put('/:id/status', authorizeRoles('Admin', 'HR Manager'), updateLeaveStatus);

export default router;
