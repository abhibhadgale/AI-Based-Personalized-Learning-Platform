import express from 'express';
import { saveProgress } from '../controllers/progressController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();
router.post('/', authMiddleware, saveProgress);

export default router;
