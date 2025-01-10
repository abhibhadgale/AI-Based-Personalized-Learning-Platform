import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import "../styles/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view your cart.");
          return;
        }

        // Fetch cart items
        const response = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(response.data.subjectIds || []); // Assuming `subjectIds` is already populated
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="cart-container">
      {/* First Row: Left and Right Sections */}
      <div className="cart-row">
        {/* Left Section */}
        <div className="cart-left">
          <Typography variant="h6" fontSize="40px">
            Shopping Cart
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : cartItems.length > 0 ? (
            <List>
              {cartItems.map((subject, index) => (
                <ListItem key={index} className="cart-item">
                  <Box display="flex" justifyContent="space-around" gap={2}>
                    <img
                      src={subject.image}
                      alt={subject.subject}
                      style={{
                        width: "160px",
                        height: "80px",
                        borderRadius: "8px",
                      }}
                    />
                    <Box className="course-box">
                      <Typography variant="body1" className="subject-heading">
                        {subject.subject}
                      </Typography>
                      <Typography
                        variant="body3"
                        className="subject-info"
                        padding="5px"
                      >
                        COMP SE-SEM2
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        alignItems="left"
                        className="subject-rating"
                      >
                        Rating: {subject.rating}⭐
                      </Typography>
                    </Box>
                    <Box>
                      <div className="subject-pricing">
                        <p
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          ₹0
                        </p>
                        <strike style={{ fontSize: "15px", color: "gray" }}>
                          ₹199
                        </strike>
                        <p style={{ fontSize: "15px", color: "green" }}>
                          100% off
                        </p>
                      </div>
                      <Button>remove</Button>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">Your cart is empty.</Typography>
          )}
        </div>

        {/* Right Section */}
        <div className="cart-right">
          <Typography variant="h5" className="total">
            Total:
          </Typography>
          <div className="total-details">
          <p
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            ₹0
          </p>
          <p style={{ fontSize: "15px", color: "green" }}>100% off</p>
          </div>
          <button width="100px" className="checkout-button">Checkout</button>
          <hr></hr>
          <div className="coupon-applied-box">
              <span>
                Coupon <strong>FREE</strong> is applied!
              </span>
              <button className="remove-coupon">
                ✖
              </button>
            </div>
        </div>
      </div>

      {/* Second Row: Frequently Bought Together */}
      <div className="cart-bottom">
        <Typography variant="h6">Frequently Bought Together</Typography>
        {/* Add frequently bought items */}
      </div>
    </div>
  );
}

export default Cart;
