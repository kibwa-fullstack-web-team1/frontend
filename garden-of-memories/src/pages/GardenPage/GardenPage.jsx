import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

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

  const calculatePositions = (width) => {
    const cardWidth = 200;
    const cardHeight = 150;
    const gap = 50; // Spacing between cards

    // Calculate positions for 3 cards
    const totalContentWidth = (3 * cardWidth) + (2 * gap);
    const startX = (width - totalContentWidth) / 2; // Starting X for the leftmost card to center the group

    return [
      { service_category_id: 1, label: "오늘의 질문", left: startX, top: 220, width: cardWidth, height: cardHeight, icon: '💡' },
      { service_category_id: 2, label: "이야기 시퀀서", left: startX + cardWidth + gap, top: 100, width: cardWidth, height: cardHeight, icon: '📚' },
      { service_category_id: 3, label: "추억 카드 뒤집기", left: startX + 2 * (cardWidth + gap), top: 100, width: cardWidth, height: cardHeight, icon: '🧠' },
    ];
  };

  const SERVICE_CATEGORY_DISPLAY_POSITIONS = calculatePositions(gardenWidth);

  const { displayedRewards, personalizationConveyorWidth } = useGarden(1, gardenWidth);

  const commonRewards = displayedRewards.filter(item => item.type === 'common');
  const personalizationRewards = displayedRewards.filter(item => item.type === 'personalization');

  // Helper function to get service_category_id from reward name
  const getServiceCategoryIdFromName = (rewardName) => {
    if (rewardName.includes('daily-question')) return 1;
    if (rewardName.includes('story-sequencing')) return 2;
    if (rewardName.includes('추억 카드 뒤집기')) return 3; // Assuming this name format for the third category
    return null; 
  };

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
      </div>
      <div 
        ref={gardenRef} 
        className="garden-background"
      >
        {/* Render service category display areas as containers for models */}
        {SERVICE_CATEGORY_DISPLAY_POSITIONS.map((pos) => (
          <div 
            key={pos.service_category_id}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
              display: 'flex',
              flexDirection: 'column', // To stack models vertically if multiple
              justifyContent: 'center', // Center models vertically
              alignItems: 'center',     // Center models horizontally
              // No background, border, shadow for the "card" itself
            }}
          >
            {/* Render common rewards within this service category */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
              {commonRewards.filter(item => getServiceCategoryIdFromName(item.name) === pos.service_category_id).map(item => {
                const size = 100 * Math.pow(1.5, item.stage - 1); // Calculate size based on stage with 1.5x multiplier
                return (
                <model-viewer 
                  key={`${item.type}-${item.id}`}
                  src={item.imageUrl} 
                  alt={item.name}
                  ar 
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls 
                  auto-rotate 
                  rotation-per-second="180deg" 
                  shadow-intensity="1"
                  style={{ width: `${size}px`, height: `${size}px`, display: 'block' }} /* Dynamic styling based on stage */
                ></model-viewer>
              )})} 
            </div>
          </div>
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
