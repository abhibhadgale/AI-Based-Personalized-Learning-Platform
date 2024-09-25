// unitsController.js
import Unit from '../models/Unit.js'; // Import the Unit model


// Controller to get topics by unit ID
export const getTopicsByUnitId = async (req, res) => {
  const { unitId } = req.params;

  try {
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    // Return both topics and unit name
    res.status(200).json({ unitName: unit.unitName, topics: unit.topics }); // Return unitName and topics
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};