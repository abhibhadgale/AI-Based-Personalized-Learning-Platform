import StudentProgress from '../models/StudentProgress.js';
import LearningPath from '../models/LearningPath.js';

// Get student's progress
export const getStudentProgress = async (req, res) => {
  const studentId = req.user.id;  // Assume user ID is in the request object after authentication

  try {
    const progress = await StudentProgress.findOne({ studentId });

    if (progress) {
      res.json(progress);
    } else {
      res.status(404).json({ message: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
};

// Get personalized learning path
export const getLearningPath = async (req, res) => {
  const studentId = req.user.id;

  try {
    const learningPath = await LearningPath.findOne({ studentId });

    if (learningPath) {
      res.json(learningPath);
    } else {
      res.status(404).json({ message: 'Learning path not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning path' });
  }
};
