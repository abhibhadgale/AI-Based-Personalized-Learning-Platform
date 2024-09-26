import Note from '../models/Notes.js'; // Import the Note model
import mongoose from 'mongoose'; // Import mongoose

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  try {
    // Convert noteId to ObjectId using new
    const objectId = new mongoose.Types.ObjectId(noteId);

    // Fetch the note using the ObjectId
    const note = await Note.findById(objectId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ note: note.note, topicName: note.topicName }); // Send back the note content
  } catch (error) {
    console.error("Error fetching note:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};
