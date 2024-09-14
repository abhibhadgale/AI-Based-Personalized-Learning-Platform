import { Router } from 'express';
import { getContent, uploadNotes, getVideos } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Get content by subject and unit
router.get('/:subject/:unit', protect, getContent);

// Upload notes (protected route)
router.post('/upload/notes', protect, uploadNotes);

// Fetch videos related to the unit
router.get('/videos/:unit', protect, getVideos);

export default router;
