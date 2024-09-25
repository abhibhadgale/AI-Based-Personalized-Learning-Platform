import { Router } from 'express';
import { getAllSubjects, getSubjectById, getSubjectUnits } from '../controllers/subjectController.js';

const router = Router();

// GET /api/subjects
router.get('/', getAllSubjects);

// GET /api/subjects/:id
router.get('/:id', getSubjectById); // New route for getting a subject by ID

router.get('/units/:subjectID', getSubjectUnits);


export default router;
