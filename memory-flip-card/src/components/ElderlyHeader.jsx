import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ElderlyHeader.css';

const ElderlyHeader = ({ title, subtitle, showBackButton = true, onBackClick }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="elderly-header">
      <div className="header-content">
        {showBackButton && (
          <button className="back-button" onClick={handleBackClick}>
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.14 0.38L14.85 15.62" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <span>기억의 정원</span>
          </button>
        )}
        
        <div className="header-text">
          {/* 제목과 부제목 제거 - 로고만 사용 */}
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">어</div>
            <div className="user-details">
              <span className="user-name">어르신</span>
              <span className="user-role">사용자</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ElderlyHeader; 