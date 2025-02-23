import mongoose from 'mongoose';

const StudentProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    progress: [
      {
        unitId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
          required: true
        },
        subtopicId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subtopic',
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const StudentProgress = mongoose.model('StudentProgress', StudentProgressSchema);
export default StudentProgress;
