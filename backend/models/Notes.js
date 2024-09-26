import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  noteId: {
    type: String,
    required: true,
    unique: true
  },
  topicName: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Note = mongoose.model('Note', notesSchema);

export default Note;
