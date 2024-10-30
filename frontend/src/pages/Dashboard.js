import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { getAllSubjects, getFITestCompletionStatus } from '../utils/api';  // Fetch subjects & test status from the backend
import '../styles/Dashboard.css';

import defaultImage from '../images/default.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const quizPerformanceData = [
    { name: 'Quiz 1', score: 85 },
    { name: 'Quiz 2', score: 90 },
    { name: 'Quiz 3', score: 78 },
    { name: 'Quiz 4', score: 92 },
    { name: 'Quiz 5', score: 88 },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    try {
      const { data: testCompleted } = await getFITestCompletionStatus(subject._id); // Use subject._id

      console.log("Subject ID:", subject._id); // Log the subject ID for debugging
      if (testCompleted) {
        // Navigate to subject page with subjectID (not subject name)
        navigate(`/subject/${subject._id}`, { state: { subject } });
        
      } else {
        // If the test is not completed, navigate to the introduction page
        navigate(`/introduction/${subject.subject}`);
      }
    } catch (error) {
      console.error('Error checking test status:', error);
    }
  };

  const getImagePath = (subjectName) => {
    const extensions = ['jpeg', 'jpg', 'png'];
    const formattedName = subjectName.replace(/ /g, '_'); // Replace spaces with underscores
  
    for (let ext of extensions) {
      const path = `${process.env.PUBLIC_URL}/images/${formattedName}.${ext}`;
  
      // Verify if the file exists by creating an Image object
      const img = new Image();
      img.src = path;
  
      // Return the path if the image loads successfully
      if (img.complete || img.height > 0) {
        return path;
      }
    }
  
    // Return default image if no match was found
    return defaultImage;
  };
  

  return (
    <div className="dashboard-container">
      <div className="subject-selection-section">
        <h2>Select a Subject</h2>
        <div className="subject-buttons">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="subject-container"
              onClick={() => handleSubjectSelect(subject)}
            >
              <img
                src={getImagePath(subject.subject)}
                alt={subject.subject}
                className={`subject-image ${selectedSubject?.name === subject.subject ? 'active' : ''}`}
              />
              <div className="subject-title">{subject.subject}</div>
            </div>
          ))}
        </div>

      </div>

      <div className="quiz-performance-section">
        <h2>Quiz Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={quizPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        <h2>Other Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
