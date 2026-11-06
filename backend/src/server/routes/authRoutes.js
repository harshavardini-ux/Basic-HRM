import express from 'express';
import { register, login, getProfile, seedInitialData } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.post('/seed', seedInitialData);

export default router;
