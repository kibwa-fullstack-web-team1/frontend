import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

const GardenPage = () => {
  const userId = 1; // 사용자 ID를 1로 고정
  const { gardenItems, moveItem } = useGarden(userId);
  const gardenRef = useRef(null); // 정원 배경의 ref

  const handleDragEnd = (id, x, y, type) => {
    if (gardenRef.current) {
      const gardenRect = gardenRef.current.getBoundingClientRect();
      // 드래그된 아이템의 새로운 위치를 정원 배경에 대한 상대적인 위치로 계산
      const newLeft = x - gardenRect.left;
      const newTop = y - gardenRect.top;
      moveItem(id, newLeft, newTop, type);
    }
  };

  return (
    <div className="garden-page-container">
      <h1>기억의 정원</h1>
      <div ref={gardenRef} className="garden-background">
        <div className="tree-of-memories">기억의 나무</div>
        {gardenItems.map((item) => (
          <GardenItem 
            key={`${item.type}-${item.id}`}
            id={item.id} 
            imageUrl={item.imageUrl} 
            left={item.left} 
            top={item.top} 
            type={item.type} 
            description={item.description} 
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default GardenPage;