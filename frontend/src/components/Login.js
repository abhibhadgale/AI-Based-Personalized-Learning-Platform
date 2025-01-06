import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../redux/slices/authSlice";
import loginImage from "../images/login.png";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      // Dispatch the login action to update the Redux store
      dispatch(login(response.data.user));
      console.log(response.data.user);
      if (!response.data.user.profileCompleted) {
        navigate("/user-profile");
      } else {
        navigate("/");
      }
      alert("Login successful");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setErrors({
        general: "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
    
      <div className="login-card">
        <h1>Welcome!</h1>
        <p class="subtitle">Login to access your personalized learning experience</p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email"></label>
                <Field
                  type="email"
                  name="email"
                  className="form-field"
                  placeholder="Enter your email"  // Added placeholder
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password"></label>
                <Field
                  type="password"
                  name="password"
                  className="form-field"
                  placeholder="Enter your password"  // Added placeholder
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              {errors.general && <div className="error">{errors.general}</div>}

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                Login
              </button>

              <p>
                Don't have an account? <Link to="/register" className="link">Register here </Link>
              </p>
            </Form>
          )}
      </Formik>

      </div>
      <div className="image-container">
      <img src={loginImage} alt="AI Learning" className="login-image" />

      </div>
    </div>
  );
};

export default Login;
