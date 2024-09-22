import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  units: [{
    unitNumber: Number,
    unitName: String
  }]
});

const Subject = mongoose.model('Subject', subjectSchema, 'subject'); // Explicitly set collection name

export default Subject;
