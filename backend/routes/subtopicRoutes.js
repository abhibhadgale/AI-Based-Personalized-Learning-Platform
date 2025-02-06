import express from 'express';
import { getSubtopicById } from '../controllers/subtopicController.js';

const router = express.Router();
router.get('/:subtopicId', getSubtopicById);

export default router;
