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
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [showFrequentlyBought, setShowFrequentlyBought] = useState(true); // State to control showing the "Frequently Bought" section
  const [showCartBottom, setShowCartBottom] = useState(true);


  // Fetch cart items and subjects on component mount
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

    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/subjects");
        setSubjects(response.data);
      } catch (error) {
        console.error(
          "Error fetching subjects:",
          error.response?.data || error
        );
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchCartItems();
    fetchSubjects();
  }, []);

  // Fetch enrolled subjects from EnrolledStudents collection
  const fetchEnrolledSubjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    try {
      const response = await axios.get("/api/enrolled-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.subjectIds || [];
    } catch (error) {
      console.error(
        "Error fetching enrolled subjects:",
        error.response?.data || error
      );
      return [];
    }
  };

  const handleRemove = async (subjectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }

      await axios.delete("/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { subjectId },
      });

      // Update UI
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== subjectId)
      );
      alert("Item removed successfully.");
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error);
      alert("Failed to remove item.");
    }
  };

  const handleAddSemesterPackage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }
  
      const enrolledSubjects = [];
      const notEnrolledSubjects = [];
  
      // Loop through all subjects and check enrollment status
      for (let subject of subjects) {
        const response = await axios.get(`/api/enrollment/check/${subject._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.isEnrolled) {
          enrolledSubjects.push(subject);
        } else {
          notEnrolledSubjects.push(subject);
        }
      }
  
      // Add only subjects that are not already enrolled
      if (notEnrolledSubjects.length > 0) {
        const subjectIdsToAdd = notEnrolledSubjects.map((subject) => subject._id);
  
        // Send request to add subjects to the cart
        await axios.post(
          "/api/cart/add-multiple",
          { subjectIds: subjectIdsToAdd },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Fetch updated cart items
        const response = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Update cart items in state with full subject objects
        setCartItems(response.data.subjectIds || []); // Ensure that you get the updated cart from the backend
        alert("Subjects added to cart successfully!");
      } else {
        // If all subjects are already enrolled, remove the Frequently Bought Together section
        setSubjects([]);
        setShowFrequentlyBought(false);
        alert("You are already enrolled in all the subjects in the semester package.");
      }
    } catch (error) {
      console.error("Error adding semester package:", error.response?.data || error);
      alert("Failed to add semester package.");
    }
  };
  

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }

      const subjectIds = cartItems.map((item) => item._id); // Get all selected subjects

      // Send request to backend to handle checkout
      const response = await axios.post(
        "/api/cart/checkout",
        { subjectIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If checkout is successful, clear the cart on the frontend
      setCartItems([]);
      alert(response.data.message); // Display success message
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error);
      alert("Failed to complete checkout.");
    }
  };

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
                      <Button
                        className="remove-button"
                        onClick={() => handleRemove(subject._id)}
                      >
                        Remove
                      </Button>
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
          <button onClick={handleCheckout} width="100px" className="checkout-button">
            Checkout
          </button>
          <hr></hr>
          <div className="coupon-applied-box">
            <span>
              Coupon <strong>FREE</strong> is applied!
            </span>
            <button className="remove-coupon">✖</button>
          </div>
        </div>
      </div>

      {/* Second Row: Frequently Bought Together */}
      {showFrequentlyBought && (
        <div className="cart-bottom">
          <Typography variant="h6" className="frequently-heading">Frequently Bought Together</Typography>
          <div
            style={{
              height: "500px",
              border: "1px dashed black",
              position: "relative",
              padding: "16px",
            }}
          >
            {/* Top-left corner heading */}
            <Typography
              variant="h6"
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                fontWeight: "bold",
                color: "blue",
              }}
            >
              Semester Package
            </Typography>

            {/* Top-right corner pricing */}
            <div
              className="subject-pricing"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                textAlign: "right",
              }}
            >
              <p
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                ₹0
              </p>
              <strike style={{ fontSize: "15px", color: "gray" }}>₹999</strike>
              <p style={{ fontSize: "15px", color: "green" }}>100% off</p>
            </div>

            {/* Content in the dashed box */}
            <div className="subjects-container">
              {loadingSubjects ? (
                <CircularProgress size={24} />
              ) : (
                subjects.map((subject) => (
                  <Box key={subject._id} className="frequently-course-box">
                    <img
                      src={subject.image}
                      alt={subject.subject}
                      className="course-image"
                    />
                    <Box>
                      <Typography variant="body1" className="subject-heading">
                        {subject.subject}
                      </Typography>
                      <Typography variant="body2" className="subject-info">
                        COMP SE-SEM2
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="subject-rating"
                      >
                        Rating: {subject.rating}⭐
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </div>
            <div className="frequently-button-box">
              <Button className="frequently-button" onClick={handleAddSemesterPackage}>Add Semester Package to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
