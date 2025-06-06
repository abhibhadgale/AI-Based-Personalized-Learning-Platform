import express from 'express';
import { saveMessage, getChatHistory, clearChatHistory } from '../controllers/chatHistoryController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', authMiddleware, saveMessage);
router.get('/', authMiddleware, getChatHistory);
router.delete('/', authMiddleware, clearChatHistory);


export default router;
