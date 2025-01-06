import React from 'react'
import { Link } from 'react-router-dom'; // For navigation
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';


const Footer = () => {

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


  return (
    <>
        <div className="branding-section">
        <h1 className="branding-title">Noted</h1>
        <p className="branding-subtitle" style={{color: 'white'}}>AI-Based Personalized Learning Platform</p>
        <div className="start-journey-btn">
          <Link to="/register">
            <button className="start-journey">Start Your Journey</button>
          </Link>
        </div>
      </div>
      <div className="footer">
      <div className="footer-content">
        <p className='copyright'>&copy; 2025 Noted. All Rights Reserved.</p>
        <div className="social-icons">
          <div className="social-icon" onClick={scrollToTop}>
            <Facebook fontSize="large" />
          </div>
          <div className="social-icon" onClick={scrollToTop}>
            <Twitter fontSize="large" />
          </div>
          <div className="social-icon" onClick={scrollToTop}>
            <LinkedIn fontSize="large" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Footer
