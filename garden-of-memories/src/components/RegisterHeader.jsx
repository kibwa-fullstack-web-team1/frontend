import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PiFlowerLotusLight } from 'react-icons/pi';
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
          <div className="register-logo-mark">
            <PiFlowerLotusLight size={16} />
          </div>
          <h1 className="register-brand">
            <span className="register-serif">GARDEN</span> <span className="register-of">of</span> <span className="register-serif">MEMORIES</span>
          </h1>
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
