import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import ModelViewerModal from '../../components/ModelViewerModal';
import PersonalizationStack from '../../components/PersonalizationStack'; // New import
import './GardenPage.css';
import '../../components/SectionTitle.css';

// Define service categories to control rendering order and names
const SERVICE_CATEGORIES = {
  1: '오늘의 질문',
  2: '이야기 순서 맞추기',
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
            <h2 className="section-title">내 컬렉션</h2>
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
                        const size = 70 * Math.pow(1.2, item.stage - 1);
                        let cameraTargetY = (0.55 - (item.stage - 1) * 0.05).toFixed(2); // Dynamic Y based on stage

                        // Exception for the first item of '이야기 시퀀서'
                        if (serviceId === '2' && rewardsForService.indexOf(item) === 0) {
                          cameraTargetY = (parseFloat(cameraTargetY) - 0.15).toFixed(2);
                        }

                        // Exception for the third item of '이야기 시퀀서'
                        if (serviceId === '2' && rewardsForService.indexOf(item) === 2) {
                          cameraTargetY = (parseFloat(cameraTargetY) + 0.25).toFixed(2);
                        }

                        return (
                          <model-viewer
                            key={`${item.type}-${item.id}`}
                            src={item.imageUrl}
                            alt={item.name}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            shadow-intensity="1"
                            camera-target={`0m ${cameraTargetY}m 0m`} /* Adjust model vertical position */
                            style={{ width: `${size}px`, height: `${size}px`, display: 'block' }} /* Added marginBottom */
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
          <h2 className="section-title">개인화 앨범</h2>
          <PersonalizationStack
            cardsData={personalizationRewards.map(item => ({
              id: item.id,
              imageUrl: item.imageUrl || item.generated_image_url, // Use generated_image_url for personalization
              name: item.name,
              description: item.description,
              type: item.type, // Keep type for modal handling
              // Add other properties needed by handleModelClick if any
            }))}
            onClick={handleModelClick}
            cardDimensions={{ width: 200, height: 250 }} // Example dimensions, adjust as needed
            autoFlipInterval={3000} // 3 seconds
          />
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