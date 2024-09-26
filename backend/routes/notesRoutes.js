// notesRoutes.js
import { Router } from 'express';
import { getNoteById } from '../controllers/notesController.js';

const router = Router();

router.get('/:noteId', getNoteById);

export default router;
