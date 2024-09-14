import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  unit: { type: String, required: true },
  notes: [String],  // Array of notes
  videos: [String]  // Array of video URLs
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
