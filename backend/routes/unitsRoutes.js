import { Router } from 'express';
import { getTopicsByUnitId } from '../controllers/unitsController.js';

const router = Router();

router.get('/:unitId/topics', getTopicsByUnitId);

export default router;
