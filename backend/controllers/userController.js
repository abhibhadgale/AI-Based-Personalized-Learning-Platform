import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import Student from '../models/Student.js';
import StudentPerformance from '../models/StudentPerformance.js';
import StudentBehaviour from '../models/StudentBehaviour.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register user
export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

    // Check if all fields are present
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }


        // Save new user to the database
        const newUser = await User.create({
            name,
            email,
            password,
        });


         // Create empty student behaviour and performance documents
        const studentPerformance = new StudentPerformance({
          studentId: newUser._id,
          quizResults: [],
          overallPerformance: { averageScore: 0 },
        });

        const studentBehaviour = new StudentBehaviour({
          studentId: newUser._id,
          engagementMetrics: { timeSpentOnVideos: 0, timeSpentOnNotes: 0, quizzesAttempted: 0 },
          learningPreferences: { frequentlyVisitedTopics: [], skippedTopics: [] },
        });

        // Save the documents
        await studentPerformance.save();
        await studentBehaviour.save();

        // Create new student document and store references to the performance and behaviour documents
        const student = new Student({
          userId: newUser._id,
          name: newUser.name,
          studentBehaviourId: studentBehaviour._id,
          studentPerformanceId: studentPerformance._id,
        });

        // Save the student document
        await student.save();

        return res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user' });
    }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Ensure both fields are present
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, role: user.role }, // Add role if needed
          process.env.JWT_SECRET, 
          { expiresIn: '30d' }
        );

        // Return token and some user info (if needed)
        res.json({ 
          token, 
          user: { id: user._id, name: user.name, email: user.email, role: user.role, profileCompleted: user.profileCompleted } 
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};



// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const userProfile = await UserProfile.findOne({ user: req.user.id });

    if (user && userProfile) {
      res.json({ user, userProfile });
    } else {
      res.status(404).json({ message: 'User or profile not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};
