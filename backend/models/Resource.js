import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema({
  topicName: { type: String, required: true },
  link: { type: String, required: true }, // Resource link
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
