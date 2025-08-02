import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="landing-content">
          <h1 className="landing-title">Welcome to News & Blog</h1>
          <p className="landing-subtitle">Stay informed. Stay empowered.</p>
          <div className="landing-buttons">
            <button className="btn login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="btn signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
