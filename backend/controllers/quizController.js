import Quiz from '../models/Quiz.js';

// Create a quiz
export const createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quiz = await Quiz.create({ title, questions });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz' });
  }
};

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.quizId;

  try {
    const quiz = await Quiz.findById(quizId);

    if (quiz) {
      const result = calculateResults(quiz, answers);
      res.json(result);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

// Get quiz results
export const getQuizResults = async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const results = await Quiz.findById(quizId).select('results');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results' });
  }
};
