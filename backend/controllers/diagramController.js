import Diagram from '../models/Diagrams.js';

export const getDiagramById = async (req, res) => {
  try {
    const { diagramId } = req.params;
    const diagram = await Diagram.findOne({ _id: diagramId });
    if (!diagram) {
      return res.status(404).json({ message: 'Diagram not found' });
    }
    res.json(diagram);
  } catch (error) {
    console.error('Error fetching diagram:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
