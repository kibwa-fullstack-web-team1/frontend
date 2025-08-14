import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleEnterGarden = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
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
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M0 0.33L12 13.67" stroke="#000000" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="home-logo-text">Garden of Memory</h1>
        </div>
        <nav className="home-nav">
          <a href="#" className="home-nav-link" onClick={(e) => handleLinkClick(e)}>활동</a>
          <a href="#" className="home-nav-link" onClick={(e) => handleLinkClick(e)}>소개</a>
          <a href="#" className="home-nav-link" onClick={(e) => handleLinkClick(e)}>문의</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="home-main-content">
        {/* Hero Section */}
        <section className="home-hero-section">
          <div className="home-hero-content">
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

        {/* Services Cards */}
        <section className="home-services-section">
          <div className="home-services-grid">
            {/* 추억 저장 */}
            <div className="home-service-card">
              <div className="home-service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 2H20V22H4V2Z" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 6H16" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 10H16" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 14H12" stroke="#8B5A00" strokeWidth="2"/>
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
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="#8B5A00" strokeWidth="2"/>
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
                  <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-service-title">특별한 순간</h4>
              <p className="home-service-description">
                인생의 소중한 이정표를 기록하세요
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
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#8B5A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </section>

        {/* Our Activities Section */}
        <section className="home-activities-section">
          <h3 className="home-section-title">우리의 활동</h3>
          <p className="home-section-description">
            기억의 정원에서 제공하는 다양한 서비스를 통해 소중한 추억을 간직하세요
          </p>
          
          <div className="home-activities-grid">
            {/* 추억 저장소 */}
            <div className="home-activity-card">
              <div className="home-activity-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 4H28V28H4V4Z" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 8H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 12H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 16H20" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-activity-title">추억 저장소</h4>
              <p className="home-activity-description">
                사진, 동영상, 일기, 편지 등 다양한 형태의 추억을 디지털로 보관할 수 있습니다. 클라우드 기반의 안전한 저장 시스템으로
                소중한 기억들을 영원히 간직하세요.
              </p>
              <div className="home-activity-features">
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>무제한 저장 공간</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>자동 백업 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>태그 및 검색 기능</span>
                </div>
              </div>
            </div>

            {/* 가족 앨범 */}
            <div className="home-activity-card">
              <div className="home-activity-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M2.67 2.67H29.33V29.33H2.67V2.67Z" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 8H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 16H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 24H20" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-activity-title">가족 앨범</h4>
              <p className="home-activity-description">
                가족 구성원들과 함께 만들어가는 공동 앨범입니다. 각자의 시선으로 담은 소중한 순간들을 모아 하나의 아름다운 이야기를
                완성하세요.
              </p>
              <div className="home-activity-features">
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>실시간 공유 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>댓글 및 반응 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>프라이버시 설정</span>
                </div>
              </div>
            </div>

            {/* 타임라인 */}
            <div className="home-activity-card">
              <div className="home-activity-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M2.67 2.67H29.33V29.33H2.67V2.67Z" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 8H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 16H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 24H20" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-activity-title">타임라인</h4>
              <p className="home-activity-description">
                시간 순서대로 정리된 인생의 여정을 한눈에 볼 수 있습니다. 중요한 이정표와 일상의 소소한 순간들이 어우러진 나만의 인생
                스토리를 만들어보세요.
              </p>
              <div className="home-activity-features">
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>연도별 정리 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>이벤트 카테고리</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>추억 연결 기능</span>
                </div>
              </div>
            </div>

            {/* 특별한 순간 기록 */}
            <div className="home-activity-card">
              <div className="home-activity-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M2.67 2.67H29.33V29.33H2.67V2.67Z" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 8H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 16H24" stroke="#8B5A00" strokeWidth="2"/>
                  <path d="M8 24H20" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-activity-title">특별한 순간 기록</h4>
              <p className="home-activity-description">
                생일, 졸업, 결혼, 출산 등 인생의 중요한 순간들을 특별하게 기록하고 기념할 수 있습니다. 미래의 나에게 보내는 편지 기능도
                제공합니다.
              </p>
              <div className="home-activity-features">
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>기념일 알림 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>미래 편지 기능</span>
                </div>
                <div className="home-feature-item">
                  <div className="home-feature-dot"></div>
                  <span>추억 캡슐 생성</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Meaning Section */}
        <section className="home-meaning-section">
          <h3 className="home-section-title">프로젝트의 의의</h3>
          
          <div className="home-meaning-grid">
            {/* 감정의 보존 */}
            <div className="home-meaning-card">
              <div className="home-meaning-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M3.33 5L36.67 35.58" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-meaning-title">감정의 보존</h4>
              <p className="home-meaning-description">
                단순한 데이터 저장을 넘어서, 그 순간의 감정과 의미까지 함께 보존합니다. 미래의 나와 가족들에게 전하는 소중한 유산이
                됩니다.
              </p>
            </div>

            {/* 세대 간 연결 */}
            <div className="home-meaning-card">
              <div className="home-meaning-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M16.67 1.78L28.33 36.66" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-meaning-title">세대 간 연결</h4>
              <p className="home-meaning-description">
                할머니의 이야기부터 손자의 첫걸음까지, 세대를 아우르는 가족의 역사를 하나로 연결합니다. 가족의 뿌리와 정체성을 강화합니다.
              </p>
            </div>

            {/* 치유와 성장 */}
            <div className="home-meaning-card">
              <div className="home-meaning-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M3.33 3.33H36.67V36.67H3.33V3.33Z" stroke="#8B5A00" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="home-meaning-title">치유와 성장</h4>
              <p className="home-meaning-description">
                과거의 추억을 되돌아보며 현재를 이해하고 미래를 설계할 수 있습니다. 기억을 통한 자기 성찰과 치유의 과정을 지원합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Digital Memory Section */}
        <section className="home-digital-section">
          <div className="home-digital-content">
            <h3 className="home-digital-title">디지털 시대의 새로운 기억 보관법</h3>
            <p className="home-digital-description">
              스마트폰과 소셜미디어로 넘쳐나는 일상 속에서, 정말 소중한 순간들은 오히려 묻혀버리기 쉽습니다. 기억의 정원은 의미 있는
              순간들을 선별하고, 정리하고, 보존하여 진정한 가치를 되찾아줍니다.
            </p>
            
            <div className="home-comparison">
              <div className="home-comparison-left">
                <h4 className="home-comparison-title">기존 방식의 한계</h4>
                <div className="home-comparison-items">
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-negative"></div>
                    <span>흩어진 플랫폼들</span>
                  </div>
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-negative"></div>
                    <span>일시적인 저장</span>
                  </div>
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-negative"></div>
                    <span>맥락 없는 데이터</span>
                  </div>
                </div>
              </div>
              
              <div className="home-comparison-right">
                <h4 className="home-comparison-title">우리의 해결책</h4>
                <div className="home-comparison-items">
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-positive"></div>
                    <span>통합된 플랫폼</span>
                  </div>
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-positive"></div>
                    <span>영구적인 보존</span>
                  </div>
                  <div className="home-comparison-item">
                    <div className="home-comparison-dot home-comparison-dot-positive"></div>
                    <span>의미 있는 스토리</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Journey Section */}
        <section className="home-journey-section">
          <h3 className="home-section-title">사용자 여정</h3>
          
          <div className="home-journey-container">
            <div className="home-journey-line"></div>
            
            <div className="home-journey-step">
              <div className="home-journey-number">1</div>
              <div className="home-journey-content">
                <h4 className="home-journey-title">1. 첫 번째 씨앗 심기</h4>
                <p className="home-journey-description">
                  회원가입과 함께 첫 번째 추억을 업로드하세요. 사진 한 장, 짧은 글 한 줄이면 충분합니다.
                </p>
                <div className="home-journey-features">
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>간편 가입</span>
                  </div>
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>첫 추억 등록</span>
                  </div>
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>개인 정원 생성</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-journey-step">
              <div className="home-journey-number">2</div>
              <div className="home-journey-content">
                <h4 className="home-journey-title">2. 정원 가꾸기</h4>
                <p className="home-journey-description">
                  일상의 소중한 순간들을 꾸준히 기록하며 나만의 추억 정원을 풍성하게 만들어가세요.
                </p>
                <div className="home-journey-features">
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>일상 기록</span>
                  </div>
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>태그 정리</span>
                  </div>
                  <div className="home-journey-feature">
                    <div className="home-journey-feature-dot"></div>
                    <span>카테고리 분류</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-journey-step">
              <div className="home-journey-number">3</div>
              <div className="home-journey-content">
                <h4 className="home-journey-title">3. 가족과 함께</h4>
                <div className="home-family-illustration">
                  <svg width="1257" height="66" viewBox="0 0 1257 66" fill="none">
                    <path d="M0 0H1257V66H0V0Z" fill="#FFFBF0"/>
                    <path d="M0 65H1257V65" stroke="#F4E4A6" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage; 