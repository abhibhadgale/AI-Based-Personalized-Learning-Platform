import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

import { getUserProfile } from '../redux/slices/profileSlice';
import { logout } from '../redux/slices/authSlice';

import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { user, userProfile, loading, error } = useSelector((state) => state.userProfile || {});

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <h1>{user?.name}</h1>
      <div className="profile-info">
        <img
          src={"https://img.freepik.com/premium-vector/young-man-face-avater-vector-illustration-design_968209-13.jpg?w=740"} // Use actual URL or 
          a default 
          alt="Profile"
          className="profile-picture"
        />
        <div className="info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Age:</strong> {userProfile?.age}</p>
          <p><strong>College:</strong> {userProfile?.college}</p>
          <p><strong>Degree:</strong> {userProfile?.degree}</p>
          <p><strong>Year of Study:</strong> {userProfile?.yearOfStudy}</p>
        </div>
      </div>
      <div className="settings">
        <button className="settings-button">Settings</button>
        <button className="settings-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;
