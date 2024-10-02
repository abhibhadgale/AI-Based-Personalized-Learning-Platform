import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Subject from './pages/Subject';
import Learning from './pages/Learning';
import Quiz from './components/Quiz';
import Resourses from './components/Resourses';
import Login from './components/Login';
import Register from './components/Register';
import Introduction from './pages/Introduction';
import FITest from './components/FITest';
import AboutUs from './pages/AboutUs';  // Import AboutUs component
import ContactUs from './pages/ContactUs';  // Import ContactUs component
import './styles/App.css';

const App = () => {
  const location = useLocation(); // Use useLocation hook to get current path

  return (
    <Box className="app">
      <Navbar />
      <div className="main-content">
        {location.pathname.includes('/learning') ? null : <Sidebar />} {/* Sidebar not rendered on Learning */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resources" element={<Resourses />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/introduction/:subject" element={<Introduction />} />
            <Route path="/fitest/:quizId" element={<FITest />} />
            <Route path="/subject/:subjectID" element={<Subject />} />
            <Route path="/learning/:subject/:unit/:unitId" element={<Learning />} />
            <Route path="/about" element={<AboutUs />} /> {/* Add route for AboutUs */}
            <Route path="/contact" element={<ContactUs />} /> {/* Add route for ContactUs */}
          </Routes>
        </div>
      </div>
    </Box>
  );
};

export default App;
