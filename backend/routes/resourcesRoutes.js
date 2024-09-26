import express from 'express';
import { getResourceById } from '../controllers/resourcesController.js';

const router = express.Router();

// Route to get resource by ID
router.get('/:id', getResourceById);

export default router;
