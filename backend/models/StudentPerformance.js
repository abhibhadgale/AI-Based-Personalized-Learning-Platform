import mongoose from 'mongoose';

const studentPerformanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quizResults: [{
    quizId: String,
    score: Number,
    timeTaken: Number,
    submittedAt: Date
  }],
  overallPerformance: {
    averageScore: Number
  }
});

export default mongoose.model('StudentPerformance', studentPerformanceSchema);
