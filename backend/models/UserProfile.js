import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: String,
    required: true,
  },
  responses: {
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

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
