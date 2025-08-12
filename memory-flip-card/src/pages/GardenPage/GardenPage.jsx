import React, { useRef } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

const GardenPage = () => {
  const { placedItems, inventoryItems, moveItem, returnItemToInventory, saveGardenState, resetGardenLayout } = useGarden(1);
  const gardenRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault(); // 드롭을 허용하기 위해 필수
  };

  const handleDrop = (e, dropZone) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;

    const { id, type, isPlaced } = JSON.parse(dragData);

    if (dropZone === 'garden') {
      if (gardenRef.current) {
        const gardenRect = gardenRef.current.getBoundingClientRect();
        const itemWidth = 80;
        const itemHeight = 80;

        // 정원 기준 상대 좌표 계산
        let newLeft = e.clientX - gardenRect.left;
        let newTop = e.clientY - e.clientY - gardenRect.top;

        // 아이템의 중심이 마우스 포인터와 맞도록 보정
        newLeft -= itemWidth / 2;
        newTop -= itemHeight / 2;

        // 경계 유지 로직
        const clampedLeft = Math.max(0, Math.min(newLeft, gardenRect.width - itemWidth));
        const clampedTop = Math.max(0, Math.min(newTop, gardenRect.height - itemHeight));

        moveItem(id, clampedLeft, clampedTop, type);
      }
    } else if (dropZone === 'inventory') {
      if (isPlaced) { // 정원에 있던 아이템일 경우에만 인벤토리로 이동
        returnItemToInventory(id, type);
      }
    }
  };

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
        <button onClick={saveGardenState} className="save-button">저장하기</button>
        <button onClick={resetGardenLayout} className="reset-button">초기화</button>
      </div>
      <div 
        ref={gardenRef} 
        className="garden-background"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'garden')}
      >
        <div className="tree-of-memories">기억의 나무</div>
        {placedItems.map((item) => (
          <GardenItem 
            key={`${item.type}-${item.id}`}
            {...item}
            isPlaced={true}
          />
        ))}
      </div>

      <div 
        className="inventory-container"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'inventory')}
      >
        <h2>인벤토리</h2>
        <div className="inventory-grid">
          {inventoryItems.map((item) => (
            <GardenItem 
              key={`${item.type}-${item.id}`}
              {...item}
              isPlaced={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
