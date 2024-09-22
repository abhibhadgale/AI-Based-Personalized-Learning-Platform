import mongoose from 'mongoose';

const subjectFundamentalSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  introduction: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fundamentalQuizID: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  },
  
  subjectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
});

const SubjectFundamental = mongoose.model('SubjectFundamental', subjectFundamentalSchema);
export default SubjectFundamental;
