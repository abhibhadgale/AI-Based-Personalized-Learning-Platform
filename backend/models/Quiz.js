import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
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
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
      correct: Boolean,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);
const StudentQuizResult = mongoose.model('StudentQuizResult', studentQuizResultSchema);

export default Quiz;
export { StudentQuizResult };