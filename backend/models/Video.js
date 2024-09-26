import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: Number,
  topicName: String,
  link: String, // YouTube video link
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
