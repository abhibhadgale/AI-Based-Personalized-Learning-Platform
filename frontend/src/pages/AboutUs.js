// src/pages/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* First part: Background image with overlay text and button */}
      <div className="about-background">
        <div className="about-overlay">
          <h1>Welcome to Your Personalized Learning Platform</h1>
          <p>
            Unlock your potential with AI-driven personalized learning paths,
            interactive quizzes, video-based learning, and more.
          </p>
          <Link to="/register">
            <button className="create-account-btn">Create Account</button>
          </Link>
        </div>
      </div>

      {/* Second part - Features Section */}
      <div className="features-section">
        <h2 className="features-heading">Key Features of Our Platform</h2>
        <p className="features-description">
          Explore the powerful tools and features that make our platform the ultimate learning assistant for students. Each feature is carefully crafted to enhance your learning experience and maximize your performance.
        </p>
        <div className="features-grid">
          <div className="feature-box">
            <h3>Personalized Learning Paths</h3>
            <p>
              Tailored learning paths based on your strengths, weaknesses, and goals, ensuring an efficient and effective study process.
            </p>
          </div>
          <div className="feature-box">
            <h3>AI Copilot</h3>
            <p>
              Your personal AI assistant that guides you through every step, answering questions, providing recommendations, and keeping you on track.
            </p>
          </div>
          <div className="feature-box">
            <h3>Handwritten Answer Analysis</h3>
            <p>
              Upload handwritten answers, and our AI analyzes them to provide feedback and tips for improvement in real-time.
            </p>
          </div>
          <div className="feature-box">
            <h3>Last Time Exam Preparation</h3>
            <p>
              Focused revision strategies and mock exams to help you ace your exams during the final preparation stages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
