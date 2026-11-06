// ============================================================================
// Announcement Routes (/api/announcements)
// ============================================================================

import express from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAnnouncements);
router.post('/', authorizeRoles('Admin', 'HR Manager'), createAnnouncement);
router.delete('/:id', authorizeRoles('Admin', 'HR Manager'), deleteAnnouncement);

export default router;
