import express from 'express';
import { saveProgress, getStudentProgress } from '../controllers/progressController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save progress
router.post('/', authMiddleware, saveProgress);

// Get student progress
router.get('/', authMiddleware, getStudentProgress);

export default router;
