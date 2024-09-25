import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Box className="app">
        <Navbar />
        <div className="main-content">
          <Sidebar />
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
            </Routes>
          </div>
        </div>
      </Box>
    </Router>
  );
};

export default App;
