import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';


export const createUserProfile = async (req, res) => {
  const { age, college, degree, yearOfStudy, ...responses } = req.body;

  try {
    const newUserProfile = new UserProfile({
      user: req.user._id, // Assuming the user is authenticated and req.user is available
      age,
      college,
      degree,
      yearOfStudy,
      responses, // Store the survey responses
    });

    await newUserProfile.save();

    res.status(201).json(newUserProfile);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user profile', error });
  }
};

// Update profile completion in the User collection
export const updateUserProfileCompletion = async (req, res) => {
    try {
      // Find the user by ID and update the profileCompleted field
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // Use req.user._id to find the user
        { profileCompleted: true },
        { new: true } // Return the updated user
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser); // Optionally return the updated user data
    } catch (error) {
      res.status(500).json({ message: 'Failed to update profile completion status', error });
    }
  };