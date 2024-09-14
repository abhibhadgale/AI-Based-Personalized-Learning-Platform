import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

import "../styles/Navbar.css"

const Navbar = () => {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI-Based Personalized Learning Platform
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact Us</Button>
          <Button color="inherit">LogIn</Button>
        </Toolbar>
      </AppBar>
    );
  };

export default Navbar;
