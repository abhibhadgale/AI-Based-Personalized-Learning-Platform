import Unit from '../models/Unit.js'; // Import the Unit model

// Controller to get topics by unit ID
export const getTopicsByUnitId = async (req, res) => {
  const { unitId } = req.params;

  try {
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    // Default cluster set to 0
    const cluster = unit.cluster[0];  // Access cluster 0 by default

    // Return unit details along with topics from cluster 0
    const topics = cluster.map((item) => ({
      topicId: item.topicId,
      topicName: item.topicName,
      subtopics: item.subtopics
    }));

    res.status(200).json({
      unitName: unit.unitName,
      unitMcqTest: unit.unitMcqTest,
      subjectId: unit.subjectId,
      topics: topics // Return topics with subtopics inside
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
