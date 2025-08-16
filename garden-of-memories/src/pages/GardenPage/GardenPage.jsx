import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import ModelViewerModal from '../../components/ModelViewerModal';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

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

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const commonRewards = displayedRewards.filter(item => item.type === 'common');
  const personalizationRewards = displayedRewards.filter(item => item.type === 'personalization');

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
      </div>
      <div ref={gardenRef} className="garden-background">
        <div className="garden-left-panel">
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
                        const size = 60 * Math.pow(1.2, item.stage - 1);
                        return (
                          <model-viewer
                            key={`${item.type}-${item.id}`}
                            src={item.imageUrl}
                            alt={item.name}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            shadow-intensity="1"
                            style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
                            onClick={() => handleModelClick(item)}
                          ></model-viewer>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="garden-right-panel">
          <h2>Personalization Album</h2>
          <div className="personalization-album">
            {personalizationRewards.map((item) => (
              <GardenItem key={`${item.type}-${item.id}`} {...item} onClick={() => handleModelClick(item)} />
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <ModelViewerModal
          model={selectedModel}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default GardenPage;