import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ElderlyHeader from '../../components/ElderlyHeader';

import './StorySequence.css';

// API 기본 URL 변수 - 환경변수에서 가져오기
const STORY_GAME_BASE_URL = '/story-sequencer-api';

function StorySequence() {
  const navigate = useNavigate();
  // 게임 데이터 상태
  const [gameData, setGameData] = useState({
    // WORD_SEQUENCE용
    segment: '',
    words: [],
    shuffled: [],
    segmentId: null,
    storyId: null,
    // SENTENCE_SEQUENCE용
    segments: [],
    totalSegments: 0,
    // 공통
    gameMode: 'sentence'
  });
  const [currentOrder, setCurrentOrder] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('단어를 드래그하여 올바른 순서로 배치해 보세요!');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameMode, setGameMode] = useState('sentence'); // 'word' 또는 'sentence'

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

  // 게임 시작 시 난이도 정보를 가져오고 게임 유형 결정
  const difficultyFetchedRef = useRef(false);
  
  useEffect(() => {
    const fetchDifficultyInfo = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;

        const response = await fetch(`${STORY_GAME_BASE_URL}/api/v0/difficulty/recommendation`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('현재 난이도 정보:', data);
          
          // 추천된 게임 유형에 따라 게임 모드 설정
          if (data.results && data.results.recommended_game_type) {
            const recommendedType = data.results.recommended_game_type;
            console.log('추천된 게임 유형:', recommendedType);
            
            // 게임 유형에 따라 UI 모드 설정
            if (recommendedType === 'WORD_SEQUENCE') {
              // 단어 순서 맞추기 모드
              setGameMode('word');
            } else {
              // 문장 순서 맞추기 모드 (기본값)
              setGameMode('sentence');
            }
          }
        }
      } catch (error) {
        console.error('난이도 정보 조회 실패:', error);
        // 기본값으로 문장 순서 맞추기 설정
        setGameMode('sentence');
      }
    };

    // 이미 실행되었는지 확인 (useRef 사용)
    if (!difficultyFetchedRef.current) {
      difficultyFetchedRef.current = true;
      fetchDifficultyInfo();
    }
  }, []);

  // 게임 초기화 함수
  const gameInitializedRef = useRef(false);
  
  const initializeGame = async () => {
    // 이미 초기화되었는지 확인
    if (gameInitializedRef.current) {
      console.log('게임이 이미 초기화되었습니다.');
      return;
    }
    
    try {
      gameInitializedRef.current = true;
      setIsLoading(true);
      setError(null);
      
      // 실제 JWT 토큰 가져오기
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // 게임 모드에 따라 다른 API 엔드포인트 사용
      let apiEndpoint;
      if (gameMode === 'word') {
        // WORD_SEQUENCE: 단어 단위로 나누어진 데이터
        // 먼저 랜덤 스토리를 가져온 후 단어 단위로 분리
        apiEndpoint = `${STORY_GAME_BASE_URL}/api/v0/stories/segments/random`;
      } else {
        // SENTENCE_SEQUENCE: 문장 단위로 나누어진 데이터
        apiEndpoint = `${STORY_GAME_BASE_URL}/api/v0/stories/segments/sentence/random`;
      }
      
      // 실제 story-sequencer API 호출
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
    
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('API 응답:', data);
      
      if (!data.results) {
        throw new Error('유효한 데이터를 받지 못했습니다.');
      }

      if (gameMode === 'word') {
        // WORD_SEQUENCE: 단어 단위로 나누어진 데이터
        if (!data.results.segment_text) {
          throw new Error('유효한 세그먼트 데이터를 받지 못했습니다.');
        }

        const segment = data.results;
        // 단어 단위로 분리 (띄어쓰기 기준)
        const words = segment.segment_text.split(/\s+/).filter(word => word.length > 0);
        const shuffledWords = shuffleArray([...words]);
        
        setGameData(prev => ({
          ...prev,
          segment: segment.segment_text,
          words: words,
          shuffled: shuffledWords,
          segmentId: segment.id,
          storyId: segment.story_id,
          totalSegments: words.length,
          gameMode: 'word'
        }));
        
        setCurrentOrder(Array(words.length).fill(null));
      } else {
        // SENTENCE_SEQUENCE: 문장 단위로 나누어진 데이터
        if (!data.results.segments || !Array.isArray(data.results.segments)) {
          throw new Error('유효한 문장 세그먼트 데이터를 받지 못했습니다.');
        }

        const segments = data.results.segments;
        const shuffledSegments = shuffleArray([...segments]);
        
        setGameData(prev => ({
          ...prev,
          segments: segments,
          shuffled: shuffledSegments,
          storyId: data.results.story_id,
          totalSegments: data.results.total_segments,
          gameMode: 'sentence'
        }));
        
        setCurrentOrder(Array(segments.length).fill(null));
      }
      
      setStartTime(Date.now());
      setElapsedTime(0);
      setAttempts(0);
      
      // 게임 모드에 따라 다른 메시지 설정
      if (gameMode === 'word') {
        setFeedbackMessage('단어를 드래그하여 올바른 순서로 배치해 보세요!');
      } else {
        setFeedbackMessage('문장을 드래그하여 올바른 순서로 배치해 보세요!');
      }
      
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
    
    if (gameMode === 'word') {
      const word = gameData.shuffled[wordIndex];
      
      // 이미 배치된 단어 제거
      const newOrder = [...currentOrder];
      const prevPosition = newOrder.indexOf(word);
      if (prevPosition !== -1) {
        newOrder[prevPosition] = null;
      }
      
      // 새 위치에 단어 배치 (문자열로 저장)
      newOrder[position] = word;
      setCurrentOrder(newOrder);
      
      // 진행률 업데이트
      updateProgress(newOrder);
    } else {
      const segment = gameData.shuffled[wordIndex];
      
      // 이미 배치된 문장 제거
      const newOrder = [...currentOrder];
      const prevPosition = newOrder.indexOf(segment.segment_text);
      if (prevPosition !== -1) {
        newOrder[prevPosition] = null;
      }
      
      // 새 위치에 문장 배치
      newOrder[position] = segment.segment_text;
      setCurrentOrder(newOrder);
      
      // 진행률 업데이트
      updateProgress(newOrder);
    }
  };

  // 진행률 업데이트
  const updateProgress = (order) => {
    const filled = order.filter(item => item !== null).length;
    
    if (gameMode === 'word') {
      const total = gameData.totalSegments || 0;
      if (total === 0) return;
      
      if (filled === total) {
        setFeedbackMessage('모든 단어를 배치했습니다! 순서를 확인해보세요.');
      } else {
        setFeedbackMessage(`${filled}/${total} 단어 배치됨`);
      }
    } else {
      const total = gameData.totalSegments || 0;
      if (total === 0) return;
      
      if (filled === total) {
        setFeedbackMessage('모든 문장을 배치했습니다! 순서를 확인해보세요.');
      } else {
        setFeedbackMessage(`${filled}/${total} 문장 배치됨`);
      }
    }
  };

  // 순서 확인
  const handleCheckOrder = async () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let isCorrect = false;
    
    if (gameMode === 'word') {
      // WORD_SEQUENCE: 원본 단어 순서와 비교
      const correctOrder = gameData.words || [];
      isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    } else {
      // SENTENCE_SEQUENCE: segments의 segment_text 순서와 비교
      const correctOrder = gameData.segments?.map(seg => seg.segment_text) || [];
      isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    }
    
    if (isCorrect) {
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

      // JWT 토큰 디버깅
      console.log('JWT 토큰 확인:', authToken.substring(0, 20) + '...');

      // JWT 토큰에서 사용자 ID 추출
      let actualUserId = 1; // 기본값
      
      try {
        // JWT 토큰 디코딩
        const tokenParts = authToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('JWT 페이로드:', payload);
          
          // JWT의 sub 필드에서 사용자 ID 추출
          actualUserId = parseInt(payload.sub) || 1;
          console.log('JWT에서 추출한 사용자 ID:', actualUserId);
        } else {
          console.warn('JWT 토큰 형식이 올바르지 않습니다.');
        }
      } catch (e) {
        console.warn('JWT 디코딩 실패:', e);
        
        // localStorage에서 사용자 정보 확인
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            actualUserId = parseInt(user.id) || 1;
            console.log('localStorage에서 추출한 사용자 ID:', actualUserId);
          } catch (parseError) {
            console.warn('localStorage 사용자 정보 파싱 실패:', parseError);
          }
        }
      }

      // 게임 모드에 따른 데이터 준비
      let gameResult;
      
      if (gameMode === 'word') {
        // WORD_SEQUENCE: 단어 단위 데이터
        gameResult = {
          game_type: 'WORD_SEQUENCE',
          story_id: parseInt(gameData.storyId) || 1,
          is_correct: Boolean(isCorrect),
          response_time: parseFloat(elapsedTime.toFixed(2)),
          score: isCorrect ? Math.floor((gameData.words?.length || 0) / elapsedTime * 100) : 0,
          user_id: parseInt(actualUserId) || 1
        };
      } else {
        // SENTENCE_SEQUENCE: 문장 단위 데이터
        gameResult = {
          game_type: 'SENTENCE_SEQUENCE',
          story_id: parseInt(gameData.storyId) || 1,
          is_correct: Boolean(isCorrect),
          response_time: parseFloat(elapsedTime.toFixed(2)),
          score: isCorrect ? Math.floor((gameData.totalSegments || 0) / elapsedTime * 100) : 0,
          user_id: parseInt(actualUserId) || 1
        };
      }

      // 데이터 검증
      if (!gameResult.story_id || gameResult.story_id < 1) {
        console.warn('유효하지 않은 story_id:', gameResult.story_id);
        gameResult.story_id = 1;
      }
      
      if (!gameResult.response_time || gameResult.response_time <= 0) {
        console.warn('유효하지 않은 response_time:', gameResult.response_time);
        gameResult.response_time = 1.0;
      }
      
      if (!gameResult.user_id || gameResult.user_id < 1) {
        console.warn('유효하지 않은 user_id:', gameResult.user_id);
        gameResult.user_id = 1;
      }

      console.log('게임 결과 저장 요청:', gameResult);

      // 게임 결과 저장 (난이도 조절 포함)
      const response = await fetch(`${STORY_GAME_BASE_URL}/api/v0/difficulty/submit-result-with-difficulty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(gameResult)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `게임 결과 저장 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log('게임 결과 저장 성공:', result);
      
      // 난이도 변화가 있다면 사용자에게 알림
      if (result.difficulty_info && result.difficulty_info.difficulty_changed) {
        console.log('난이도 변화:', result.difficulty_info.reason);
        // 여기서 사용자에게 난이도 변화를 알릴 수 있습니다
      }
      
    } catch (error) {
      console.error('게임 결과 저장 중 오류:', error);
      // 에러가 있어도 게임은 계속 진행
      console.warn('게임 결과 저장에 실패했지만 게임은 계속됩니다.');
    }
  };

  // 힌트 보기
  const handleShowHint = () => {
    if (gameMode === 'word') {
      const firstWord = gameData.words?.[0];
      setFeedbackMessage(`첫 단어는: ${firstWord}`);
    } else {
      const firstSegment = gameData.segments?.[0];
      setFeedbackMessage(`첫 문장은: ${firstSegment?.segment_text}`);
    }
  };

  // 게임 재시작
  const handleResetGame = () => {
    // 게임 초기화 상태 리셋
    gameInitializedRef.current = false;
    initializeGame();
  };

  // 다시 하기
  const handlePlayAgain = () => {
    setShowSuccessModal(false);
    // 게임 초기화 상태 리셋
    gameInitializedRef.current = false;
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
        <ElderlyHeader 
          title="이야기 순서 맞추기" 
          subtitle={gameMode === 'word' ? "단어를 올바른 순서로 배치해보세요" : "문장을 올바른 순서로 배치해보세요"}
          onBackClick={handleGoHome}
        />
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
        <ElderlyHeader 
          title="이야기 순서 맞추기" 
          subtitle={gameMode === 'word' ? "단어를 올바른 순서로 배치해보세요" : "문장을 올바른 순서로 배치해보세요"}
          onBackClick={handleGoHome}
        />
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
  if (!gameData || (!gameData.words?.length && !gameData.segments?.length)) {
    return (
      <div className="story-sequence-app">
        <ElderlyHeader 
          title="이야기 순서 맞추기" 
          subtitle="게임을 준비하고 있습니다..."
          onBackClick={handleGoHome}
        />
        <div className="story-sequence-main-container">
          <div className="story-sequence-loading">
            <div className="loading-spinner"></div>
            <p>게임 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const progressPercentage = (currentOrder.filter(item => item !== null).length / 
    (gameMode === 'word' ? (gameData.totalSegments || 1) : (gameData.totalSegments || 1))) * 100;

  return (
    <div className="story-sequence-app">
      <ElderlyHeader 
        title="이야기 순서 맞추기" 
        subtitle={gameMode === 'word' ? "단어를 올바른 순서로 배치해보세요" : "문장을 올바른 순서로 배치해보세요"}
      />
      
      <div className="story-sequence-main-container">
        <div className="story-sequence-card">
          <div className="story-sequence-layout">
            {/* 왼쪽 패널 - 전체 문장 */}
            <div className="story-sequence-panel story-sequence-panel--left">
              <div className="story-sequence-section">
                <h3 className="story-sequence-section-title">전체 이야기</h3>
                <div className="story-sequence-full-sentence">
                  {gameMode === 'word' ? gameData.segment : 
                    gameData.segments?.map(seg => seg.segment_text).join(' ')}
                </div>
              </div>
            </div>

            {/* 중앙 패널 - 게임 영역 */}
            <div className="story-sequence-panel story-sequence-panel--center">
              <div className="story-sequence-activity-area">
                {/* 섞인 요소들 */}
                <div className="story-sequence-section">
                  <h3 className="story-sequence-section-title">
                    {gameMode === 'word' ? "섞인 단어 조각들" : "섞인 문장 조각들"}
                  </h3>
                  <div className="story-sequence-word-fragments">
                    {(gameMode === 'word' ? gameData.shuffled : gameData.shuffled)?.map((item, index) => (
                      <div
                        key={index}
                        className={`story-sequence-word-fragment ${
                          currentOrder.includes(gameMode === 'word' ? item : item.segment_text) ? 'placed' : ''
                        }`}
                        draggable={!currentOrder.includes(gameMode === 'word' ? item : item.segment_text)}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        {gameMode === 'word' ? item : item.segment_text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 올바른 순서 */}
                <div className="story-sequence-section">
                  <h3 className="story-sequence-section-title">올바른 순서</h3>
                  <div className="story-sequence-word-sequence">
                    {Array.from({ length: gameMode === 'word' ? gameData.totalSegments : gameData.totalSegments }, (_, index) => (
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
                          <div className="story-sequence-placed-word">
                            {(() => {
                              const item = currentOrder[index];
                              if (gameMode === 'word') {
                                // WORD_SEQUENCE: 문자열만 표시
                                return typeof item === 'string' ? item : '';
                              } else {
                                // SENTENCE_SEQUENCE: 문자열 또는 객체의 segment_text
                                if (typeof item === 'string') {
                                  return item;
                                } else if (item && typeof item === 'object' && item.segment_text) {
                                  return item.segment_text;
                                }
                                return '';
                              }
                            })()}
                          </div>
                        ) : (
                          <span className="story-sequence-drop-zone-text">
                            {gameMode === 'word' ? "여기에 단어를 놓으세요" : "여기에 문장을 놓으세요"}
                          </span>
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
                    {currentOrder.filter(item => item !== null).length}/{gameMode === 'word' ? gameData.totalSegments : gameData.totalSegments} 
                    {gameMode === 'word' ? '단어' : '문장'} 배치됨
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
              <p>{gameMode === 'word' ? '단어 순서를 정확히 맞추셨습니다!' : '문장 순서를 정확히 맞추셨습니다!'}</p>
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
