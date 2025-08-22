import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isAuthenticated, getCurrentUser, getAuthToken } from '../../services/api';
import HomeHeader from '../../components/HomeHeader';
import { FaPuzzlePiece, FaClock, FaQuestionCircle, FaLeaf } from 'react-icons/fa';
import './HomePage.css';

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const navigate = useNavigate();
  const journeyStepsRef = useRef([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFamilyConnect, setShowFamilyConnect] = useState(false);
  const [showFamilyInvite, setShowFamilyInvite] = useState(false);
  const [invitationCode, setInvitationCode] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // 현재 사용자 정보 확인
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  }, []);

  const handleEnterGarden = () => {
    if (isAuthenticated()) {
      // 로그인된 사용자인 경우
      if (currentUser?.role === 'guardian') {
        // 보호자인 경우 가족 연결 상태 확인 후 정원으로 이동
        navigate('/game-select-dashboard');
      } else {
        // 시니어인 경우 게임 선택 페이지로 이동
        navigate('/game-select');
      }
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      navigate('/login');
    }
  };

  const handleFamilyConnect = () => {
    setShowFamilyConnect(true);
  };

  const handleCloseFamilyConnect = () => {
    setShowFamilyConnect(false);
  };

  const handleFamilyInvite = () => {
    console.log('가족 초대 버튼 클릭됨!');
    console.log('현재 사용자:', currentUser);
    console.log('현재 showFamilyInvite 상태:', showFamilyInvite);
    setShowFamilyInvite(true);
    console.log('showFamilyInvite를 true로 설정함');
  };

  const handleCloseFamilyInvite = () => {
    setShowFamilyInvite(false);
    setInvitationCode(null);
  };

  const generateInvitationCode = async () => {
    setIsGeneratingCode(true);
    
    try {
      // JWT 토큰 가져오기
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch('http://localhost:8000/family/invite-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          invitee_email: 'test@example.com',
          relationship_type_id: 5
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '초대코드 생성에 실패했습니다.');
      }

      const data = await response.json();
      setInvitationCode({
        code: data.code,
        expires_at: data.expires_at,
        created_at: data.created_at,
        is_used: data.is_used
      });
    } catch (error) {
      console.error('초대코드 생성 오류:', error);
      alert(error.message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationCode.code);
      alert('초대코드가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: '기억의 정원 초대코드',
        text: `초대코드: ${invitationCode.code}`,
        url: window.location.origin
      });
    } else {
      copyToClipboard();
    }
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

            {/* Moved elements start here */}
            <div className="home-hero-cta-buttons">
              <button className="home-cta-button home-pill" onClick={handleEnterGarden}>
                <span>정원에 입장하기</span>
                <div className="home-arrow-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="#6f6048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>
              
              {/* 가족 연결 안내 - 보호자만 (로그인 후) */}
              {isAuthenticated() && currentUser?.role === 'guardian' && (
                <div className="home-family-connect-info">
                  <p className="home-family-connect-text">
                    💡 가족과 연결하여 시니어의 활동을 함께 지켜보세요
                  </p>
                  <button className="home-family-connect-btn" onClick={handleFamilyConnect}>
                    가족 연결하기
                  </button>
                </div>
              )}

              {/* 시니어용 가족 초대 안내 - 시니어만 (로그인 후) */}
              {isAuthenticated() && currentUser?.role === 'senior' && (
                <div className="home-family-invite-info">
                  <p className="home-family-invite-text">
                    💡 가족을 초대하여 게임 결과와 추억을 함께 공유해보세요
                  </p>
                  <button className="home-family-invite-btn" onClick={handleFamilyInvite}>
                    가족 초대하기
                  </button>
                </div>
              )}

              {/* 로그인하지 않은 경우 안내 메시지 */}
              {!isAuthenticated() && (
                <div className="home-login-required-info">
                  <p className="home-login-required-text">
                    💡 가족 기능을 사용하려면 먼저 로그인해주세요
                  </p>
                </div>
              )}
            </div>
            {/* Moved elements end here */}
          </div>
        </section>

        {/* Game Categories - 피그마 디자인 스타일 */}
        <section className="home-game-categories-section">
          <h3 className="home-section-title home-serif">GAME CATEGORIES</h3>
          
          <div className="home-game-categories-grid">
            {/* Memory Game */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/card-game')}>
              <div className="home-game-category-icon">
                <FaPuzzlePiece />
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">MEMORY</h4>
                <p className="home-game-category-subtitle">기억력 향상을 위한 카드 매칭 게임으로<br/>추억을 되살려보세요</p>
              </div>
            </div>

            {/* Story Sequence Game */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/story-sequence')}>
              <div className="home-game-category-icon">
                <FaClock />
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">STORY</h4>
                <p className="home-game-category-subtitle">이야기 순서를 맞추며<br/>시간의 흐름을 되짚어보세요</p>
              </div>
            </div>

            {/* Daily Questions */}
            <div className="home-game-category-card home-glass home-featured" onClick={() => navigate('/daily-question')}>
              <div className="home-game-category-icon">
                <FaQuestionCircle />
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">TODAY'S QUESTION</h4>
                <p className="home-game-category-subtitle">매일 새로운 질문으로<br/>소중한 기억을 나누세요</p>
              </div>
              <div className="home-featured-badge">
                <span>오늘의 추천</span>
              </div>
            </div>

            {/* Garden */}
            <div className="home-game-category-card home-glass" onClick={() => navigate('/garden')}>
              <div className="home-game-category-icon">
                <FaLeaf />
              </div>
              <div className="home-game-category-content">
                <h4 className="home-game-category-title">GARDEN</h4>
                <p className="home-game-category-subtitle">나만의 정원을 가꾸고<br/>추억을 모아보세요</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta-section">
          {/* This section will become empty after moving elements */}
        </section>

        {/* 가족 연결 모달 */}
        {showFamilyConnect && (
          <div className="home-family-connect-modal">
            <div className="home-family-connect-modal-content">
              <div className="home-family-connect-modal-header">
                <h3>가족과 연결하기</h3>
                <button className="home-family-connect-modal-close" onClick={handleCloseFamilyConnect}>
                  ✕
                </button>
              </div>
              <div className="home-family-connect-modal-body">
                <div className="home-family-connect-step">
                  <div className="home-family-connect-step-number">1</div>
                  <div className="home-family-connect-step-content">
                    <h4>시니어에게 초대코드 요청</h4>
                    <p>시니어가 '가족 초대' 메뉴에서 생성한 초대코드를 받으세요.</p>
                  </div>
                </div>
                <div className="home-family-connect-step">
                  <div className="home-family-connect-step-number">2</div>
                  <div className="home-family-connect-step-content">
                    <h4>초대코드 입력</h4>
                    <p>받은 초대코드를 입력하여 가족과 연결하세요.</p>
                  </div>
                </div>
                <div className="home-family-connect-step">
                  <div className="home-family-connect-step-number">3</div>
                  <div className="home-family-connect-step-content">
                    <h4>활동 공유</h4>
                    <p>연결된 시니어의 게임 결과와 일일 질문 답변을 확인할 수 있습니다.</p>
                  </div>
                </div>
              </div>
              <div className="home-family-connect-modal-footer">
                <button className="home-family-connect-modal-btn" onClick={handleCloseFamilyConnect}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 가족 초대 모달 */}
        {showFamilyInvite && (
          <div className="home-family-invite-modal">
            {console.log('가족 초대 모달 렌더링됨! showFamilyInvite:', showFamilyInvite)}
            <div className="home-family-invite-modal-content">
              <div className="home-family-invite-modal-header">
                <h3>가족 초대</h3>
                <button className="home-family-invite-modal-close" onClick={handleCloseFamilyInvite}>
                  ✕
                </button>
              </div>
              <div className="home-family-invite-modal-body">
                <div className="home-family-invite-code-section">
                  <h4>초대코드 생성</h4>
                  <p>시니어에게 초대코드를 생성하여 공유해보세요.</p>
                  <button 
                    className="home-family-invite-generate-code-btn" 
                    onClick={generateInvitationCode}
                    disabled={isGeneratingCode}
                  >
                    {isGeneratingCode ? '초대코드 생성 중...' : '초대코드 생성하기'}
                  </button>
                  {invitationCode && (
                    <div className="home-family-invite-code-details">
                      <p>생성된 초대코드: <strong>{invitationCode.code}</strong></p>
                      <p>만료일: <strong>{new Date(invitationCode.expires_at).toLocaleDateString()}</strong></p>
                      <p>생성일: <strong>{new Date(invitationCode.created_at).toLocaleDateString()}</strong></p>
                      <p>사용 여부: <strong>{invitationCode.is_used ? '사용됨' : '사용 안됨'}</strong></p>
                      <button className="home-family-invite-copy-code-btn" onClick={copyToClipboard}>
                        초대코드 복사
                      </button>
                      <button className="home-family-invite-share-code-btn" onClick={shareCode}>
                        초대코드 공유
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="home-family-invite-modal-footer">
                <button className="home-family-invite-modal-btn" onClick={handleCloseFamilyInvite}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}







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
