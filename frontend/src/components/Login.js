import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {

  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', values); // Corrected URL
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // Store the JWT token
      navigate('/')
      alert('Login successful')
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      // Handle errors, e.g., set error state
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="form-field" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-field" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            {errors.general && <div className="error">{errors.general}</div>}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              Login
            </button>

            <p>
              Don't have an account? <Link to="/register">Register here</Link> {/* Changed to Link */}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
