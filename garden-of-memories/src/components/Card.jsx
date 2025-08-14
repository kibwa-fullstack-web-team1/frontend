import React from 'react';
import './Card.css';

function Card({ card, handleChoice, flipped, disabled, isWrongMatch }) {
  const handleClick = () => {
    // Only allow clicks if the card is not disabled
    if (!disabled) {
      handleChoice(card);
    }
  };

  // Dynamically combine class names
  const cardClasses = [
    'card',
    isWrongMatch ? 'wrong-match' : '',
    card.matched ? 'matched' : ''
  ].join(' ');

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className={flipped ? 'card-inner flipped' : 'card-inner'}>
        <img className="front" src={card.src} alt="card front" />
        <img className="back" src="/img/cover.png" alt="card back" />
      </div>
    </div>
  );
}

export default Card;