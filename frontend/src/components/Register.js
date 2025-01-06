import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import registerImage from "../images/register.png";

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        values
      );
      console.log("Registration successful:", response.data);
      navigate("/login");
      alert("Registration successful");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: error.response ? error.response.data.message : "Error registering user",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Welcome!</h1>
        <p className="subtitle">Register to begin your personalized learning journey</p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name"></label>
                <Field
                  type="text"
                  name="name"
                  className="form-field"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="email"></label>
                <Field
                  type="email"
                  name="email"
                  className="form-field"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password"></label>
                <Field
                  type="password"
                  name="password"
                  className="form-field"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword"></label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-field"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              {errors.general && <div className="error">{errors.general}</div>}

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                Register
              </button>

              <p>
                Already have an account? <Link to="/login" className="link">Login here</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>

      <div className="image-container">
        <img src={registerImage} alt="Register AI Learning" className="register-image" />
      </div>
    </div>
  );
};

export default Register;
