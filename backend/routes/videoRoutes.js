import express from 'express';
import { getVideoById } from '../controllers/videoController.js';

const router = express.Router();

// Route to fetch a video by topicVideoId
router.get('/:videoId', getVideoById);

export default router;
