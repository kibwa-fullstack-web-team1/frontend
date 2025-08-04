// src/pages/CardGamePage/CardGamePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame';
import Card from '../../components/Card';
import ResultPopup from '../../components/ResultPopup';
import './CardGamePage.css';

function CardGamePage() {
  const navigate = useNavigate();
  const userId = "user3"; // 이 부분은 추후 인증 시스템에서 가져올 수 있습니다.
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
  } = useGame(userId);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <div className="game-header">
        <button className="home-button" onClick={handleGoHome}>
          ← 홈으로
        </button>
      </div>
      
      <h1>추억 카드 짝 맞추기</h1>

      {/* 난이도 선택 */}
      {!gameStarted && !difficulty && (
        <div className="difficulty-buttons">
          <p>난이도를 선택하세요:</p>
          <button onClick={() => handleDifficultySelect("easy")}>쉬움 (8장)</button>
          <button onClick={() => handleDifficultySelect("medium")}>보통 (12장)</button>
          <button onClick={() => handleDifficultySelect("hard")}>어려움 (16장)</button>
        </div>
      )}

      {/* 이미지 부족 경고 */}
      {imageWarning && (
        <div className="popup warning">
          <p>이미지 장수가 부족합니다. 사진을 더 업로드해주세요.</p>
          <button onClick={() => setImageWarning(false)}>확인</button>
        </div>
      )}

      {/* 새 게임 시작 버튼 */}
      {!gameStarted && difficulty && !showResultPopup && cards.length === 0 && (
        <button className="start-button" onClick={shuffleCards}>
          새 게임 시작
        </button>
      )}

      {/* 게임 완료 후 처음으로 돌아가기 버튼 */}
      {showResultPopup && (
        <button className="start-button" onClick={resetGame}>
          처음으로
        </button>
      )}

      {/* 카드 그리드 */}
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

      {/* 게임 정보 */}
      <p>턴 수: {turns} | 경과 시간: {elapsedTime}초</p>

      {/* 결과 팝업 */}
      <ResultPopup
        show={showResultPopup}
        turns={turns}
        elapsedTime={elapsedTime}
        onPlayAgain={handlePlayAgain}
        onResetGame={resetGame}
      />
    </div>
  );
}

export default CardGamePage;