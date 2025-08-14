import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

// Fixed positions for service category display areas (red boxes and labels)
const SERVICE_CATEGORY_DISPLAY_POSITIONS = [
  { service_category_id: 1, label: "오늘의 질문", left: 100, top: 100, width: 200, height: 150 },
  { service_category_id: 2, label: "이야기 시퀀서", left: 350, top: 100, width: 200, height: 150 },
  { service_category_id: 3, label: "추억 카드 뒤집기", left: 600, top: 100, width: 200, height: 150 },
  { service_category_id: 4, label: "부모의 질문", left: 850, top: 100, width: 200, height: 150 },
];

const GardenPage = () => {
  const gardenRef = useRef(null);
  const [gardenWidth, setGardenWidth] = useState(0);

  // Measure garden width on mount and resize
  useEffect(() => {
    const measureWidth = () => {
      if (gardenRef.current) {
        setGardenWidth(gardenRef.current.offsetWidth);
      }
    };

    measureWidth(); // Initial measurement
    window.addEventListener('resize', measureWidth); // Update on resize

    return () => {
      window.removeEventListener('resize', measureWidth);
    };
  }, []);

  const { displayedRewards, personalizationConveyorWidth } = useGarden(1, gardenWidth);

  const commonRewards = displayedRewards.filter(item => item.type === 'common');
  const personalizationRewards = displayedRewards.filter(item => item.type === 'personalization');

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
      </div>
      <div 
        ref={gardenRef} 
        className="garden-background"
      >
        {/* Render service category display areas */}
        {SERVICE_CATEGORY_DISPLAY_POSITIONS.map((pos) => (
          <div 
            key={pos.service_category_id}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
              border: '2px solid red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: '10px',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ color: 'red', fontWeight: 'bold' }}>{pos.label}</span>
          </div>
        ))}

        {/* Render common rewards */}
        {commonRewards.map((item) => (
          <GardenItem 
            key={`${item.type}-${item.id}`}
            {...item}
            isPlaced={true} // Common rewards are always considered 'placed' for display
          />
        ))}

        {/* Personalization rewards conveyor belt */}
        <div className="personalization-conveyor-wrapper">
          <div 
            className="personalization-conveyor"
            style={{ '--personalization-conveyor-width': `${personalizationConveyorWidth}px` }}
          >
            {personalizationRewards.map((item) => (
              <GardenItem 
                key={`${item.type}-${item.id}`}
                {...item}
                // isPlaced is not needed for personalization rewards as they are not absolutely positioned
              />
            ))}
            {/* Duplicate items for seamless loop */}
            {personalizationRewards.map((item) => (
              <GardenItem 
                key={`duplicate-${item.type}-${item.id}`}
                {...item}
                // isPlaced is not needed for personalization rewards as they are not absolutely positioned
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
