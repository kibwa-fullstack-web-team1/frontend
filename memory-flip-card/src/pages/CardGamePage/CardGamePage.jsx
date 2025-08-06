// src/pages/CardGamePage/CardGamePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardGame } from '../../hooks/useCardGame';
import Card from '../../components/Card';
import ResultPopup from '../../components/ResultPopup';
import ElderlyHeader from '../../components/ElderlyHeader';
import './CardGamePage.css';

function CardGamePage() {
  const navigate = useNavigate();
  // 임시로 user2 사용 (실제로는 로그인한 사용자 정보 사용)
  const userId = "user2";
  const {
    cards,
    turns,
    choiceOne,
    choiceTwo,
    disabled,
    showResultPopup,
    isWrongMatch,
    elapsedTime,
    gameStarted,
    difficulty,
    imageWarning,
    setImageWarning,
    shuffleCards,
    handleChoice,
    handleDifficultySelect,
    handlePlayAgain,
    resetGame,
  } = useCardGame(userId);

  const handleGoHome = () => {
    navigate('/');
  };

  // 뒤로가기 처리 (난이도 선택으로 돌아가기 또는 홈으로)
  const handleBackClick = () => {
    if (difficulty && !gameStarted && cards.length === 0) {
      // 난이도 선택 후 게임 시작 전 상태면 난이도 선택으로 돌아가기
      resetGame();
    } else if (gameStarted || cards.length > 0) {
      // 게임 중이거나 카드가 있는 상태면 게임을 중단하고 난이도 선택으로
      resetGame();
    } else {
      // 그 외의 경우 홈으로 이동
      navigate('/');
    }
  };

  return (
    <div className="App">
      <ElderlyHeader 
        onBackClick={handleGoHome}
      />
      
      <div className="main-container">
        <div className="game-card">
          {/* 뒤로가기 버튼 - 난이도 선택 후, 게임 시작 전에만 표시 */}
          {difficulty && !gameStarted && cards.length === 0 && (
            <button className="back-to-difficulty" onClick={resetGame}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>뒤로 가기</span>
            </button>
          )}
          
          <h1>추억 카드 짝 맞추기</h1>

          {/* 게임 정보 섹션 */}
          <div className="game-info">
            <div className="info-item">
              <div className="info-label">점수</div>
              <div className="info-value">{Math.floor(cards.filter(card => card.matched).length / 2)}점</div>
            </div>
            <div className="info-item">
              <div className="info-label">이동 횟수</div>
              <div className="info-value">{turns}회</div>
            </div>
            <div className="info-item">
              <div className="info-label">시간</div>
              <div className="info-value">{Math.floor(elapsedTime / 60)}분 {elapsedTime % 60}초</div>
            </div>
          </div>

          {/* 난이도 선택 */}
          {!gameStarted && !difficulty && (
            <div className="difficulty-buttons">
              <p>난이도를 선택하세요:</p>
              <button onClick={() => handleDifficultySelect("easy")}>쉬움 (8장)</button>
              <button onClick={() => handleDifficultySelect("medium")}>보통 (12장)</button>
              <button onClick={() => handleDifficultySelect("hard")}>어려움 (16장)</button>
            </div>
          )}

          {/* 게임 시작 버튼 */}
          {!gameStarted && difficulty && !showResultPopup && cards.length === 0 && (
            <button className="start-button" onClick={shuffleCards}>
              카드 게임 시작
            </button>
          )}

          {/* 게임 완료 후 처음으로 돌아가기 버튼 */}
          {showResultPopup && (
            <button className="start-button" onClick={resetGame}>
              카드게임 처음으로
            </button>
          )}

          {/* 게임 설명 */}
          {!gameStarted && !difficulty && (
            <div className="game-description">
              <h2>게임을 시작해보세요!</h2>
              <p>같은 그림의 카드 두 장을 찾아 맞춰보세요</p>
            </div>
          )}

          {/* 게임 방법 */}
          {!gameStarted && !difficulty && (
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>• 카드를 클릭하여 뒤집어보세요</li>
                <li>• 같은 그림의 카드 두 장을 찾으면 점수를 얻습니다</li>
                <li>• 모든 카드를 맞추면 게임이 완료됩니다</li>
                <li>• 최대한 적은 이동 횟수로 완료해보세요</li>
              </ul>
            </div>
          )}

          {/* 카드 그리드 */}
          {cards.length > 0 && (
            <div className="card-grid">
              {cards.map(card => (
                <Card
                  key={card.id}
                  card={card}
                  handleChoice={handleChoice}
                  flipped={card === choiceOne || card === choiceTwo || card.matched || !gameStarted}
                  disabled={disabled}
                  isWrongMatch={isWrongMatch && (card === choiceOne || card === choiceTwo)}
                />
              ))}
            </div>
          )}

          {/* 이미지 부족 경고 */}
          {imageWarning && (
            <div className="popup warning">
              <p>이미지 장수가 부족합니다. 사진을 더 업로드해주세요.</p>
              <button onClick={() => setImageWarning(false)}>확인</button>
            </div>
          )}

          {/* 결과 팝업 */}
          <ResultPopup
            show={showResultPopup}
            turns={turns}
            elapsedTime={elapsedTime}
            onPlayAgain={handlePlayAgain}
            onResetGame={resetGame}
          />
        </div>
      </div>
    </div>
  );
}

export default CardGamePage;