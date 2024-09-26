import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import unitsRoutes from './routes/unitsRoutes.js';
import subjectFundamentalRoutes from './routes/subjectfundamentalRoutes.js';
import notesRoutes from './routes/notesRoutes.js';  // Import notes routes
import videoRoutes from './routes/videoRoutes.js'; // Import video routes
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

connectDB();

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/subjectfundamental', subjectFundamentalRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/notes', notesRoutes);  // Register notes route
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
