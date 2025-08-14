// src/hooks/useCardGame.js
import { useState, useEffect, useRef } from 'react';
import { fetchCardImages, saveGameResult } from '../services/api';

const difficultyToCount = {
  easy: 8,
  medium: 12,
  hard: 16,
};

export const useCardGame = (userId) => {
  const [cardImages, setCardImages] = useState([]);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isWrongMatch, setIsWrongMatch] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [imageWarning, setImageWarning] = useState(false);
  const timerRef = useRef(null);

  // 1. 카드 이미지 불러오기
  useEffect(() => {
    const loadCardImages = async () => {
      const images = await fetchCardImages(userId);
      setCardImages(images);
    };
    loadCardImages();
  }, [userId]);

  // 2. 두 카드 비교 로직
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prev =>
          prev.map(card =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setIsWrongMatch(true);
        setTimeout(() => {
          setIsWrongMatch(false);
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // 3. 게임 완료 조건 확인
  useEffect(() => {
    const checkGameCompletion = async () => {
      if (cards.length > 0 && cards.every(card => card.matched)) {
        clearInterval(timerRef.current);
        setTimeout(() => setShowResultPopup(true), 500);
        setGameStarted(false);
        
        try {
          const result = await saveGameResult({
            user_id: userId,
            score: cards.length / 2,
            attempts: turns,
            matches: cards.length / 2,
            duration_seconds: elapsedTime,
            difficulty: difficulty,
          });
          
          if (result.success) {
            console.log('게임 결과 저장 성공:', result.message);
          }
        } catch (error) {
          console.error('게임 결과 저장 실패:', error);
        }
      }
    };

    checkGameCompletion();
  }, [cards, userId, turns, elapsedTime, difficulty]);

  // 턴 초기화
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prev => prev + 1);
    setDisabled(false);
    setIsWrongMatch(false);
  };

  // 카드 셔플 및 게임 시작
  const shuffleCards = () => {
    if (!difficulty) {
      console.warn("난이도가 선택되지 않았습니다.");
      return;
    }

    const count = difficultyToCount[difficulty];
    const requiredPhotos = count / 2;

    if (cardImages.length < requiredPhotos) {
      setImageWarning(true);
      return;
    }

    const selectedImages = cardImages.slice(0, requiredPhotos);
    const shuffled = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffled);
    setTurns(0);
    setElapsedTime(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setShowResultPopup(false);
    setDisabled(true);
    setGameStarted(false);

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      setDisabled(false);
      setGameStarted(true);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }, 3000);
  };

  // 카드 선택 처리
  const handleChoice = (card) => {
    if (!disabled && gameStarted) {
      if (card.id === choiceOne?.id) return;
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  // 난이도 선택
  const handleDifficultySelect = (level) => {
    setDifficulty(level);
  };

  // 게임 재시작 (같은 난이도)
  const handlePlayAgain = () => {
    setShowResultPopup(false);
    shuffleCards();
  };

  // 게임 전체 초기화 (난이도 선택으로)
  const resetGame = () => {
    setShowResultPopup(false);
    setGameStarted(false);
    setDifficulty(null);
    setCards([]);
    setTurns(0);
    setElapsedTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return {
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
  };
};
