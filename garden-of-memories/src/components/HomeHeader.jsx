import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logoutUser } from '../services/api';
import './HomeHeader.css';

const HomeHeader = () => {
  const navigate = useNavigate();
  
  // 현재 사용자 정보 확인
  const currentUser = getCurrentUser();
  const isLoggedIn = isAuthenticated();

  const handleEnterGarden = () => navigate('/login');
  
  const handleLinkClick = (e, path) => { 
    e.preventDefault(); 
    if (path) navigate(path); 
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      try {
        await logoutUser();
        alert('로그아웃되었습니다.');
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 중 오류:', error);
        navigate('/login');
      }
    }
  };

  const handleUserMenu = () => {
    if (currentUser?.role === 'guardian') {
      navigate('/game-select-dashboard');
    } else {
      navigate('/game-select');
    }
  };

  return (
    <header className="home-header-container home-header-frosted">
      <div className="home-header-logo">
        <div className="home-header-logo-mark">GoM</div>
        <h1 className="home-header-brand">
          <span className="home-serif">GARDEN</span> <span className="home-header-of">of</span> <span className="home-serif">MEMORIES</span>
        </h1>
      </div>
      <nav className="home-header-nav">
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>활동</a>
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>소개</a>
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>문의</a>
        
        {isLoggedIn ? (
          // 로그인된 사용자: 사용자 정보와 메뉴
          <div className="home-header-user-section">
            <div className="home-header-user-info" onClick={handleUserMenu}>
              <div className="home-header-user-avatar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" 
                    fill="white"
                  />
                  <path 
                    d="M10 12C6.68629 12 4 14.6863 4 18V20H16V18C16 14.6863 13.3137 12 10 12Z" 
                    fill="white"
                  />
                </svg>
              </div>
              <div className="home-header-user-details">
                <div className="home-header-user-name">{currentUser?.username || '사용자'}</div>
                <div className="home-header-user-role">
                  {currentUser?.role === 'guardian' ? '보호자' : '피보호자'}
                </div>
              </div>
            </div>
            <button className="home-header-logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          // 로그인되지 않은 사용자: 로그인 버튼
          <button className="home-header-login-btn" onClick={handleEnterGarden}>로그인</button>
        )}
      </nav>
    </header>
  );
};

export default HomeHeader;
