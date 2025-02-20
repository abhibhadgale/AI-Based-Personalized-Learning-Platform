import Subtopic from '../models/Subtopic.js';

export const getSubtopicById = async (req, res) => {
  try {
    const subtopic = await Subtopic.findById(req.params.subtopicId);
    console.log(subtopic);
    if (!subtopic) return res.status(404).json({ message: 'Subtopic not found' });
    res.json(subtopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
