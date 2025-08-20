import React from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { getCurrentUser, isAuthenticated } from '../services/api';
=======
import { getCurrentUser, isAuthenticated, logoutUser } from '../services/api';
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/main
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
<<<<<<< HEAD
=======
          
          {/* 로그아웃 버튼 */}
          {isLoggedIn && (
            <button className="elderly-logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          )}
>>>>>>> origin/main
        </div>
      </div>
    </header>
  );
}

export default ElderlyHeader;
