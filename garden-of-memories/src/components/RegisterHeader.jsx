import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterHeader.css';

const RegisterHeader = ({ 
  onSignInClick, 
  showSignInButton = true 
}) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="register-header">
      <div className="register-header-content">
        <div className="register-logo" onClick={handleLogoClick}>
          <div className="register-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="register-logo-text">Garden of Memory</h1>
        </div>
        <nav className="register-nav">
          <a href="#" className="register-nav-link">Games</a>
          <a href="#" className="register-nav-link">About Us</a>
          <a href="#" className="register-nav-link">Contact</a>
          {showSignInButton && (
            <button 
              className="register-sign-in-btn" 
              onClick={onSignInClick}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default RegisterHeader;
