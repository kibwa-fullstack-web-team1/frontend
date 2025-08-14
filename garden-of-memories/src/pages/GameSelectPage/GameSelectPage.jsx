import React from 'react';
import { useNavigate } from 'react-router-dom';

import './GameSelectPage.css';

function GameSelectPage() {
  const navigate = useNavigate();

  const games = [
    {
      id: 'memory-flip-card',
      title: '추억의 퍼즐 맞추기',
      description: '흩어진 기억의 조각들을 맞춰보세요',
      difficulty: '쉬움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'story-sequence',
      title: '시간 여행자',
      description: '과거와 현재를 오가며 이야기를 완성하세요',
      difficulty: '보통',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 7.5L12.5 12.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M10 1L10 19" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 4.94L5.36 6.36" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 15.64L16.06 17.06" stroke="#171412" strokeWidth="1.5"/>
          <path d="M1 10L19 10" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 13.64L5.36 15.06" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 2.94L16.06 4.36" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'memory-maze',
      title: '오늘의 질문',
      description: "오늘의 질문에 답하며 새로운 나를 발견하세요",
      difficulty: '어려움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'emotion-garden',
      title: '감정의 정원',
      description: '다양한 감정들을 키워 아름다운 정원을 만드세요',
      difficulty: '쉬움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
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

  return (
    <div className="game-select-page">
      

      <main className="select-main-content">
        <div className="select-hero-section">
          <h1 className="select-hero-title">기억의 정원</h1>
          <p className="select-hero-subtitle">게임을 선택하세요</p>
        </div>

        <div className="select-games-grid">
          {games.map((game) => (
            <div key={game.id} className="select-game-card" onClick={() => handleGameSelect(game.id)}>
              <div className="select-game-header">
                <div className="select-game-icon">
                  {game.icon}
                </div>
                <div className="select-game-difficulty">
                  {game.difficulty}
                </div>
              </div>
              
              <div className="select-game-content">
                <h3 className="select-game-title">{game.title}</h3>
                <p className="select-game-description">{game.description}</p>
              </div>
              
              <button className="select-game-start-btn">
                게임 시작
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="select-footer">
          <div className="select-footer-content">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" fill="#171412"/>
            </svg>
            <span>Garden of Memory</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameSelectPage; 