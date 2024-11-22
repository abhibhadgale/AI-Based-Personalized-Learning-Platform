import mongoose from 'mongoose';

const studentBehaviourSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  preLearning: {
    preferredLearningStyles: [String],
    productivityTime: [String],
    studyPreferences: [String],
    helpfulContent: [String],
    reviewFrequency: [String],
    studyHours: String,
    goalSetting: String,
    motivation: String,
    distractionFrequency: String,
    onlineLearningComfort: String,
    learningPreference: String,
    quizFrequency: String,
    challenges: String,
    suggestions: String,
  },
}, { timestamps: true });

export default mongoose.model('StudentBehaviour', studentBehaviourSchema);
