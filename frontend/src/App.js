import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';


import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Quiz from './components/Quiz';
import Resourses from './components/Resourses';
import Login from './components/Login'; // Import Login Component
import Register from './components/Register'; // Import Register Component
import './styles/App.css'; // Optional: If you want to include global styles

const App = () => {
  return (
    <Router>
      <Box className="app">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Resourses />} />
              <Route path="/resources" element={<Dashboard />} />
              <Route path="/quiz" element={<Quiz />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Box>
    </Router>
  );
};

export default App;
