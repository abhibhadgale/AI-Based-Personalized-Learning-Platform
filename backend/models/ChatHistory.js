import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, // Store messages per subject
  chatName: { type: String, required: true }, // Store chat name dynamically
  messages: [chatMessageSchema],
}, { timestamps: true });

chatHistorySchema.index({ userId: 1, subjectId: 1 }, { unique: true }); // Ensure uniqueness

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
