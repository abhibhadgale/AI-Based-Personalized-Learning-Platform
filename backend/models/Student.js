import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  studentBehaviourId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentBehaviour', required: true },
  studentPerformanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentPerformance', required: true }
});

export default mongoose.model('Student', studentSchema);
