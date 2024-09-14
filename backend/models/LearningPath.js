import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentPath: { type: String, required: true },  // e.g., "easy", "medium", "hard"
  recommendedUnits: [String]  // List of recommended units based on analysis
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;
