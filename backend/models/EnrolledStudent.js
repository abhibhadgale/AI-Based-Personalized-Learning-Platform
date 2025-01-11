import mongoose from 'mongoose';

const enrolledStudentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  }],
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const EnrolledStudent = mongoose.model('EnrolledStudent', enrolledStudentSchema);
export default EnrolledStudent;
