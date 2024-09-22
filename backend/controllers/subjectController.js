import Subject from '../models/Subject.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error); // Log the error
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

// Get a subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error); // Log the error
    res.status(500).json({ message: 'Error fetching subject', error });
  }
};
