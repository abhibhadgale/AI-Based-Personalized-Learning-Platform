import Unit from "../models/Unit.js";
import axios from "axios"; // Import axios to call Flask API

// Controller to get topics by unit ID and predict the cluster
export const getTopicsByUnitId = async (req, res) => {
  const { unitId } = req.params;

  try {
    // Find the unit by ID
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Test input (replace this with actual user data)
    const studentData = { features: [65, 1] }; // Example: Weighted Score = 85, Time Spent = 3

    // Call Flask API to predict the cluster
    const flaskResponse = await axios.post("http://localhost:5001/predict-cluster", studentData);
    const predictedCluster = flaskResponse.data.cluster;

    // Fetch topics based on predicted cluster
    const clusterTopics = unit.cluster[predictedCluster] || [];
    console.log(predictedCluster);

    // Return unit details along with predicted topics
    res.status(200).json({
      unitName: unit.unitName,
      unitMcqTest: unit.unitMcqTest,
      subjectId: unit.subjectId,
      predictedCluster,
      topics: clusterTopics.map((topic) => ({
        topicId: topic.topicId,
        topicName: topic.topicName,
        subtopics: topic.subtopics,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get the subtopic count for the predicted cluster
export const getSubtopicCount = async (req, res) => {
  const { unitId } = req.params;

  try {
    // Find the unit by ID
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Test input for predicting cluster (Replace this with actual user data)
    const studentData = { features: [65, 1] }; // Example: Weighted Score = 65, Time Spent = 1

    // Call Flask API to predict the cluster
    const flaskResponse = await axios.post("http://localhost:5001/predict-cluster", studentData);
    const predictedCluster = flaskResponse.data.cluster; // Get the predicted cluster

    // Get topics of only the predicted cluster
    const clusterTopics = unit.cluster[predictedCluster] || [];

    // Count subtopics in the predicted cluster
    const totalSubtopics = clusterTopics.reduce((count, topic) => count + topic.subtopics.length, 0);

    // Send the response
    res.status(200).json({
      unitId: unit._id,
      predictedCluster,
      totalSubtopics
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};