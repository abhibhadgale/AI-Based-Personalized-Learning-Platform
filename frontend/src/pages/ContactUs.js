import React, { useState } from 'react';
import '../styles/ContactUs.css';
import contact from '../images/contact.jpg'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
    alert('Thank you for contacting us!');
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <div className="contact-container">
      {/* Left Side: Contact Form */}
      <div className="contact-form-container">
        <h1>Contact Us</h1>
        <p>Have questions or want to reach out? We're here to help!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>

      {/* Right Side: Image */}
      <div className="contact-image-container">
        <img src={contact} alt="Contact Us" />
      </div>
    </div>
  );
};

export default ContactUs;
