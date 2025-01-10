import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { setCartItems } from "../redux/slices/cartSlice"; // Add this if you need to fetch cart data

import "../styles/Navbar.css";

const Navbar = ({ isSidebarExpanded }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication status and user details from Redux store
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.cartItems); // Cart items from Redux

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
    navigate("/profile"); // Navigate to profile page
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Optional: Fetch cart data from API if needed (e.g., after login)
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch the cart items from your API or backend
      // Example: dispatch(setCartItems(fetchedCartData));
      // Ensure the cart items are stored in the Redux state
    }
  }, [isAuthenticated, dispatch]);

  const cartCount = new Set(cartItems.map((item) => item.subjectId)).size; // Unique subjects count

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: "white", color: "black" }}
    >
      <Toolbar>
        {/* Noted on the left */}
        <div
          className="navbar-title"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            marginLeft: isSidebarExpanded ? "55px" : "0",
            marginRight: isSidebarExpanded ? "75px" : "15px",
          }}
        >
          Noted
        </div>

        {/* Centered Nav Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button color="inherit" marginLeft="10px" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
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
            <ShoppingCartIcon
              className="shopping-cart"
              onClick={handleCartClick}
              style={{ fontSize: "30px", color: "black", marginRight: "5px" }}
            />

            <AccountCircleIcon
              className="profile-icon"
              onClick={handleMenuOpen} // Open menu on click
              role="button" // Ensure it's accessible as a button
              tabIndex={0} // Make it focusable
              aria-label="Profile" // Accessibility label
              style={{ fontSize: "40px" }}
            />

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onMouseLeave={handleMenuClose} // Close menu when mouse leaves
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              className="profile-menu"
            >
              <MenuItem className="menu-item" onClick={handleProfileClick}>
                Profile
              </MenuItem>
              <MenuItem className="menu-item" onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <span className="login-button">
              <Link to="/login">Login</Link>
            </span>
            <span className="login-button">
              <Link to="/register">Sign up</Link>
            </span>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
