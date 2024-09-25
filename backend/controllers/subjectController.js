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

// Get units for a specific subject
export const getSubjectUnits = async (req, res) => {
  const { subjectID } = req.params;

  try {
    // Find the subject by ID and select the 'subject' and 'units' fields
    const subject = await Subject.findById(subjectID).select('subject units');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }


    res.json({
      subject: subject.subject,  // This should be the subject name
      units: subject.units  // This should be the array of units
    });
  } catch (error) {
    console.error('Error fetching subject units:', error);
    res.status(500).json({ message: 'Error fetching subject units' });
  }
};
