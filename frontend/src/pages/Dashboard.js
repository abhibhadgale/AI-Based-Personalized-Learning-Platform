import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const quizPerformanceData = [
    { name: 'Quiz 1', score: 85 },
    { name: 'Quiz 2', score: 90 },
    { name: 'Quiz 3', score: 78 },
    { name: 'Quiz 4', score: 92 },
    { name: 'Quiz 5', score: 88 },
  ];

  return (
    <div className="dashboard-container">
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
