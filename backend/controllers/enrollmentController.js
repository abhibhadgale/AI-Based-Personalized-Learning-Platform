import mongoose from 'mongoose';
import EnrolledStudent from '../models/EnrolledStudent.js'; // Assuming you have an EnrolledStudent model

// Controller function to check enrollment
export const checkEnrollment = async (req, res) => {
  const { subjectId } = req.params;
  const studentId = req.user._id; // Get the student ID directly from the request object
  console.log(studentId)

  try {
    // Ensure subjectId is treated as an ObjectId
    const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    // Check if the student is enrolled in the given subject
    const enrollment = await EnrolledStudent.findOne({
      studentId,
      subjects: { $in: [subjectObjectId] }, // Use $in operator to match subjectId in the array
    });

    if (enrollment) {
      return res.status(200).json({ isEnrolled: true });
    } else {
      return res.status(200).json({ isEnrolled: false });
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
