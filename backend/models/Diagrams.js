import mongoose from 'mongoose';

const diagramSchema = new mongoose.Schema({
  imageId: { type: Number, required: true },
  topicName: { type: String, required: true },
  imageBase64: { type: String, required: true }, // Store the image as a Base64 string
  description: { type: String, required: false }, // Optional description for the diagram
});

const Diagram = mongoose.model('Diagram', diagramSchema);

export default Diagram;
