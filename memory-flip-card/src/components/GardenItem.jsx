import React, { useState } from 'react';
import { motion } from 'framer-motion';

const itemBaseStyle = {
  width: '80px',
  height: '80px',
  cursor: 'grab',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxSizing: 'border-box', // Add this line
};

export const GardenItem = ({ id, imageUrl, left, top, type, description, onDragEnd, isPlaced }) => {
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle = {
    ...itemBaseStyle,
    backgroundImage: `url(${imageUrl})`,
    // isPlaced가 true일 때만 absolute 포지셔닝과 x, y 좌표 적용
    ...(isPlaced ? {
      position: 'absolute',
      x: left,
      y: top,
    } : { // isPlaced가 false일 때 (인벤토리 아이템)
      position: 'static', // flexbox 흐름을 따르도록 static으로 설정
      x: undefined, // framer-motion의 x, y를 사용하지 않음
      y: undefined, // framer-motion의 x, y를 사용하지 않음
    }),
  };

  return (
    <motion.div 
      style={itemStyle}
      drag
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 0, bounceDamping: 0 }}
      onDragEnd={(event, info) => onDragEnd(id, info.point.x, info.point.y, type)}
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
    </motion.div>
  );
};
