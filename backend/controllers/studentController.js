// controllers/studentController.js
import Student from '../models/Student.js';
import StudentBehaviour from '../models/StudentBehaviour.js';
import StudentPerformance from '../models/StudentPerformance.js';
import StudentProgress from '../models/StudentProgress.js';
import { StudentQuizResult } from '../models/Quiz.js';

export const getStudentData = async (req, res) => {
  const { studentId } = req.query;
  
  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required." });
  }

  try {
    // Fetch all related data using Promise.all
    const [student, behaviour, performance, progress, quizResults] = await Promise.all([
      Student.findById(studentId),
      StudentBehaviour.findOne({ studentId }),
      StudentPerformance.findOne({ studentId }),
      StudentProgress.findOne({ studentId }),
      StudentQuizResult.find({ studentId })
    ]);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json({
      student,
      behaviour,
      performance,
      progress,
      quizResults
    });
    
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};