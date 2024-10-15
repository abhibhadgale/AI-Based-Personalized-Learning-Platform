import express from 'express';
import { createUserProfile, updateUserProfileCompletion } from '../controllers/userProfileController.js';
import { protect } from '../middleware/authMiddleware.js'; // If authentication is required

const router = express.Router();

router.post('/profile', protect, createUserProfile);
router.patch('/profile-completion', protect, updateUserProfileCompletion);

export default router;
