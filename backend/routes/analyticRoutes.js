import express from 'express';
import { getQuizResultsByStudent } from '../controllers/analyticController.js';

const router = express.Router();

// GET quiz results of a student
router.get('/results/:studentId', getQuizResultsByStudent);

export default router;
