import { Router } from 'express';
import { getTopicsByUnitId, getSubtopicCount } from '../controllers/unitsController.js';

const router = Router();

router.get('/:unitId/topics', getTopicsByUnitId);
router.get('/:unitId/subtopic-count', getSubtopicCount); // New Route


export default router;
