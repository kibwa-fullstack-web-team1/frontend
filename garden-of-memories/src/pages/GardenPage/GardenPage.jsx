import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import './GardenPage.css';

// Define service categories to control rendering order and names
const SERVICE_CATEGORIES = {
  1: '오늘의 질문',
  2: '이야기 시퀀서',
  3: '추억 카드 뒤집기',
};

const GardenPage = () => {
  const gardenRef = useRef(null);
  const [gardenWidth, setGardenWidth] = useState(0);

  useEffect(() => {
    const measureWidth = () => {
      if (gardenRef.current) {
        setGardenWidth(gardenRef.current.offsetWidth);
      }
    };
    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, []);

  const { displayedRewards, personalizationConveyorWidth } = useGarden(1, gardenWidth);

  const commonRewards = displayedRewards.filter(item => item.type === 'common');
  const personalizationRewards = displayedRewards.filter(item => item.type === 'personalization');

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
      </div>
      <div ref={gardenRef} className="garden-background">
        <div className="trophy-case-wrapper">
          <h2>My Collection</h2>
          <div className="trophy-case">
            {Object.entries(SERVICE_CATEGORIES).map(([serviceId, serviceName]) => {
              const rewardsForService = commonRewards.filter(
                (reward) => reward.service_category_id === parseInt(serviceId, 10)
              );

              if (rewardsForService.length === 0) {
                return null; // Don't render a shelf if there are no rewards for this service
              }

              return (
                <div key={serviceId} className="service-shelf">
                  <h3>{serviceName}</h3>
                  <div className="shelf-items">
                    {rewardsForService.map(item => {
                      const size = 80 * Math.pow(1.2, item.stage - 1);
                      return (
                        <model-viewer 
                          key={`${item.type}-${item.id}`}
                          src={item.imageUrl} 
                          alt={item.name}
                          ar 
                          ar-modes="webxr scene-viewer quick-look"
                          camera-controls 
                          auto-rotate 
                          rotation-per-second="30deg" 
                          shadow-intensity="1"
                          style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
                        ></model-viewer>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="personalization-conveyor-wrapper">
          <div 
            className="personalization-conveyor"
            style={{ '--personalization-conveyor-width': `${personalizationConveyorWidth}px` }}
          >
            {personalizationRewards.map((item) => (
              <GardenItem key={`${item.type}-${item.id}`} {...item} />
            ))}
            {personalizationRewards.map((item) => (
              <GardenItem key={`duplicate-${item.type}-${item.id}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
