import { StudentQuizResult } from '../models/Quiz.js'; // adjust path if needed

// GET /api/quiz-results/:studentId
export const getQuizResultsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const quizResults = await StudentQuizResult.find({ studentId })
      .populate('quizId', 'title') // populates quiz title
      .sort({ quizDate: -1 });     // latest first

    const quizData = quizResults.map(result => ({
      name: result.quizId?.title || 'Untitled Quiz',
      score: result.score,
      total: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      date: result.quizDate
    }));

    res.status(200).json({ quizData });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Failed to fetch quiz results" });
  }
};
