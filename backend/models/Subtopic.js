import mongoose from 'mongoose';

const subtopicSchema = new mongoose.Schema({
  subtopicName: {
    type: String,
    required: true,
  },
  subtopicQuizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // References the Quiz collection
  },
  subtopicNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note', // References the Notes collection
  },
  subtopicVideoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', // References the Videos collection
  },
  subtopicResourcesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource', // References the Resources collection
  },
});

const Subtopic = mongoose.model('Subtopic', subtopicSchema);

export default Subtopic;
