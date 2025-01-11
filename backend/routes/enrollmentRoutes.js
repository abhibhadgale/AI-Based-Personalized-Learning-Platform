import express from 'express';
import { protect as authMiddleware } from '../middleware/authMiddleware.js'; // Importing the middleware
import { checkEnrollment } from '../controllers/enrollmentController.js';

const router = express.Router();

// Define the route to check if a student is enrolled
router.get('/check/:subjectId', authMiddleware, checkEnrollment);

export default router;
