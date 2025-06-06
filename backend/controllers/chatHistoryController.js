import ChatHistory from '../models/ChatHistory.js';
import Subject from '../models/Subject.js';
import Unit from '../models/Unit.js';
import Subtopic from '../models/Subtopic.js';


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
// Update getChatHistory function
export const getChatHistory = async (req, res) => {
  const userId = req.user.id;
  const { subjectId } = req.query;

  if (!subjectId) {
    return res.status(400).json({ message: "Subject ID is required." });
  }

  try {
    const chatHistory = await ChatHistory.findOne({ userId, subjectId });
    const subject = await Subject.findById(subjectId).lean();

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const subjectHierarchy = {
      _id: subject._id,
      subject: subject.subject,
      units: []
    };

    // Traverse each unit reference in the subject
    for (const { unitId, unitNumber, unitName } of subject.units) {
      const unit = await Unit.findById(unitId).lean();
      if (!unit) continue;

      const unitData = {
        _id: unit._id,
        unitNumber,
        unitName,
        topics: []
      };

      // Flatten cluster object into a topic list
      const allClusterKeys = Object.keys(unit.cluster || {});
      for (const clusterKey of allClusterKeys) {
        const topicsInCluster = unit.cluster[clusterKey] || [];

        for (const topic of topicsInCluster) {
          const topicData = {
            _id: topic.topicId,
            topicName: topic.topicName,
            subtopics: []
          };

          for (const subtopic of topic.subtopics || []) {
            const subtopicDoc = await Subtopic.findById(subtopic.subtopicId).lean();
            if (!subtopicDoc) continue;

            topicData.subtopics.push({
              _id: subtopicDoc._id,
              subtopicName: subtopicDoc.subtopicName,
              noteId: subtopicDoc.subtopicNoteId,
              videoId: subtopicDoc.subtopicVideoId,
              quizId: subtopicDoc.subtopicQuizId,
              resourcesId: subtopicDoc.subtopicResourcesId
            });
          }

          unitData.topics.push(topicData);
        }
      }

      subjectHierarchy.units.push(unitData);
    }

    res.status(200).json({
      messages: chatHistory?.messages || [],
      subjectHierarchy
    });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
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
