import { Router } from 'express';
import { getStudentProgress, getLearningPath } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Get student's progress (protected route)
router.get('/progress', protect, getStudentProgress);

// Get personalized learning path (protected route)
router.get('/learning-path', protect, getLearningPath);

export default router;
