import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelectPage.css';

function GameSelectPage() {
  const navigate = useNavigate();

  const games = [
    {
      id: 'memory-puzzle',
      title: '추억의 퍼즐',
      description: '흩어진 기억의 조각들을 맞춰보세요',
      difficulty: '쉬움',
      duration: '15분',
      players: '1명',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'time-traveler',
      title: '시간 여행자',
      description: '과거와 현재를 오가며 이야기를 완성하세요',
      difficulty: '보통',
      duration: '30분',
      players: '1-2명',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1L10 19" stroke="#171412" strokeWidth="1.5"/>
          <path d="M10 1L10 19" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 4.94L3.94 4.94" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 15.64L14.64 15.64" stroke="#171412" strokeWidth="1.5"/>
          <path d="M1 10L19 10" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 13.64L3.94 13.64" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 2.94L14.64 2.94" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'memory-maze',
      title: '기억의 미로',
      description: '잃어버린 기억을 찾아 미로를 탐험하세요',
      difficulty: '어려움',
      duration: '45분',
      players: '1명',
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
      duration: '무제한',
      players: '1명',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    }
  ];

  const handleGameSelect = (gameId) => {
    // 게임별로 다른 경로로 이동
    switch (gameId) {
      case 'memory-puzzle':
        navigate('/game');
        break;
      case 'time-traveler':
        navigate('/game');
        break;
      case 'memory-maze':
        navigate('/game');
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
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="logo-text">Garden of Memory</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Games</a>
          <a href="#" className="nav-link">About Us</a>
          <a href="#" className="nav-link">Contact</a>
          <button className="sign-in-btn">Sign In</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h2 className="hero-title">기억의 정원</h2>
          <p className="hero-subtitle">게임을 선택하세요</p>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-card-header">
                <div className="game-icon">
                  {game.icon}
                </div>
                <div className="difficulty-badge">
                  {game.difficulty}
                </div>
              </div>
              
              <div className="game-content">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{game.description}</p>
                
                <div className="game-meta">
                  <div className="meta-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1.5 1.5L16.5 16.5" stroke="#171412" strokeWidth="1.5" opacity="0.6"/>
                      <path d="M9 4.5L9 13.5" stroke="#171412" strokeWidth="1.5" opacity="0.6"/>
                    </svg>
                    <span>{game.duration}</span>
                  </div>
                  <div className="meta-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M6 3L6 11" stroke="#171412" strokeWidth="1.5" opacity="0.6"/>
                      <path d="M3 11L9 11" stroke="#171412" strokeWidth="1.5" opacity="0.6"/>
                    </svg>
                    <span>{game.players}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="game-start-btn"
                onClick={() => handleGameSelect(game.id)}
              >
                게임 시작
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="back-to-home">
          <button className="back-btn" onClick={handleBackToHome}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
            </svg>
            <span>Garden of Memory</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default GameSelectPage; 