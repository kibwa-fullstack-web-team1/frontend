import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PersonalizationStack.css';

const PersonalizationStack = ({ cardsData, cardDimensions = { width: 150, height: 200 }, autoFlipInterval = 3000, onClick }) => {
  const [cards, setCards] = useState(cardsData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCards(cardsData); // Update cards if cardsData changes from parent
  }, [cardsData]);

  useEffect(() => {
    if (cards.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, autoFlipInterval);

    return () => clearInterval(interval);
  }, [cards, autoFlipInterval]);

  const handleCardClick = (card) => {
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <div className="personalization-stack-container">
      <AnimatePresence initial={false}>
        {cards.length > 0 && (
          <motion.div
            key={cards[currentIndex].id}
            className="personalization-stack-card"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: `url(${cards[currentIndex].imageUrl})`,
              width: cardDimensions.width,
              height: cardDimensions.height,
            }}
            onClick={() => handleCardClick(cards[currentIndex])}
          >
            {/* You can add card content here if needed, e.g., name, description */}
            <div className="card-overlay">
              <h3>{cards[currentIndex].name}</h3>
              <p>{cards[currentIndex].description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizationStack;
