import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

const GardenPage = () => {
  const userId = 1; // 사용자 ID를 1로 고정
  const { placedItems, inventoryItems, moveItem } = useGarden(userId); // placedItems와 inventoryItems 사용
  const gardenRef = useRef(null); // 정원 배경의 ref

  const handleDragEnd = (id, x, y, type) => {
    if (gardenRef.current) {
      const gardenRect = gardenRef.current.getBoundingClientRect();
      
      // 드롭된 위치가 정원 배경 영역 내에 있는지 확인
      const isDroppedInGarden = 
        x >= gardenRect.left && 
        x <= gardenRect.right && 
        y >= gardenRect.top && 
        y <= gardenRect.bottom;

      if (isDroppedInGarden) {
        // 드래그된 아이템의 새로운 위치를 정원 배경에 대한 상대적인 위치로 계산
        const newLeft = x - gardenRect.left;
        const newTop = y - gardenRect.top;
        moveItem(id, newLeft, newTop, type);
      } else {
        // 정원 배경 외부로 드롭된 경우 (예: 인벤토리로 다시 드롭)
        // 인벤토리 아이템이었다면 위치 업데이트를 하지 않음 (인벤토리에 유지)
        // 이미 배치된 아이템이었다면 (isPlaced=true) 원래 위치로 되돌리거나, 
        // 드래그 시작 시의 위치를 기억하여 되돌리는 로직이 필요할 수 있으나, 
        // 현재는 단순히 위치 업데이트를 하지 않아 API 호출을 막는 방식으로 처리.
        // (moveItem은 isPlaced 여부와 관계없이 호출되므로, 여기서는 호출 자체를 막는 것이 목적)
        console.log(`Item ${id} dropped outside garden area. No position update.`);
      }
    }
  };

  return (
    <div className="garden-page-container">
      <h1>기억의 정원</h1>
      <div ref={gardenRef} className="garden-background">
        <div className="tree-of-memories">기억의 나무</div>
        {placedItems.map((item) => ( // placedItems 렌더링
          <GardenItem 
            key={`${item.type}-${item.id}`}
            id={item.id} 
            imageUrl={item.imageUrl} 
            left={item.left} 
            top={item.top} 
            type={item.type} 
            description={item.description} 
            onDragEnd={handleDragEnd}
            isPlaced={true} // 배치된 아이템임을 나타내는 플래그
          />
        ))}
      </div>

      {/* 인벤토리 영역 */}
      <div className="inventory-container">
        <h2>인벤토리</h2>
        <div className="inventory-grid">
          {inventoryItems.map((item) => ( // inventoryItems 렌더링
            <GardenItem 
              key={`${item.type}-${item.id}`}
              id={item.id} 
              imageUrl={item.imageUrl} 
              type={item.type} 
              description={item.description} 
              onDragEnd={handleDragEnd}
              isPlaced={false} // 인벤토리 아이템임을 나타내는 플래그
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardenPage;