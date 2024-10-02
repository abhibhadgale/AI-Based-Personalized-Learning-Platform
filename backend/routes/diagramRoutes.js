import express from 'express';
import { getDiagramById } from '../controllers/diagramController.js';

const router = express.Router();

router.get('/:diagramId', getDiagramById);

export default router;
