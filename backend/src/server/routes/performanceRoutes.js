import express from 'express';
import {
  getAllReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/performanceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles('Admin', 'HR Manager'), getAllReviews);
router.get('/my', getMyReviews);
router.post('/', authorizeRoles('Admin', 'HR Manager'), createReview);
router.put('/:id', authorizeRoles('Admin', 'HR Manager'), updateReview);
router.delete('/:id', authorizeRoles('Admin'), deleteReview);

export default router;
