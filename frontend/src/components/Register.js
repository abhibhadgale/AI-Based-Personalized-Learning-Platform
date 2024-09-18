import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {

  const navigate = useNavigate();

  const initialValues = {
    name: '',  // Change 'username' to 'name'
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),  // Change 'username' to 'name'
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', values); // Corrected URL
      console.log('Registration successful:', response.data);
      navigate('/login');
      alert('Registration successful')
    } catch (error) {
      console.error('Registration error:', error); // Log full error object
      setErrors({ general: error.response ? error.response.data.message : 'Error registering user' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
          <div className="form-group">
            <label htmlFor="name">Name</label>  {/* Change 'username' to 'name' */}
            <Field type="text" name="name" className="form-field" />  {/* Update 'username' to 'name' */}
            <ErrorMessage name="name" component="div" className="error" />
          </div>


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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" name="confirmPassword" className="form-field" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            {errors.general && <div className="error">{errors.general}</div>}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              Register
            </button>

            <p>
              Already have an account? <Link to="/login">Login here</Link> {/* Changed to Link */}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
