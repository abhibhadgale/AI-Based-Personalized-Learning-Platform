import { Router } from 'express';
import { register, login, getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// User registration route
router.post('/register', register);

// User login route
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', protect, getProfile);

export default router;
