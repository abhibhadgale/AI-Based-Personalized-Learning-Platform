import { Router } from 'express';
import { createQuiz, submitQuiz, getStudentQuizResults, getQuizById, getAllQuizzes } from '../controllers/quizController.js';  // Ensure getQuizById is imported
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Route to get the list of quizzes
router.get('/', getAllQuizzes);

// Create a new quiz (protected route)
router.post('/create', protect, createQuiz);

// Submit quiz answers (protected route)
router.post('/submit/:quizId', protect, submitQuiz);

// Get quiz results (protected route)
router.get('/results', protect, getStudentQuizResults);

// Get quiz by ID (public or protected depending on your needs)
router.get('/:id', getQuizById);  // Adjust protection if needed

export default router;
