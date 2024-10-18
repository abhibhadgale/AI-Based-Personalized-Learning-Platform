import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

import "../styles/Navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication status and user details from Redux store
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user); // Assuming `user` contains user's name and other info

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // State for controlling the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile'); // Navigate to profile page
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI-Based Personalized Learning Platform
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>

        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              onMouseEnter={handleMenuOpen} // Open menu on hover
              onClick={handleMenuOpen}
            >
              {user?.name || 'User'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onMouseLeave={handleMenuClose} // Close menu when mouse leaves
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
