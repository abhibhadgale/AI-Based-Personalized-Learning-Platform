import Resource from '../models/Resource.js'; // Assuming the model is named Resource

export const getResourceById = async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
