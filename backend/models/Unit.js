import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unitNumber: { type: Number, required: true },
  unitName: { type: String, required: true },
  topics: [
    {
      topicId: { type: String, required: true },
      topicName: { type: String, required: true },
      topicQuizId: { type: String, required: true },
      topicNoteId: { type: String, required: true },
      topicVideoId: { type: String, required: true },
      topicResourcesId: { type: String, required: true },
      topicDiagramId: { type: String, required: false },
    },
  ],
  unitMcqTest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
});

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
