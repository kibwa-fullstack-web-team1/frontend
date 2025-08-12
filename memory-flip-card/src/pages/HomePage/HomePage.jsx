import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleEnterGarden = () => {
    navigate('/login');
  };

  const handleCaregiverDashboard = () => {
    navigate('/card-game-dashboard');
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo">
          <div className="home-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="home-logo-text">Garden of Memory</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main-content">
        {/* Hero Section */}
        <section className="home-hero-section">
          <div className="home-hero-text">
            <h2 className="home-hero-title">
              기억의 정원에 오신 것을 환영합니다
            </h2>
            <div className="home-hero-description">
              <p className="home-description-text">
                소중한 추억들이 꽃처럼 피어나는 특별한 공간입니다.
              </p>
              <p className="home-description-text">
                당신만의 기억을 심고 가꾸어 보세요.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <section className="home-cta-section">
          <button className="home-cta-button" onClick={handleEnterGarden}>
            <span>정원에 입장하기</span>
            <div className="home-arrow-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#171412" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </section>

        {/* Services Section */}
        <section className="home-services-section">
          <h3 className="home-section-title">서비스</h3>
          
          <div className="home-services-grid">
            {/* 추억 저장 */}
            <div className="home-service-card">
              <div className="home-service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 2H20V22H4V2Z" stroke="#171412" strokeWidth="2"/>
                  <path d="M8 6H16" stroke="#171412" strokeWidth="2"/>
                  <path d="M8 10H16" stroke="#171412" strokeWidth="2"/>
                  <path d="M8 14H12" stroke="#171412" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-service-title">추억 저장</h4>
              <p className="home-service-description">
                소중한 순간들을 안전하게 보관하세요
              </p>
            </div>

            {/* 기억 공유 */}
            <div className="home-service-card">
              <div className="home-service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="#171412" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-service-title">기억 공유</h4>
              <p className="home-service-description">
                가족과 친구들과 함께 나누세요
              </p>
            </div>

            {/* 특별한 순간 */}
            <div className="home-service-card">
              <div className="home-service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z" stroke="#171412" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-service-title">특별한 순간</h4>
              <p className="home-service-description">
                인생의 소중한 이정표를 기록하세요
              </p>
            </div>

            {/* 보호자 대시보드 */}
            <div className="home-service-card" onClick={handleCaregiverDashboard}>
              <div className="home-service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H21V21H3V3Z" stroke="#171412" strokeWidth="2"/>
                  <path d="M9 9H15" stroke="#171412" strokeWidth="2"/>
                  <path d="M9 13H15" stroke="#171412" strokeWidth="2"/>
                  <path d="M9 17H12" stroke="#171412" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-service-title">보호자 대시보드</h4>
              <p className="home-service-description">
                게임 결과와 사진 관리를 한눈에
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          {/* 서비스 메뉴 */}
          <div className="home-footer-section">
            <h4 className="home-footer-title">서비스</h4>
            <ul className="home-footer-menu">
              <li><a href="#" onClick={(e) => handleLinkClick(e, '/card-game')}>추억 카드 뒤집기</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e)}>이야기 순서 맞추기</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, '/daily-question')}>오늘의 질문</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e)}>나만의 정원 가꾸기</a></li>
            </ul>
          </div>

          {/* 고객지원 메뉴 */}
          <div className="home-footer-section">
            <h4 className="home-footer-title">고객지원</h4>
            <ul className="home-footer-menu">
              <li><a href="#" onClick={(e) => handleLinkClick(e)}>도움말</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e)}>문의하기</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e)}>개인정보처리방침</a></li>
            </ul>
          </div>

          {/* 연결하기 */}
          <div className="home-footer-section">
            <h4 className="home-footer-title">연결하기</h4>
            <div className="home-social-links">
              <a href="#" className="home-social-link" onClick={(e) => handleLinkClick(e)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M0 1.5L16 13.5" stroke="#171412" strokeWidth="1.5"/>
                </svg>
              </a>
              <a href="#" className="home-social-link" onClick={(e) => handleLinkClick(e)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.03 2.67L14.98 13.33" stroke="#171412" strokeWidth="1.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage; 