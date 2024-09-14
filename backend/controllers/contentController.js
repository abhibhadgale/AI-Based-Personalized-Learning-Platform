import Content from '../models/Content.js';

// Get content by subject and unit
export const getContent = async (req, res) => {
  const { subject, unit } = req.params;

  try {
    const content = await Content.findOne({ subject, unit });

    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
};

// Upload notes
export const uploadNotes = async (req, res) => {
  const { subject, unit, notes } = req.body;

  try {
    let content = await Content.findOne({ subject, unit });

    if (!content) {
      content = new Content({ subject, unit, notes: [] });
    }

    content.notes.push(notes);
    await content.save();

    res.json({ message: 'Notes uploaded successfully', content });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading notes' });
  }
};

// Get videos related to the unit
export const getVideos = async (req, res) => {
  const { unit } = req.params;

  try {
    const content = await Content.findOne({ unit });

    if (content && content.videos) {
      res.json(content.videos);
    } else {
      res.status(404).json({ message: 'Videos not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
};
