const mongoose = require('mongoose');

const StudentLogSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  interaction: String,
  timestamp: { type: Date, default: Date.now }
});

const ContentMetadataSchema = new mongoose.Schema({
  contentId: String,
  metadata: Object
});

const StudentLog = mongoose.model('StudentLog', StudentLogSchema);
const ContentMetadata = mongoose.model('ContentMetadata', ContentMetadataSchema);