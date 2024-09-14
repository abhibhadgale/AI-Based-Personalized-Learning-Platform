import { Router } from 'express';
import { createQuiz, submitQuiz, getQuizResults } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new quiz (protected route)
router.post('/create', protect, createQuiz);

// Submit quiz answers (protected route)
router.post('/submit/:quizId', protect, submitQuiz);

// Get quiz results (protected route)
router.get('/results/:quizId', protect, getQuizResults);

export default router;
