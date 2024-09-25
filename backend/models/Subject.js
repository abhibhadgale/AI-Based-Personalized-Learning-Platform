import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  units: [{
    unitNumber: Number,
    unitName: String
  }],
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'units', // Adjust if you have a Subject model
    required: true,
  },
});

const Subject = mongoose.model('Subject', subjectSchema, 'subject'); // Explicitly set collection name

export default Subject;
