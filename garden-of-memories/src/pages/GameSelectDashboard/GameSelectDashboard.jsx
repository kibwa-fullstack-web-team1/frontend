<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, getAuthToken } from '../../services/api';
>>>>>>> origin/main
import FamilyHeader from '../../components/FamilyHeader';
import './GameSelectDashboard.css';

function GameSelectDashboard() {
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const [currentUser, setCurrentUser] = useState(null);
  const [showFamilyConnect, setShowFamilyConnect] = useState(false);
  const [connectCode, setConnectCode] = useState('');
  const [connectionResult, setConnectionResult] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // 현재 사용자 정보 확인
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      console.log('GameSelectDashboard - 현재 사용자 정보:', user);
      console.log('GameSelectDashboard - 사용자 역할:', user?.role);
      setCurrentUser(user);
    } else {
      console.log('GameSelectDashboard - 로그인되지 않음');
    }
  }, []);

  const handleFamilyConnect = () => {
    setShowFamilyConnect(true);
  };

  const handleCloseFamilyConnect = () => {
    setShowFamilyConnect(false);
    setConnectCode('');
    setConnectionResult(null);
  };

  const handleConnectCodeChange = (e) => {
    setConnectCode(e.target.value);
  };

  const connectWithFamily = async () => {
    if (!connectCode.trim()) {
      alert('초대코드를 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const requestBody = { 
        code: connectCode.trim()
      };
      
      console.log('가족 연결 요청 데이터:', requestBody);
      console.log('Authorization 헤더:', `Bearer ${authToken}`);

      const response = await fetch('http://localhost:8000/family/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('가족 연결 응답:', response.status, data);
      
      if (response.ok && data.success) {
        setConnectionResult({
          success: true,
          message: '가족과 성공적으로 연결되었습니다!',
          senior_name: data.senior_name || '시니어'
        });
      } else {
        // 422 에러나 기타 에러 처리
        let errorMessage = '가족 연결에 실패했습니다.';
        
        if (response.status === 422) {
          // 검증 에러 처리
          console.log('422 검증 에러 상세:', data.detail);
          if (data.detail && Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => err.msg).join(', ');
          } else if (data.detail && typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (data.detail && typeof data.detail === 'object') {
            errorMessage = '입력 데이터가 올바르지 않습니다.';
          }
        } else if (data.detail && typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        
        console.log('최종 에러 메시지:', errorMessage);
        setConnectionResult({
          success: false,
          message: errorMessage
        });
      }
    } catch (error) {
      console.error('가족 연결 오류:', error);
      setConnectionResult({
        success: false,
        message: '연결 중 오류가 발생했습니다.'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const resetConnection = () => {
    setConnectCode('');
    setConnectionResult(null);
  };
>>>>>>> origin/main

  const games = [
    {
      id: 'memory-flip-card',
      title: '추억카드맞추기',
      description: '가족 사진을 활용한 기억력 향상 게임입니다. 같은 사진을 찾아 맞춰보세요.',
      difficulty: '쉬움',
      difficultyColor: '#22C55E',
      iconColor: 'rgba(34, 197, 94, 0.13)',
      duration: '10-15분',
      recentScore: '85점',
      lastPlayed: '1월 15일',
      effects: ['시각적 기억력 향상', '집중력 강화', '가족 추억 회상'],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 2H20V22H4V2Z" stroke="#000000" strokeWidth="2"/>
          <path d="M8 6H16" stroke="#000000" strokeWidth="2"/>
          <path d="M8 10H16" stroke="#000000" strokeWidth="2"/>
          <path d="M8 14H12" stroke="#000000" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'story-sequence',
      title: '이야기 맞추기',
      description: '과거의 경험과 이야기를 순서대로 맞춰보는 게임입니다.',
      difficulty: '보통',
      difficultyColor: '#F59E0B',
      iconColor: 'rgba(245, 158, 11, 0.13)',
      duration: '15-20분',
      recentScore: '72점',
      lastPlayed: '1월 14일',
      effects: ['순서 기억력 향상', '언어 능력 강화', '스토리텔링 능력'],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="#000000" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'daily-question',
      title: '오늘의 질문',
      description: '매일 새로운 질문에 답하며 기억을 되돌아보는 시간입니다.',
      difficulty: '쉬움',
      difficultyColor: '#22C55E',
      iconColor: 'rgba(99, 102, 241, 0.13)',
      duration: '5-10분',
      recentScore: '95점',
      lastPlayed: '1월 16일',
      effects: ['자기 표현력 향상', '감정 인식 능력', '일상 기억 정리'],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z" stroke="#000000" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  const stats = [
    { value: '12', label: '완료한 게임' },
    { value: '84', label: '평균 점수' },
    { value: '45', label: '총 플레이 시간(분)' }
  ];

  const handleGameSelect = (gameId) => {
    switch (gameId) {
      case 'memory-flip-card':
        navigate('/card-game-dashboard');
        break;
      case 'story-sequence':
        navigate('/story-game-dashboard');
        break;
      case 'daily-question':
        navigate('/daily-question-dashboard');
        break;
      default:
        navigate('/game');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="game-select-dashboard">
      <FamilyHeader 
        onBackClick={handleBackToHome}
      />

      <main className="dashboard-select-main-content">
        {/* Hero Section */}
        <div className="dashboard-select-hero">
          <h2 className="dashboard-select-hero-title">활동 발자취</h2>
          <p className="dashboard-select-hero-description">
          어르신의 게임 참여 현황과 성과를 확인해보세요
          </p>
        </div>

<<<<<<< HEAD
=======
        {/* 가족 연결 안내 */}
        {isAuthenticated() && currentUser?.role === 'guardian' && (
          <div className="dashboard-select-family-connect-info">
            <div className="dashboard-select-family-connect-content">
              <h3>가족과 함께하는 게임</h3>
              <p>가족과 함께 게임을 즐기고 결과를 공유해보세요!</p>
              <p style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
                디버그: 현재 사용자 역할 = {currentUser?.role || 'undefined'}
              </p>
              <button className="dashboard-select-family-connect-btn" onClick={handleFamilyConnect}>
                가족 연결하기 (보호자)
              </button>
            </div>
          </div>
        )}

>>>>>>> origin/main
        {/* Games Grid */}
        <div className="dashboard-select-games-grid">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="dashboard-select-game-card"
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="dashboard-select-game-header">
                <div 
                  className="dashboard-select-game-icon"
                  style={{ backgroundColor: game.iconColor }}
                >
                  {game.icon}
                </div>
                <div 
                  className="dashboard-select-difficulty-badge"
                  style={{ backgroundColor: game.difficultyColor }}
                >
                  {game.difficulty}
                </div>
              </div>
              
              <div className="dashboard-select-game-content">
                <h3 className="dashboard-select-game-title">{game.title}</h3>
                <p className="dashboard-select-game-description">{game.description}</p>
                
                <div className="dashboard-select-game-meta">
                  <span className="dashboard-select-meta-item">소요시간: {game.duration}</span>
                  <span className="dashboard-select-meta-item">최근 점수: {game.recentScore}</span>
                </div>
                
                <div className="dashboard-select-game-effects">
                  <h4 className="dashboard-select-effects-title">기대 효과</h4>
                  <ul className="dashboard-select-effects-list">
                    {game.effects.map((effect, index) => (
                      <li key={index} className="dashboard-select-effect-item">
                        <div className="dashboard-select-effect-dot"></div>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="dashboard-select-game-footer">
                  <div className="dashboard-select-last-played">
                    <span>마지막 플레이:</span>
                    <span>{game.lastPlayed}</span>
                  </div>
                  <button 
                    className="dashboard-select-play-button"
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleGameSelect(game.id);
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5V19L19 12L8 5Z" fill="#171412"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="dashboard-select-stats-section">
          <h3 className="dashboard-select-stats-title">이번 주 활동 통계</h3>
          <div className="dashboard-select-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="dashboard-select-stat-item">
                <div className="dashboard-select-stat-value">{stat.value}</div>
                <div className="dashboard-select-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
<<<<<<< HEAD
=======

      {/* 가족 연결 모달 */}
      {showFamilyConnect && (
        <div className="dashboard-select-family-connect-modal">
          <div className="dashboard-select-family-connect-modal-content">
            <div className="dashboard-select-family-connect-modal-header">
              <h3>가족 연결하기</h3>
              <button className="dashboard-select-family-connect-modal-close" onClick={handleCloseFamilyConnect}>
                ✕
              </button>
            </div>
            <div className="dashboard-select-family-connect-modal-body">
              <div className="dashboard-select-family-connect-code-input-section">
                <label htmlFor="connectCode">초대코드 입력:</label>
                <input
                  type="text"
                  id="connectCode"
                  value={connectCode}
                  onChange={handleConnectCodeChange}
                  placeholder="초대코드를 입력하세요"
                />
                <button 
                  className="dashboard-select-family-connect-connect-btn" 
                  onClick={connectWithFamily}
                  disabled={isConnecting}
                >
                  {isConnecting ? '연결 중...' : '가족 연결하기'}
                </button>
              </div>
              {connectionResult && (
                <div className={`dashboard-select-family-connect-result ${connectionResult.success ? 'success' : 'error'}`}>
                  {typeof connectionResult.message === 'string' ? connectionResult.message : '알 수 없는 오류가 발생했습니다.'}
                  {connectionResult.success && connectionResult.senior_name && (
                    <p>시니어: {connectionResult.senior_name}</p>
                  )}
                </div>
              )}
              {connectionResult && (
                <button className="dashboard-select-family-connect-reset-btn" onClick={resetConnection}>
                  다시 입력
                </button>
              )}
            </div>
            <div className="dashboard-select-family-connect-modal-footer">
              <button className="dashboard-select-family-connect-modal-btn" onClick={handleCloseFamilyConnect}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
>>>>>>> origin/main
    </div>
  );
}

export default GameSelectDashboard;
