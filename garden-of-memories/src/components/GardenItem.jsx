import React, { useState } from 'react';

const itemBaseStyle = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  zIndex: 100, // Always keep items on top
  cursor: 'default', // Always default cursor
  transformStyle: 'preserve-3d', // Enable 3D transformations
  
};

export const GardenItem = ({ id, imageUrl, left, top, type, description, stage }) => {
  const [isHovered, setIsHovered] = useState(false);

  let currentWidth = 80;
  let currentHeight = 80;

  if (type === 'common') {
    currentWidth = 240; // 3배 크게
    currentHeight = 240;
    if (stage && stage > 1) {
      const scaleMultiplier = Math.pow(1.2, stage - 1);
      currentWidth = Math.round(currentWidth * scaleMultiplier);
      currentHeight = Math.round(currentHeight * scaleMultiplier);
    }
  }

  const itemStyle = {
    ...itemBaseStyle,
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    backgroundImage: `url(${imageUrl})`,
    // Positioning logic: common rewards are absolute, personalization rewards are flex-positioned
    ...(type === 'common' ? {
      position: 'absolute',
      left: left,
      top: top,
      animation: 'rotate3d 5s linear infinite', // Apply 3D rotation animation ONLY for common type
    } : {
      // Personalization rewards will be positioned by flexbox in their container
      // No absolute positioning here
      position: 'relative', // Ensure it respects flexbox layout
    }),
  };

  return (
    <div 
      style={itemStyle}
      draggable="false" // Not draggable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`gardenitem`}
    >
      {description && (
        <div style={{
          position: 'absolute',
          bottom: '105%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'black',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          whiteSpace: 'nowrap',
          zIndex: 10,
          visibility: isHovered ? 'visible' : 'hidden',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s, visibility 0.3s',
        }}>
          {description}
        </div>
      )}
    </div>
  );
};