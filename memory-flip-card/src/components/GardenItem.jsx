import React from 'react';
import { motion } from 'framer-motion';

const itemBaseStyle = {
  width: '80px',
  height: '80px',
  cursor: 'grab',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'absolute', // GardenPage에서 absolute로 설정
};

export const GardenItem = ({ id, imageUrl, left, top, type, description, onDragEnd }) => {
  return (
    <motion.div 
      style={{ 
        ...itemBaseStyle, 
        backgroundImage: `url(${imageUrl})`,
        x: left, // framer-motion의 x, y로 초기 위치 설정
        y: top,
      }}
      drag
      dragTransition={{ bounceStiffness: 0, bounceDamping: 0 }} // 관성 제거
      onDragEnd={(event, info) => onDragEnd(id, info.point.x, info.point.y, type)}
      data-testid={`gardenitem`}
    >
      {/* 툴팁 로직은 GardenItem 내부에서 처리 */}
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
          visibility: 'hidden',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}>
          {description}
        </div>
      )}
    </motion.div>
  );
};
