import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { getAllSubjects, getFITestCompletionStatus } from '../utils/api';  // Fetch subjects & test status from the backend
import '../styles/Dashboard.css';

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
    // Call the API and pass the subject ID (_id) to check if the test is completed
    const { data: testCompleted } = await getFITestCompletionStatus(subject._id); // Pass subject._id as a parameter
    
    console.log("Subject ID:", subject._id); // Log the subject ID for debugging

    if (testCompleted) {
      console.log("Test completed:", testCompleted);
      // If the test is completed, navigate to the subject page
      navigate(`/subject/${subject.subject}`); 
    } else {
      // If the test is not completed, navigate to the introduction page
      navigate(`/introduction/${subject.subject}`);
    }
  } catch (error) {
    console.error('Error checking test status:', error);
  }
};
  

  return (
    <div className="dashboard-container">
      <div className="subject-selection-section">
        <h2>Select a Subject</h2>
        <div className="subject-buttons">
          {subjects.map((subject, index) => (
            <button
              key={index}
              className={`subject-button ${selectedSubject?.name === subject.subject ? 'active' : ''}`}
              onClick={() => handleSubjectSelect(subject)}
            >
              {subject.subject}
            </button>
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
