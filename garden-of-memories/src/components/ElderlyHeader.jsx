import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../services/api';
import { FaChevronLeft, FaUser } from 'react-icons/fa';
import './ElderlyHeader.css';

function ElderlyHeader({ title = "기억의 정원", subtitle = "", onBackClick, showBackButton = true }) {
  const navigate = useNavigate();
  
  // 로그인한 사용자 정보 가져오기
  const currentUser = getCurrentUser();
  const isLoggedIn = isAuthenticated();
  
  // 사용자 이름과 역할 설정
  const userName = currentUser?.username || currentUser?.nickname || '사용자님';
  const userRole = currentUser?.role === 'elderly' ? '어르신' : '어르신';

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
        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button className="elderly-back-button" onClick={handleBackClick}>
            <div className="elderly-logo-icon">
              <FaChevronLeft />
            </div>
            <span>뒤로가기</span>
          </button>
        )}

        {/* 헤더 텍스트 */}
        <div className="elderly-header-text">
          <h1 className="elderly-header-title">{title}</h1>
          {subtitle && <p className="elderly-header-subtitle">{subtitle}</p>}
        </div>

        {/* 우측 사용자 정보 */}
        <div className="elderly-header-right">
          <div className="elderly-user-info">
            <div className="elderly-user-avatar">
              <FaUser />
            </div>
            <div className="elderly-user-details">
              <div className="elderly-user-name">{userName}</div>
              <div className="elderly-user-role">{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ElderlyHeader;
