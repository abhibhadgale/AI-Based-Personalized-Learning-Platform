import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';  // Import dotenv
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';  // Add subjectRoutes
import subjectFundamentalRoutes from './routes/subjectfundamentalRoutes.js'; // Ensure this import is correct
import connectDB from './config/db.js';

dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin (your frontend)
  credentials: true // Allow credentials (e.g., cookies, authorization headers)
}));
app.use(bodyParser.json());

// Database connection
connectDB();

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subjects', subjectRoutes);  // Add subjects route
app.use('/api/subjectfundamental', subjectFundamentalRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
