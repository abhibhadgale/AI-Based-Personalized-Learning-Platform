import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizResults: {
    FITs: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
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
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    UITs: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        unitId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
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
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    UTs: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        unitId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
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
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    Tests: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        unitId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
          required: true,
        },
        subtopicId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subtopic',
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
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

const StudentPerformance = mongoose.model('StudentPerformance', performanceSchema);

export default StudentPerformance;