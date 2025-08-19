import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import ElderlyHeader from '../../components/ElderlyHeader';
import { FaPuzzlePiece, FaClock, FaQuestionCircle, FaLeaf, FaArrowRight, FaSeedling, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import './GameSelectPage.css';

function GameSelectPage() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const games = [
    {
      id: 'memory-flip-card',
      title: '추억의 퍼즐 맞추기',
      description: '흩어진 기억의 조각들을 맞춰보세요',
      difficulty: '쉬움',
      icon: <FaPuzzlePiece />,
      color: 'rgba(244, 194, 161, 0.2)'
    },
    {
      id: 'story-sequence',
      title: '시간 여행자',
      description: '과거와 현재를 오가며 이야기를 완성하세요',
      difficulty: '보통',
      icon: <FaClock />,
      color: 'rgba(242, 184, 148, 0.2)'
    },
    {
      id: 'memory-maze',
      title: '오늘의 질문',
      description: "오늘의 질문에 답하며 새로운 나를 발견하세요",
      difficulty: '어려움',
      icon: <FaQuestionCircle />,
      color: 'rgba(246, 202, 167, 0.2)'
    },
    {
      id: 'emotion-garden',
      title: '감정의 정원',
      description: '다양한 감정들을 키워 아름다운 정원을 만드세요',
      difficulty: '쉬움',
      icon: <FaLeaf />,
      color: 'rgba(240, 176, 136, 0.2)'
    }
  ];

  const handleGameSelect = (gameId) => {
    switch (gameId) {
      case 'memory-flip-card':
        navigate('/card-game');
        break;
      case 'story-sequence':
        navigate('/story-sequence');
        break;
      case 'memory-maze':
        navigate('/daily-question');
        break;
      case 'emotion-garden':
        navigate('/game');
        break;
      default:
        navigate('/game');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const goToSlide = useCallback((index) => {
    console.log('goToSlide called:', { index, currentIndex, isAnimating });
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    const cards = carouselRef.current.children;
    const direction = index > currentIndex ? -1 : 1;
    const prevIndex = currentIndex; // 현재 인덱스를 저장
    
    console.log('Animation starting:', { prevIndex, index, direction });
    
    // 현재 카드 애니메이션 (숨기기)
    gsap.to(cards[prevIndex], {
      x: direction * 100 + '%',
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // 애니메이션 완료 후 완전히 숨기기
        gsap.set(cards[prevIndex], { visibility: 'hidden' });
        console.log('Hide animation complete for index:', prevIndex);
      }
    });

    // 새 카드 애니메이션 (보이기)
    gsap.set(cards[index], { visibility: 'visible' });
    gsap.fromTo(cards[index], 
      {
        x: direction * -100 + '%',
        opacity: 0,
        scale: 0.8
      },
      {
        x: '0%',
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setIsAnimating(false);
          console.log('Show animation complete for index:', index);
        }
      }
    );

    setCurrentIndex(index);
  }, [currentIndex, isAnimating]);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % games.length;
    goToSlide(nextIndex);
  }, [currentIndex, goToSlide, games.length]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentIndex - 1 + games.length) % games.length;
    goToSlide(prevIndex);
  }, [currentIndex, goToSlide, games.length]);

  useEffect(() => {
    // 초기 애니메이션
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    
    // 모든 카드를 숨기고 첫 번째만 보이게 설정
    gsap.set(cards, { 
      opacity: 0, 
      scale: 0.8, 
      x: '100%', 
      visibility: 'hidden' 
    });
    gsap.set(cards[0], { 
      opacity: 1, 
      scale: 1, 
      x: '0%', 
      visibility: 'visible' 
    });

    // 입장 애니메이션
    gsap.fromTo(cards[0], 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  // 자동 슬라이드를 별도 useEffect로 분리 (임시 비활성화)
  // useEffect(() => {
  //   const autoSlide = setInterval(() => {
  //     if (!isAnimating) {
  //       nextSlide();
  //     }
  //   }, 5000);

  //   return () => clearInterval(autoSlide);
  // }, [isAnimating, nextSlide]);

  useEffect(() => {
    // 키보드 네비게이션
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isAnimating]);

  return (
    <div className="select-game-page">
      <ElderlyHeader 
        title="기억의 정원" 
        subtitle="게임을 선택하세요"
        onBackClick={handleBackToHome}
      />

      <main className="select-carousel-main-content">
        <div className="select-carousel-container">
          <button 
            className="select-carousel-nav select-carousel-nav-prev" 
            onClick={prevSlide}
            disabled={isAnimating}
          >
            <FaChevronLeft />
          </button>

          <div className="select-carousel-wrapper">
            <div className="select-carousel-cards" ref={carouselRef}>
              {games.map((game, index) => (
                <div 
                  key={game.id} 
                  className={`select-carousel-card ${index === currentIndex ? 'active' : ''}`}
                  style={{ '--card-color': game.color }}
                >
                  <div className="select-card-background"></div>
                  
                  <div className="select-card-header">
                    <div className="select-card-icon">
                      {game.icon}
                    </div>
                    <div className="select-card-difficulty">
                      {game.difficulty}
                    </div>
                  </div>
                  
                  <div className="select-card-content">
                    <h3 className="select-card-title">{game.title}</h3>
                    <p className="select-card-description">{game.description}</p>
                  </div>
                  
                  <button 
                    className="select-card-start-btn"
                    onClick={() => handleGameSelect(game.id)}
                  >
                    <span>게임 시작</span>
                    <FaArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="select-carousel-nav select-carousel-nav-next" 
            onClick={nextSlide}
            disabled={isAnimating}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="select-carousel-indicators">
          {games.map((_, index) => (
            <button
              key={index}
              className={`select-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
            />
          ))}
        </div>

        <div className="select-carousel-footer">
          <div className="select-carousel-footer-content">
            <FaSeedling />
            <span>Garden of Memories</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameSelectPage;