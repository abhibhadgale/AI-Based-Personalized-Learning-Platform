import express from 'express';
import { getSubjectFundamental } from '../controllers/subjectfundamentalController.js'; 

const router = express.Router();

// Define the route to fetch the subject fundamentals
router.get('/', getSubjectFundamental);

export default router;
