import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../services/api';
import './ElderlyHeader.css';

const ElderlyHeader = ({ title, subtitle, showBackButton = true, onBackClick }) => {
  const navigate = useNavigate();
  
  // 로그인한 사용자 정보 가져오기
  const currentUser = getCurrentUser();
  const isLoggedIn = isAuthenticated();
  
  // 사용자 이름과 역할 설정
  const userName = currentUser?.username || currentUser?.nickname || '사용자';
  const userRole = currentUser?.role === 'senior' ? '어르신' : '사용자';

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="elderly-header">
      <div className="elderly-header-content">
        {showBackButton && (
          <button className="elderly-back-button" onClick={handleBackClick}>
            <div className="elderly-logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.14 0.38L14.85 15.62" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <span>기억의 정원</span>
          </button>
        )}
        
        <div className="elderly-header-text">
          {/* 제목과 부제목 제거 - 로고만 사용 */}
        </div>
        
        <div className="elderly-header-right">
          <div className="elderly-user-info">
            <div className="elderly-user-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#FFFFFF"/>
                <path d="M4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12Z" fill="#FFFFFF"/>
                <path d="M18 12C18 10.9 18.9 10 20 10C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14C18.9 14 18 13.1 18 12Z" fill="#FFFFFF"/>
                <path d="M12 18C12 16.9 12.9 16 14 16C15.1 16 16 16.9 16 18C16 19.1 15.1 20 14 20C12.9 20 12 19.1 12 18Z" fill="#FFFFFF"/>
                <path d="M12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8Z" fill="#FFFFFF"/>
              </svg>
            </div>
            <div className="elderly-user-details">
              <span className="elderly-user-name">{userName}</span>
              <span className="elderly-user-role">{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ElderlyHeader; 