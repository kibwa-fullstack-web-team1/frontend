import React, { useState } from 'react';

const itemBaseStyle = {
  width: '80px',
  height: '80px',
  cursor: 'grab',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  zIndex: 100, // Always keep items on top
};

export const GardenItem = ({ id, imageUrl, left, top, type, description, onDragStart, isPlaced }) => {
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle = {
    ...itemBaseStyle,
    backgroundImage: `url(${imageUrl})`,
    ...(isPlaced ? {
      position: 'absolute',
      left: left, // Use standard CSS properties
      top: top,
    } : {
      position: 'relative',
    }),
  };

  const handleDragStart = (e) => {
    // 드래그 시작 시 필요한 데이터를 전달
    const dragData = JSON.stringify({ id, type, isPlaced });
    e.dataTransfer.setData('application/json', dragData);
    // 부모 컴포넌트의 핸들러 호출 (필요 시)
    if (onDragStart) {
      onDragStart(e);
    }
  };

  return (
    <div 
      style={itemStyle}
      draggable="true"
      onDragStart={handleDragStart}
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