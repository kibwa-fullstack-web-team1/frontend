import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import './PersonalizationStack.css';

// CardRotate sub-component (will be defined here or in a separate file)
function CardRotate({ children, onSendToBack, sensitivity, cardDimensions }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY, width: cardDimensions.width, height: cardDimensions.height }}
    >
      {children}
    </motion.div>
  );
}

function PersonalizationStack({
  cardsData = [],
  cardDimensions = { width: 200, height: 200 },
  sensitivity = 200, // Default sensitivity for drag
  sendToBackOnClick = false, // Whether clicking sends card to back
  animationConfig = { stiffness: 260, damping: 20 }, // Framer Motion animation config
  onClick, // Original onClick for modal
  autoFlipInterval, // New prop for auto-flipping
  randomRotation = false // New prop for random rotation
}) {
  const [cards, setCards] = useState(cardsData);

  useEffect(() => {
    setCards(cardsData); // Update cards if cardsData changes from parent
  }, [cardsData]);

  useEffect(() => {
    if (autoFlipInterval && cards.length > 1) { // Only auto-flip if interval is set and there's more than one card
      const interval = setInterval(() => {
        sendToBack();
      }, autoFlipInterval);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [autoFlipInterval, cards.length]); // Re-run if interval or number of cards changes

  const sendToBack = () => { // No id needed for auto-flip, always move the first card
    setCards((prev) => {
      if (prev.length === 0) return prev;
      const newCards = [...prev];
      const [firstCard] = newCards.splice(0, 1); // Remove the first card
      newCards.push(firstCard); // Add it to the end
      return newCards;
    });
  };

  const handleCardClick = (card) => {
    if (sendToBackOnClick) {
      sendToBack(card.id);
    }
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <div
      className="personalization-stack-container"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600, // For 3D rotation effect
      }}
    >
      {cards.slice(0, 5).map((card, index) => {
        const randomRotate = 0; // Not implementing random rotation for now

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            cardDimensions={cardDimensions}
          >
            <motion.div
              className="card" // Changed from personalization-stack-card to card
              onClick={() => handleCardClick(card)}
              animate={{
                rotateZ: index * 4, // Slight Z-rotation for cards behind
                rotateY: index * 11, // Slight Y-rotation for cards behind
                scale: 1, // All cards same size
                y: index * 0, // Very slight y-offset for peeking out
                x: index * 0, // Very slight x-offset for peeking out
                zIndex: cards.length - index,
                transformOrigin: "50% 50%",
              }}
              initial={false}
              transition={{
                type: "tween",
                                duration: 0.8, // Increased duration for smoother transition
                ease: "easeInOut", // Smooth easing
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
              }}
            >
              <img
                src={card.imageUrl}
                alt={`card-${card.id}`}
                className="card-image"
              />
              <div className="card-overlay">
                <h3>{card.name}</h3>
                <p>{card.description}</p>
              </div>
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
};

export default PersonalizationStack;
