import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // To access the state passed through navigation
import axios from "axios";
import "../styles/EnrollCourse.css";

const EnrollCourse = () => {
  const location = useLocation();
  const selectedCourse = location.state?.subject; // Access the course details passed from the Courses page
  const [coupon, setCoupon] = useState(""); // To hold the entered coupon code
  const [appliedCoupon, setAppliedCoupon] = useState("FREE"); // To hold the applied coupon code
  const [buttonText, setButtonText] = useState("Add to Cart"); // Initial button text
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Track if the course is added to the cart
  const [cartItems, setCartItems] = useState([]); // To store cart items
  const navigate = useNavigate(); // useNavigate for navigation

  console.log("selectedCourse:", selectedCourse._id);
  
  // Function to check if the course is in the cart
  const checkIfCourseInCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view your cart.");
        return;
      }
      const response = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Cart response:", response.data);
      const existingCart = response.data.subjectIds;
  
      // Check if selectedCourse._id exists in any of the objects in subjectIds
      const isInCart = existingCart.some((item) => item._id === selectedCourse._id);
  
      console.log("Is course in cart:", isInCart); // Check this value
      setButtonText(isInCart ? "Go to Cart" : "Add to Cart");
      setIsAddedToCart(isInCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert("Failed to check if the course is in the cart.");
    }
  };
  

  useEffect(() => {
    if (selectedCourse) {
      checkIfCourseInCart(); // Check if the course is already in the cart
    }
  }, [selectedCourse]);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "FREE") {
      setAppliedCoupon("FREE");
    } else {
      alert("Invalid Coupon Code!");
    }
    setCoupon(""); // Clear the input box
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null); // Remove the applied coupon
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You must be logged in to add items to the cart.");
        return;
      }
  
      // API request to add course to cart with token
      const response = await axios.post(
        "/api/cart/add",
        { subjectId: selectedCourse._id },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the request header
          }
        }
      );

      if (response.data.success) {
        setButtonText("Go to Cart");
        setIsAddedToCart(true);
      } else {
        alert("Failed to add course to cart.");
      }
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Redirect to /cart page
  const handleGoToCart = () => {
    navigate('/cart'); // Use navigate to go to the /cart page
  };

  if (!selectedCourse) {
    return (
      <div className="error-message">
        <h2>No course selected!</h2>
        <p>
          Please go back to the courses page and select a course to enroll in.
        </p>
      </div>
    );
  }

  return (
    <div className="enroll-course-container">
      {/* Left Section: 70% width */}
      <div className="left-section">
        {/* Section 1: Course Detail Banner */}
        <div className="course-banner">
          <h4>SE-COMP-SEM2</h4>
          <h2>{selectedCourse.subject || "Course Name"}</h2>
          <h3>
            {selectedCourse.description || "Enroll in the best course to enhance your knowledge and skills. Get access to the latest materials, quizzes, and AI-driven guidance."}
          </h3>
          <div className="course-meta">
            <p><strong>Last Updated:</strong> 01/2025</p>
            <p><strong>Language:</strong> English</p>
          </div>
        </div>

        {/* Section 2: This Course Includes */}
        <div className="course-includes">
          <h3>This course includes:</h3>
          <ul>
            <li>50+ Video Lectures</li>
            <li>Quizzes & Assignments</li>
            <li>Downloadable Resources</li>
            <li>Lifetime Access</li>
          </ul>
        </div>

        {/* Section 3: What You'll Learn */}
        <div className="what-you-learn">
          <h3>What you'll learn:</h3>
          <ul>
            <li>Understand core concepts of {selectedCourse.subject || "the subject"}.</li>
            <li>Develop hands-on skills through projects.</li>
            <li>Prepare for real-world applications and interviews.</li>
          </ul>
        </div>

        {/* Section 4: Course Content Index */}
        <div className="course-content">
          <h3>Course Content:</h3>
          <ul>
            <li>Introduction to the course</li>
            <li>Chapter 1: Fundamentals</li>
            <li>Chapter 2: Advanced Topics</li>
            <li>Final Quiz and Certificate</li>
          </ul>
        </div>
      </div>

      {/* Right Section: 30% width */}
      <div className="right-section">
        <img
          className="subject-image"
          src={selectedCourse.image}
          alt={selectedCourse.subject}
        />
        <p className="subject-heading">{selectedCourse.subject}</p>
        <div className="subject-details">
          <p className="details-text">Computer Engineering (SE-Sem2)</p>
          <p className="details-text">
            <span>Rating:</span> {selectedCourse.rating || "Not Rated"} ⭐
          </p>
        </div>
        <div className="subject-pricing">
          {appliedCoupon === "FREE" ? (
            <div className="subject-pricing">
              <p style={{ fontSize: "30px", fontWeight: "bold", color: "black" }}>₹0</p>
              <strike style={{ fontSize: "15px", color: "gray" }}>₹199</strike>
              <p style={{ fontSize: "15px", color: "green" }}>100% off</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "5px", color: "black"}}>
                ₹199
              </p>
            </div>
          )}
        </div>
        <button className="enroll-button" onClick={isAddedToCart ? handleGoToCart : handleAddToCart}>
          {buttonText}
        </button>
        <div className="coupon-box-container">
          {/* Input and Apply Button Row */}
          <div className="input-row">
            <input
              type="text"
              placeholder="Enter Coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="coupon-input"
            />
            <button onClick={handleApplyCoupon} className="apply-button">
              Apply
            </button>
          </div>

          {/* Coupon Applied Box */}
          {appliedCoupon && (
            <div className="coupon-applied-box">
              <span>
                Coupon <strong>{appliedCoupon}</strong> is applied!
              </span>
              <button onClick={handleRemoveCoupon} className="remove-coupon">
                ✖
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;
