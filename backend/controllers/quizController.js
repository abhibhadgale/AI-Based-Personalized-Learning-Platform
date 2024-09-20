import Quiz from '../models/Quiz.js';
import { StudentQuizResult } from '../models/Quiz.js'; // Make sure this is correctly exported from your models



// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Adjust according to your database model
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a quiz
export const createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quiz = await Quiz.create({ title, questions });
    res.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: `Error creating quiz: ${error.message}` });
  }
};

// Submit quiz answers and calculate results
export const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.quizId;
  const studentId = req.user._id;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate correct answers and score
    let correctAnswersCount = 0;
    const totalQuestions = quiz.questions.length;

    // Iterate over the questions using their index
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]; // Get the answer based on the index
      console.log(`Question Index: ${index}, User Answer: ${userAnswer}, Correct Answer: ${question.correctAnswer}`);
      
      // Compare the user's answer with the correct answer
      if (userAnswer !== undefined && userAnswer === parseInt(question.correctAnswer)) {
        correctAnswersCount++;
      }
    });

    const score = (correctAnswersCount / totalQuestions) * 100;

    // Save the quiz result for the student
    const result = await StudentQuizResult.create({
      studentId,
      quizId,
      subject: quiz.title,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      quizDate: new Date(),
    });

    // Return a simplified result response
    res.json({
      quizId: quiz._id,
      subject: quiz.title,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
    });

  } catch (error) {
    res.status(500).json({ message: `Error submitting quiz: ${error.message}` });
  }
};


// Get quiz results
export const getStudentQuizResults = async (req, res) => {
  const studentId = req.user._id; // Assuming this is populated from the authentication middleware

  try {
    const results = await StudentQuizResult.find({ studentId }).populate('quizId', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: `Error fetching quiz results: ${error.message}` });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: `Error fetching quiz: ${error.message}` });
  }
};
