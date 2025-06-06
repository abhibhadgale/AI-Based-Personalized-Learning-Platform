// routes/studentRoutes.js
import express from 'express';
import { getStudentData } from '../controllers/studentController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/data', authMiddleware, getStudentData);

export default router;