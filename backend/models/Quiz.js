import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correctAnswer: {
        type: Number, // Store as index of the correct answer
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subjectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject', // Adjust if you have a Subject model
    required: true,
  },
});

// Student Quiz Result Schema (for tracking quiz scores)
const studentQuizResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  subjectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject', // Adjust if you have a Subject model
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  quizDate: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);
const StudentQuizResult = mongoose.model('StudentQuizResult', studentQuizResultSchema);

export default Quiz;
export { StudentQuizResult };
