import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomeHeader from '../../components/HomeHeader';
import './HomePage.css';

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const navigate = useNavigate();
  const journeyStepsRef = useRef([]);

  const handleEnterGarden = () => {
    navigate('/login');
  };

  // GSAP ScrollTrigger를 사용한 순차적 카드 강조 애니메이션
  useEffect(() => {
    const steps = journeyStepsRef.current.filter(step => step !== null);
    
    if (steps.length === 0) return;

    // 초기 상태 설정 - 모든 카드를 숨김
    gsap.set(steps, {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // 각 카드에 대해 ScrollTrigger 생성
    steps.forEach((step, index) => {
      const content = step.querySelector('.home-journey-content');
      const number = step.querySelector('.home-journey-number');

      // 카드가 화면 중앙에 올 때 강조
      ScrollTrigger.create({
        trigger: step,
        start: 'center 70%', // 더 일찍 트리거해서 5번째 카드도 강조되도록
        end: 'center 30%',   // 더 늦게 종료해서 안정적인 강조 유지
        
        onEnter: () => {
          console.log(`카드 ${index + 1} 활성화`);
          
          // 모든 카드에서 활성 클래스 제거 및 비활성 상태로
          steps.forEach(s => {
            s.classList.remove('gsap-active');
            gsap.to(s, {
              opacity: 0.3,
              scale: 0.95,
              filter: 'blur(1px)',
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            });
          });

          // 현재 카드에 활성 클래스 추가 및 활성화 (반응형 고려)
          step.classList.add('gsap-active');
          const isMobile = window.innerWidth <= 768;
          gsap.to(step, {
            opacity: 1,
            scale: isMobile ? 1.05 : 1.08,
            filter: 'blur(0px)',
            y: isMobile ? -8 : -15,
            duration: 0.8,
            ease: 'back.out(1.2)',
            zIndex: 10
          });

          // 카드 내용 강조
          if (content) {
            gsap.to(content, {
              boxShadow: '0 25px 70px rgba(111, 96, 72, 0.3)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(111, 96, 72, 0.2)',
              duration: 0.8,
              ease: 'power2.out'
            });
          }

          // 번호 강조
          if (number) {
            gsap.to(number, {
              scale: 1.25,
              background: 'linear-gradient(135deg, #6f6048 0%, #8B5A00 100%)',
              boxShadow: '0 8px 25px rgba(111, 96, 72, 0.4)',
              duration: 0.8,
              ease: 'back.out(1.3)'
            });
          }
        },

        onLeave: () => {
          console.log(`카드 ${index + 1} 비활성화`);
        },

        onEnterBack: () => {
          console.log(`카드 ${index + 1} 재활성화`);
          
          // 모든 카드에서 활성 클래스 제거 및 비활성 상태로
          steps.forEach(s => {
            s.classList.remove('gsap-active');
            gsap.to(s, {
              opacity: 0.3,
              scale: 0.95,
              filter: 'blur(1px)',
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            });
          });

          // 현재 카드에 활성 클래스 추가 및 활성화 (반응형 고려)
          step.classList.add('gsap-active');
          const isMobile = window.innerWidth <= 768;
          gsap.to(step, {
            opacity: 1,
            scale: isMobile ? 1.05 : 1.08,
            filter: 'blur(0px)',
            y: isMobile ? -8 : -15,
            duration: 0.8,
            ease: 'back.out(1.2)',
            zIndex: 10
          });

          // 카드 내용 강조
          if (content) {
            gsap.to(content, {
              boxShadow: '0 25px 70px rgba(111, 96, 72, 0.3)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(111, 96, 72, 0.2)',
              duration: 0.8,
              ease: 'power2.out'
            });
          }

          // 번호 강조
          if (number) {
            gsap.to(number, {
              scale: 1.25,
              background: 'linear-gradient(135deg, #6f6048 0%, #8B5A00 100%)',
              boxShadow: '0 8px 25px rgba(111, 96, 72, 0.4)',
              duration: 0.8,
              ease: 'back.out(1.3)'
            });
          }
        }
      });

      // 초기 등장 애니메이션 - 깜빡임 방지를 위해 개선
      ScrollTrigger.create({
        trigger: step,
        start: 'top 85%',
        onEnter: () => {
          // 이미 활성화된 카드는 건드리지 않음
          if (step.classList.contains('gsap-active')) return;
          
          gsap.to(step, {
            opacity: 0.3,
            y: 0,
            scale: 0.95,
            filter: 'blur(1px)',
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
          });
        }
      });
    });

    // 컴포넌트 언마운트 시 ScrollTrigger 정리
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="home-page home-gom-theme">
      {/* 배경 장식 */}
      <div className="home-gom-bg"/>
      <div className="home-petals">
        {/* 첫 번째 레이어 - 기본 꽃잎들 */}
        <span className="home-petal home-p1" />
        <span className="home-petal home-p2" />
        <span className="home-petal home-p3" />
        <span className="home-petal home-p4" />
        <span className="home-petal home-p5" />
        <span className="home-petal home-p6" />
        
        {/* 두 번째 레이어 - 추가 꽃잎들 */}
        <span className="home-petal home-p7" />
        <span className="home-petal home-p8" />
        
        {/* 세 번째 레이어 - 작은 꽃잎들 */}
        <span className="home-petal home-petal-small home-p13" />
        <span className="home-petal home-petal-small home-p14" />
        <span className="home-petal home-petal-small home-p15" />
        
        {/* 네 번째 레이어 - 큰 꽃잎들 */}
        <span className="home-petal home-petal-large home-p17" />
        <span className="home-petal home-petal-large home-p18" />
      </div>

      {/* Header */}
      <HomeHeader />

      {/* Main */}
      <main className="home-main-content">
        {/* Hero */}
        <section className="home-hero-section">
          <div className="home-hero-content">
            <h2 className="home-hero-title home-serif">기억의 정원에<br/> 오신 것을 환영합니다</h2>
            <div className="home-hero-description">
              <p className="home-description-text">소중한 추억들이 꽃처럼 피어나는 특별한 공간입니다.</p>
              <p className="home-description-text">당신만의 기억을 심고 가꾸어 보세요.</p>
            </div>
          </div>
        </section>

        {/* Game Categories - 피그마 디자인 스타일 */}
        <section className="home-game-categories-section">
          <h3 className="home-section-title home-serif">GAME CATEGORIES</h3>
          
          <div className="home-game-categories-grid">
            {/* Memory Game */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/card-game')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="20" r="8" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M16 20c0-4 3-8 8-8s8 4 8 8" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M12 32c0-6 5-12 12-12s12 6 12 12" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="26" r="2" fill="#6f6048"/>
                  <circle cx="30" cy="26" r="2" fill="#6f6048"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">MEMORY</h4>
                <p className="home-game-category-subtitle">기억력 향상을 위한 카드 매칭 게임으로<br/>추억을 되살려보세요</p>
              </div>
            </div>

            {/* Story Sequence Game */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/story-sequence')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M12 16c0-2 2-4 4-4h16c2 0 4 2 4 4v16c0 2-2 4-4 4H16c-2 0-4-2-4-4V16z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M20 20h8M20 24h8M20 28h6" stroke="#6f6048" strokeWidth="2"/>
                  <circle cx="16" cy="20" r="2" fill="#6f6048"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">STORY</h4>
                <p className="home-game-category-subtitle">이야기 순서를 맞추며<br/>시간의 흐름을 되짚어보세요</p>
              </div>
            </div>

            {/* Puzzle Game */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/puzzle-game')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M12 12h10v10H12zM26 12h10v10H26zM12 26h10v10H12zM26 26h10v10H26z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M22 17h4v6h-4zM17 22h6v4h-6z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">PUZZLE</h4>
                <p className="home-game-category-subtitle">조각을 맞추며 완성해가는<br/>성취감을 경험하세요</p>
              </div>
            </div>

            {/* Daily Questions */}
            <div className="home-game-category-card home-glass home-featured" onClick={() => navigate('/daily-question')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="16" stroke="#ffffff" strokeWidth="2" fill="none"/>
                  <path d="M24 16v8l6 6" stroke="#ffffff" strokeWidth="2"/>
                  <circle cx="24" cy="12" r="2" fill="#ffffff"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">TODAY'S QUESTION</h4>
                <p className="home-game-category-subtitle">매일 새로운 질문으로<br/>소중한 기억을 나누세요</p>
              </div>
              <div className="home-featured-badge">
                <span>오늘의 추천</span>
              </div>
            </div>

            {/* Memory Training */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/memory-training')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8c8 0 16 6 16 16s-8 16-16 16S8 32 8 24 16 8 24 8z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M24 16v8l6 4" stroke="#6f6048" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="2" fill="#6f6048"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">TRAINING</h4>
                <p className="home-game-category-subtitle">체계적인 기억력 훈련으로<br/>인지능력을 향상시키세요</p>
              </div>
            </div>

            {/* Relaxation */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/relaxation')}>
              <div className="home-game-category-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8c0 4-4 8-8 8s-8-4-8-8c0 4 4 8 8 8s8-4 8-8z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M40 8c0 4-4 8-8 8s-8-4-8-8c0 4 4 8 8 8s8-4 8-8z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M32 24c0 4-4 8-8 8s-8-4-8-8c0 4 4 8 8 8s8-4 8-8z" stroke="#6f6048" strokeWidth="2" fill="none"/>
                  <path d="M16 32v8M24 32v8M32 32v8" stroke="#6f6048" strokeWidth="2"/>
                </svg>
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">RELAXATION</h4>
                <p className="home-game-category-subtitle">마음의 평안을 찾는<br/>힐링 콘텐츠를 즐기세요</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta-section">
          <button className="home-cta-button home-pill" onClick={handleEnterGarden}>
            <span>정원에 입장하기</span>
            <div className="home-arrow-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="#6f6048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </button>
        </section>







        {/* 웹사이트 사용 가이드 */}
        <section className="home-journey-section">
          <h3 className="home-section-title serif">사용 가이드</h3>
          <div className="home-journey-container">
            <div className="home-journey-line" />
            
            <div className="home-journey-step" ref={el => journeyStepsRef.current[0] = el}>
              <div className="home-journey-number">1</div>
              <div className="home-journey-content home-glass">
                <h4 className="home-journey-title">시작하기 - 회원가입 & 로그인</h4>
                <p className="home-journey-description">기억의 정원에 첫 발을 내딛어보세요. 어르신 또는 보호자 계정을 선택하여 맞춤형 서비스를 시작하실 수 있습니다.</p>
                <div className="home-journey-features">
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>어르신 / 보호자 역할 선택</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>간편한 회원가입 절차</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>안전한 개인정보 보호</span></div>
                </div>
              </div>
            </div>

            <div className="home-journey-step" ref={el => journeyStepsRef.current[1] = el}>
              <div className="home-journey-number">2</div>
              <div className="home-journey-content home-glass">
                <h4 className="home-journey-title">게임 카테고리 둘러보기</h4>
                <p className="home-journey-description">다양한 인지 훈련 게임들을 살펴보세요. 기억력, 이야기 순서, 퍼즐 등 재미있는 활동들이 준비되어 있습니다.</p>
                <div className="home-journey-features">
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>3가지 게임 카테고리</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>난이도별 게임 선택</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>개인 맞춤 추천</span></div>
                </div>
              </div>
            </div>

            <div className="home-journey-step" ref={el => journeyStepsRef.current[2] = el}>
              <div className="home-journey-number">3</div>
              <div className="home-journey-content home-glass">
                <h4 className="home-journey-title">게임 플레이 & 기록</h4>
                <p className="home-journey-description">선택한 게임을 플레이하고 결과를 기록해보세요. 매일 조금씩 도전하여 인지 능력을 향상시킬 수 있습니다.</p>
                <div className="home-journey-features">
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>실시간 점수 기록</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>진행 상황 저장</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>성취도 분석</span></div>
                </div>
              </div>
            </div>

            <div className="home-journey-step" ref={el => journeyStepsRef.current[3] = el}>
              <div className="home-journey-number">4</div>
              <div className="home-journey-content home-glass">
                <h4 className="home-journey-title">오늘의 질문 참여</h4>
                <p className="home-journey-description">매일 새로운 질문에 답변하며 소중한 추억을 기록하고 나누세요. 음성이나 텍스트로 자유롭게 표현할 수 있습니다.</p>
                <div className="home-journey-features">
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>일일 질문 알림</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>음성/텍스트 답변</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>추억 아카이브 구축</span></div>
                </div>
              </div>
            </div>

            <div className="home-journey-step" ref={el => journeyStepsRef.current[4] = el}>
              <div className="home-journey-number">5</div>
              <div className="home-journey-content home-glass">
                <h4 className="home-journey-title">결과 확인 & 가족과 공유</h4>
                <p className="home-journey-description">대시보드에서 활동 내역과 성과를 확인하고, 가족들과 함께 진전 상황을 공유해보세요. 함께하는 기쁨이 더욱 커집니다.</p>
                <div className="home-journey-features">
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>상세한 활동 리포트</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>가족 계정 연동</span></div>
                  <div className="home-journey-feature"><div className="home-journey-feature-dot"/><span>문자메세지 연동</span></div>
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
