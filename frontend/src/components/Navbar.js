import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication status and user details from Redux store
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    <AppBar position="fixed" style={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        {/* Noted on the left */}
        <div
          className="navbar-title"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', marginRight: '45px', marginLeft: '30px' }}
        >
          Noted
        </div>

        {/* Centered Nav Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/contact">Contact</Button>
        </div>

        <div style={{ flexGrow: 1 }}></div>

        {/* Search Bar - Left of profile */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          className="search-bar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Profile and Logout */}
        {isAuthenticated ? (
          <>
            <AccountCircleIcon
              className="profile-icon"
              onClick={handleMenuOpen} // Open menu on click
              role="button" // Ensure it's accessible as a button
              tabIndex={0} // Make it focusable
              aria-label="Profile" // Accessibility label
              style={{ fontSize: "40px"}}
            />

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
              className="profile-menu"
            >
              <MenuItem className="menu-item" onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem className="menu-item" onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <span className="login-button" >
            <Link to="/login">Login</Link>
            </span>
            <span className="login-button" >
            <Link to="/register">Sing up</Link>
            </span>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
