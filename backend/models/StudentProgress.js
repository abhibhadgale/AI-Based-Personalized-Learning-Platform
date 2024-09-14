import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedUnits: [String],  // Array of completed units
  scores: [{ unit: String, score: Number }]  // Array of objects with unit and score
});

const StudentProgress = mongoose.model('StudentProgress', studentProgressSchema);

export default StudentProgress;
