import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logoutUser } from '../services/api';
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

  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      try {
        await logoutUser();
        alert('로그아웃되었습니다.');
        navigate('/login'); // 로그인 페이지로 이동
      } catch (error) {
        console.error('로그아웃 중 오류:', error);
        // 오류가 있어도 로그인 페이지로 이동
        navigate('/login');
      }
    }
  };

  return (
    <header className="elderly-header">
      <div className="elderly-header-content">
        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button className="elderly-back-button" onClick={handleBackClick}>
            <div className="elderly-logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M10 12L6 8L10 4" 
                  stroke="#171412" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path 
                  d="M14 14C17.3137 14 20 11.3137 20 8C20 4.68629 17.3137 2 14 2C10.6863 2 8 4.68629 8 8C8 11.3137 10.6863 14 14 14Z" 
                  fill="white"
                />
                <path 
                  d="M14 16C9.58172 16 6 19.5817 6 24V26H22V24C22 19.5817 18.4183 16 14 16Z" 
                  fill="white"
                />
              </svg>
            </div>
            <div className="elderly-user-details">
              <div className="elderly-user-name">{userName}</div>
              <div className="elderly-user-role">{userRole}</div>
            </div>
          </div>
          
          {/* 로그아웃 버튼 */}
          {isLoggedIn && (
            <button className="elderly-logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default ElderlyHeader;
