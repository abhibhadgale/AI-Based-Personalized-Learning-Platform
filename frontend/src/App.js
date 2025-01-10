import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Subject from './pages/Subject';
import Learning from './pages/Learning';
import Test from './pages/Test';
import Quiz from './components/Quiz';
import Courses from './components/Courses';
import EnrollCourse from './components/EnrollCourse';
import Login from './components/Login';
import Register from './components/Register';
import Introduction from './pages/Introduction';
import FITest from './components/FITest';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import UserProfileForm from './components/UserProfileForm';
import ProfilePage from './pages/ProfilePage';
import Cart from './components/Cart';
import './styles/App.css';

const App = () => {
  const location = useLocation(); // Get the current path

  // Define the routes where Navbar and Sidebar should not appear
  const excludedRoutes = ['/login', '/register'];

  //sidebar reomve
  const excludedSidebar = ['/about']
  const isExcludedSidebar = excludedSidebar.includes(location.pathname)

  // Check if the current route is excluded
  const isExcluded = excludedRoutes.includes(location.pathname);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <Box className="app">
      {!isExcluded && <Navbar isSidebarExpanded={isSidebarExpanded}/>} {/* Conditionally render Navbar */}
      <div className={`main-content ${isExcluded ? 'no-padding' : ''}`}>
        {!isExcluded && !isExcludedSidebar && <Sidebar onSidebarToggle={setIsSidebarExpanded}/>} {/* Conditionally render Sidebar */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user-profile" element={<UserProfileForm />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enroll-course" element={<EnrollCourse />}/>
            <Route path="/cart" element={<Cart />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/introduction/:subject" element={<Introduction />} />
            <Route path="/fitest/:quizId" element={<FITest />} />
            <Route path="/subject/:subjectID" element={<Subject />} />
            <Route path="/learning/:subject/:unit/:unitId" element={<Learning />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/test/:unitMcqTest" element={<Test />} />
          </Routes>
        </div>
      </div>
    </Box>
  );
};

export default App;
