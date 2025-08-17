import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './StorySequence.css';

// API 기본 URL 변수
const STORY_GAME_BASE_URL = 'http://13.251.163.144:8011';

function StorySequence() {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('단어를 드래그하여 올바른 순서로 배치해 보세요!');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시로 user2 사용 (실제로는 로그인한 사용자 정보 사용)
  const userId = 'user2';

  // 게임 초기화
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // 타이머 업데이트
  useEffect(() => {
    if (startTime && !showSuccessModal) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [startTime, showSuccessModal]);

  // 게임 초기화 함수
  const initializeGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 실제 JWT 토큰 가져오기
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // 실제 story-sequencer API 호출
      const response = await fetch(`${STORY_GAME_BASE_URL}/api/v0/stories/segments/random`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
    
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
    
      const data = await response.json();      console.log('API 응답:', data);
      
      if (!data.results || !data.results.segment_text) {
        throw new Error('유효한 세그먼트 데이터를 받지 못했습니다.');
      }

      const segment = data.results;
      const words = segment.segment_text.split(/\s+/).filter(word => word.length > 0);
      const shuffledWords = shuffleArray([...words]);
      
      setGameData({
        segment: segment.segment_text,
        words: words,
        shuffled: shuffledWords,
        segmentId: segment.id,
        storyId: segment.story_id
      });
      
      setCurrentOrder(Array(words.length).fill(null));
      setStartTime(Date.now());
      setElapsedTime(0);
      setAttempts(0);
      setFeedbackMessage('단어를 드래그하여 올바른 순서로 배치해 보세요!');
      setShowSuccessModal(false);
      
    } catch (err) {
      console.error('Game initialization error:', err);
      
      // API 호출 실패 시 임시 데이터로 폴백 (개발용)
      if (process.env.NODE_ENV === 'development') {
        console.warn('API 호출 실패, 임시 데이터 사용:', err.message);
        const mockSegment = {
          id: 1,
          segment_text: "어린 시절 할머니와 함께 정원에서 꽃을 심었던 추억이 아직도 생생합니다"
        };
        
        const words = mockSegment.segment_text.split(/\s+/).filter(word => word.length > 0);
        const shuffledWords = shuffleArray([...words]);
        
        setGameData({
          segment: mockSegment.segment_text,
          words: words,
          shuffled: shuffledWords,
          segmentId: mockSegment.id,
          storyId: 1
        });
        
        setCurrentOrder(Array(words.length).fill(null));
        setStartTime(Date.now());
        setElapsedTime(0);
        setAttempts(0);
        setFeedbackMessage('단어를 드래그하여 올바른 순서로 배치해 보세요! (임시 데이터)');
        setShowSuccessModal(false);
      } else {
        setError(`게임을 초기화하는 중 오류가 발생했습니다: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 배열 섞기 함수
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 드래그 시작
  const handleDragStart = (e, wordIndex) => {
    e.dataTransfer.setData('text/plain', wordIndex);
    e.target.classList.add('dragging');
  };

  // 드래그 종료
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  // 드래그 오버
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  // 드래그 리브
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // 드롭
  const handleDrop = (e, position) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const wordIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const word = gameData.shuffled[wordIndex];
    
    // 이미 배치된 단어 제거
    const newOrder = [...currentOrder];
    const prevPosition = newOrder.indexOf(word);
    if (prevPosition !== -1) {
      newOrder[prevPosition] = null;
    }
    
    // 새 위치에 단어 배치
    newOrder[position] = word;
    setCurrentOrder(newOrder);
    
    // 진행률 업데이트
    updateProgress(newOrder);
  };

  // 진행률 업데이트
  const updateProgress = (order) => {
    const filled = order.filter(word => word !== null).length;
    const total = gameData.words.length;
    
    if (filled === total) {
      setFeedbackMessage('모든 단어를 배치했습니다! 순서를 확인해보세요.');
    } else {
      setFeedbackMessage(`${filled}/${total} 단어 배치됨`);
    }
  };

  // 순서 확인
  const handleCheckOrder = async () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (JSON.stringify(currentOrder) === JSON.stringify(gameData.words)) {
      setFeedbackMessage('정답입니다! 🎉');
      setShowSuccessModal(true);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // 게임 결과 저장
      try {
        await saveGameResult(true);
      } catch (error) {
        console.error('게임 결과 저장 실패:', error);
        // 결과 저장 실패는 게임 완료에 영향을 주지 않음
      }
    } else {
      setFeedbackMessage('순서가 올바르지 않습니다. 다시 시도해보세요.');
      
      // 틀린 답도 저장 (학습 데이터로 활용)
      try {
        await saveGameResult(false);
      } catch (error) {
        console.error('게임 결과 저장 실패:', error);
      }
    }
  };

  // 게임 결과 저장
  const saveGameResult = async (isCorrect) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn('JWT 토큰이 없어 게임 결과를 저장할 수 없습니다.');
        return;
      }

      const gameResult = {
        game_type: 'word_sequence',
        story_id: gameData.storyId || 1,
        is_correct: isCorrect,
        response_time: elapsedTime,
        score: isCorrect ? Math.floor((gameData.words.length / elapsedTime) * 100) : 0,
        user_id: parseInt(userId.replace('user', '')) || 1
      };

      const response = await fetch(`${STORY_GAME_BASE_URL}/api/v0/game-results/submit-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(gameResult)
      });

      if (!response.ok) {
        throw new Error(`게임 결과 저장 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log('게임 결과 저장 성공:', result);
      
    } catch (error) {
      console.error('게임 결과 저장 중 오류:', error);
      // 개발 환경에서는 에러를 무시하고 계속 진행
      if (process.env.NODE_ENV !== 'development') {
        throw error;
      }
    }
  };

  // 힌트 보기
  const handleShowHint = () => {
    const firstWord = gameData.words[0];
    setFeedbackMessage(`첫 단어는: ${firstWord}`);
  };

  // 게임 재시작
  const handleResetGame = () => {
    initializeGame();
  };

  // 다시 하기
  const handlePlayAgain = () => {
    setShowSuccessModal(false);
    initializeGame();
  };

  // 홈으로 돌아가기
  const handleGoHome = () => {
    navigate('/');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="story-sequence-app">
  
        <div className="story-sequence-main-container">
          <div className="story-sequence-loading">
            <div className="loading-spinner"></div>
            <p>게임을 준비하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="story-sequence-app">
  
        <div className="story-sequence-main-container">
          <div className="story-sequence-error">
            <p>{error}</p>
            <button onClick={initializeGame} className="story-sequence-retry-btn">
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 게임 데이터가 없으면 초기화
  if (!gameData) {
    return null;
  }

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const progressPercentage = (currentOrder.filter(word => word !== null).length / gameData.words.length) * 100;

  return (
    <div className="story-sequence-app">

      
      <div className="story-sequence-main-container">
        <div className="story-sequence-card">
          <h1 className="story-sequence-title">이야기 순서 맞추기</h1>
          
          <div className="story-sequence-layout">
            {/* 왼쪽 패널 - 전체 문장 */}
            <div className="story-sequence-panel story-sequence-panel--left">
              <div className="story-sequence-section">
                <h3 className="story-sequence-section-title">전체 문장</h3>
                <div className="story-sequence-full-sentence">
                  {gameData.segment}
                </div>
              </div>
            </div>

            {/* 중앙 패널 - 게임 영역 */}
            <div className="story-sequence-panel story-sequence-panel--center">
              <div className="story-sequence-activity-area">
                {/* 섞인 단어들 */}
                <div className="story-sequence-section">
                  <h3 className="story-sequence-section-title">섞인 단어 조각들</h3>
                  <div className="story-sequence-word-fragments">
                    {gameData.shuffled.map((word, index) => (
                      <div
                        key={index}
                        className={`story-sequence-word-fragment ${
                          currentOrder.includes(word) ? 'placed' : ''
                        }`}
                        draggable={!currentOrder.includes(word)}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 올바른 순서 */}
                <div className="story-sequence-section">
                  <h3 className="story-sequence-section-title">올바른 순서</h3>
                  <div className="story-sequence-word-sequence">
                    {Array.from({ length: gameData.words.length }, (_, index) => (
                      <div
                        key={index}
                        className={`story-sequence-drop-zone ${
                          currentOrder[index] ? 'filled' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <span className="story-sequence-drop-zone-label">{index + 1}번</span>
                        {currentOrder[index] ? (
                          <div className="story-sequence-placed-word">{currentOrder[index]}</div>
                        ) : (
                          <span className="story-sequence-drop-zone-text">여기에 단어를 놓으세요</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="story-sequence-action-buttons">
                  <button 
                    className="story-sequence-btn story-sequence-btn--primary"
                    onClick={handleCheckOrder}
                  >
                    순서 확인하기
                  </button>
                  <button 
                    className="story-sequence-btn story-sequence-btn--secondary"
                    onClick={handleShowHint}
                  >
                    힌트 보기
                  </button>
                  <button 
                    className="story-sequence-btn story-sequence-btn--outline"
                    onClick={handleResetGame}
                  >
                    다시 시작
                  </button>
                </div>
              </div>
            </div>

            {/* 오른쪽 패널 - 진행 상황 */}
            <div className="story-sequence-panel story-sequence-panel--right">
              <div className="story-sequence-section">
                <h3 className="story-sequence-section-title">진행 상황</h3>
                
                {/* 진행률 바 */}
                <div className="story-sequence-progress-section">
                  <div className="story-sequence-progress-bar">
                    <div 
                      className="story-sequence-progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="story-sequence-progress-text">
                    {currentOrder.filter(word => word !== null).length}/{gameData.words.length} 단어 배치됨
                  </p>
                </div>

                {/* 피드백 메시지 */}
                <div className="story-sequence-feedback-section">
                  <div className="story-sequence-feedback-message">
                    {feedbackMessage}
                  </div>
                </div>

                {/* 타이머 */}
                <div className="story-sequence-timer-section">
                  <h4 className="story-sequence-timer-title">소요 시간</h4>
                  <div className="story-sequence-timer">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="story-sequence-modal">
          <div className="story-sequence-modal-content">
            <div className="story-sequence-modal-header">
              <h2>축하합니다! 🎉</h2>
            </div>
            <div className="story-sequence-modal-body">
              <p>단어 순서를 정확히 맞추셨습니다!</p>
              <div className="story-sequence-completion-stats">
                <p>소요 시간: <span>{formatTime(elapsedTime)}</span></p>
                <p>시도 횟수: <span>{attempts}</span>회</p>
              </div>
            </div>
            <div className="story-sequence-modal-footer">
              <button 
                className="story-sequence-btn story-sequence-btn--primary"
                onClick={handlePlayAgain}
              >
                다시 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StorySequence;
