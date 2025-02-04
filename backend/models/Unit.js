import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unitNumber: { type: Number, required: true },
  unitName: { type: String, required: true },
  unitMcqTest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  cluster: {
    0: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
        topicName: { type: String, required: true },
        subtopics: [
          {
            subtopicName: { type: String, required: true },
            subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic', required: true }
          }
        ]
      }
    ],
    1: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
        topicName: { type: String, required: true },
        subtopics: [
          {
            subtopicName: { type: String, required: true },
            subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic', required: true }
          }
        ]
      }
    ],
    2: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
        topicName: { type: String, required: true },
        subtopics: [
          {
            subtopicName: { type: String, required: true },
            subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic', required: true }
          }
        ]
      }
    ]
  },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
});

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
