import SubjectFundamental from '../models/subjectfundamental.js';

export const getSubjectFundamental = async (req, res) => {
    try {
      const { subject } = req.query;
  
      const subjectFundamental = await SubjectFundamental.findOne({ subject });
  
      if (!subjectFundamental) {
        console.log("Subject not found:", subject); // Log if subject is not found
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      res.status(200).json(subjectFundamental.introduction);
      console.log(subjectFundamental)
    } catch (error) {
      console.error("Error fetching subject fundamental:", error); // Log any server errors
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  