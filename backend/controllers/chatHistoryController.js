import ChatHistory from '../models/ChatHistory.js';
import Subject from '../models/Subject.js';

// Save message to chat history
export const saveMessage = async (req, res) => {
  const { sender, text, subjectId } = req.body;
  const userId = req.user.id;  // Extract userId from authenticated user

  if (!text || !sender || !subjectId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const chatName = `${subject.subject} learning discussion`;

    let chatHistory = await ChatHistory.findOne({ userId, subjectId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId, subjectId, chatName, messages: [] });
    }

    chatHistory.messages.push({ sender, text });
    await chatHistory.save();

    res.status(200).json({ message: "Chat history updated successfully." });
  } catch (error) {
    console.error("Error saving chat history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get chat history for a specific user and subject
export const getChatHistory = async (req, res) => {
  const userId = req.user.id;
  const { subjectId } = req.query;  // Get subjectId from query parameters

  if (!subjectId) {
    return res.status(400).json({ message: "Subject ID is required." });
  }

  try {
    const chatHistory = await ChatHistory.findOne({ userId, subjectId });

    if (!chatHistory || chatHistory.messages.length === 0) {
      return res.status(200).json([]);  // Return empty chat history instead of 404
    }

    res.status(200).json(chatHistory.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Clear chat history for a specific user and subject
export const clearChatHistory = async (req, res) => {
  const userId = req.user.id;
  const { subjectId } = req.query;  // Get subjectId from query parameters

  if (!subjectId) {
    return res.status(400).json({ message: "Subject ID is required." });
  }

  try {
    await ChatHistory.findOneAndDelete({ userId, subjectId });
    res.status(200).json({ message: "Chat history cleared successfully." });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
