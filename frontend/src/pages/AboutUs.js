import React , { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import videoSource from '../images/E-Learning_infographic_video.mp4'; // Import the video


import learn from '../images/digital_content.jpg';
import feedback from '../images/feedback.jpg';
import recommendation from '../images/recommendation.jpg';
import mastry from '../images/mastry.jpg';
import learningPathGif from '../images/personalized_path.gif';
import aiCopilotGif from '../images/ai_copilot.gif';
import performanceAnalysisGif from '../images/analysis.gif';
import examPrepGif from '../images/exam_preparation.gif';
import '../styles/AboutUs.css';
import Footer from '../components/Footer';

const AboutUs = () => {

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.features-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view'); // Add class when element is in view
        } else {
          entry.target.classList.remove('in-view'); // Remove class when element is out of view
        }
      },
      { threshold: 0.3 }
    );

    const rows = document.querySelectorAll('.row');
    rows.forEach((row) => observer.observe(row));

    return () => {
      rows.forEach((row) => observer.unobserve(row)); // Clean up observer
    };
  }, []);

  

  return (
    <div className="about-container">
      <div className="about-background">
      <div className="about-overlay">
        <h1>Welcome to Your Personalized Learning Platform</h1>
        <p>
          Unlock your potential with AI-driven personalized learning paths, 
          interactive quizzes, video-based learning, and more.
        </p>
        <div className="button-container">
          <Link to="/register">
            <button className="create-account-btn">GET STARTED</button>
          </Link>
          <Link to="/login">
            <button className="create-account-btn secondary-btn">I ALREADY HAVE AN ACCOUNT</button>
          </Link>
        </div>
      </div>


        {/* Local video instead of YouTube */}
        <div className="about-video">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ borderRadius: '20px' }} /* Optional inline style for rounded corners */
          >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>


      </div>

      {/* Second part - Features Section */}
      <div className="features-section">
        <h2 className={`features-heading ${inView ? 'animate' : ''}`} >
          Discover the powerful tools and features designed to enhance your learning experience and maximize your academic performance.
        </h2>

        <div className="features-grid">
          <div className="feature-box">
            <img src={learningPathGif} alt="Personalized Learning Paths" className="feature-icon" />
            <h3>Personalized Learning Paths</h3>
            <p className="subheading">
              Tailored learning paths based on your strengths, weaknesses, and goals, ensuring an efficient and effective study process.
            </p>
          </div>
          <div className="feature-box">
            <img src={aiCopilotGif} alt="AI Copilot" className="feature-icon" />
            <h3>AI Copilot</h3>
            <p className="subheading">
              Your personal AI assistant that guides you through every step, answering questions, providing recommendations, and keeping you on track.
            </p>
          </div>
          <div className="feature-box">
            <img src={performanceAnalysisGif} alt="Performance Analysis" className="feature-icon" />
            <h3>Performance Analysis</h3>
            <p className='subheading'>
              Track your academic performance and learning behavior with detailed analytics to stay on top of your goals.
            </p>
          </div>
          <div className="feature-box">
            <img src={examPrepGif} alt="Last Time Exam Preparation" className="feature-icon exam" />
            <h3>Last Time Exam Preparation</h3>
            <p className='subheading'>
              Focused revision strategies and mock exams to help you ace your exams during the final preparation stages.
            </p>
          </div>
        </div>
      </div>
      <div className="how-it-works-container">
       {/* <h2 className="section-title">Your Personalized Guide to Learning Success</h2>*/}
        <div className="row">
          <div className="content">
            <h3 className='heading'>Interactive Learning Content for Every Topic</h3>
            <p className='subheading'>Access comprehensive unit-wise notes, engaging videos, interactive quizzes, and curated resources to master any subject.</p>
          </div>
          <div className="image">
            <img src={learn} alt="Learn" />
          </div>
        </div>

        <div className="row reverse">
          <div className="content">
            <h3 className='heading'>AI-Powered Feedback on Your Work</h3>
            <p className='subheading'>Get instant AI-driven insights to improve your understanding and handwritten answers analysis to strengthen your weaknesses.</p>
          </div>
          <div className="image">
            <img src={feedback} alt="Feedback" />
          </div>
        </div>

        <div className="row">
          <div className="content">
            <h3 className='heading'>Master Exams with Focused Practice Tests</h3>
            <p className='subheading'>Prepare effectively with tests crafted from past exams and potential questions to ensure you're exam-ready.</p>
          </div>
          <div className="image">
            <img src={recommendation} alt="Recommendations" />
          </div>
        </div>

        <div className="row reverse">
          <div className="content">
            <h3 className='heading'>Achieve Mastery with Focused Tests</h3>
            <p className='subheading'>Master exams with tailored revision strategies, mock exams, and analysis to boost your performance.</p>
          </div>
          <div className="image">
            <img src={mastry} alt="Mastery" />
          </div>
        </div>

        
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
