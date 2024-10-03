import React from 'react';
import '../styles/AboutUs.css'; // Import the external CSS file

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Your Partner in AI-Powered Learning</p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At AI Learning Platform, our mission is to revolutionize education with the power of AI. We strive to create personalized learning experiences that empower students to reach their full potential.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Do</h2>
        <p>
          We use state-of-the-art machine learning algorithms to analyze your learning patterns and provide tailored content that accelerates your learning process. Our platform adapts to your pace, ensuring that you learn effectively and efficiently.
        </p>
      </section>

      <section className="about-section">
        <h2>Why Choose Us</h2>
        <ul>
          <li>AI-Driven Personalized Learning Paths</li>
          <li>Real-time Feedback and Analysis</li>
          <li>Interactive Learning Resources</li>
          <li>Expert Mentorship and Support</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Meet the Team</h2>
        <p>
          Our team is made up of passionate educators, engineers, and AI researchers who are committed to changing the future of education. We believe in the power of technology to unlock human potential.
        </p>
        <h2>Thank You</h2>
      </section>
    </div>
  );
};

export default AboutUs;
