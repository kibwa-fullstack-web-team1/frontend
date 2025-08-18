import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import ModelViewerModal from '../../components/ModelViewerModal';
import PersonalizationStack from '../../components/PersonalizationStack'; // New import
import './GardenPage.css';
import '../../components/SectionTitle.css';

const CLOUDFRONT_DOMAIN = 'd3dp1o6kjej6ik.cloudfront.net';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const handleGenerateAiReward = async () => {
    setIsGenerating(true);
    setNotification(null);
    try {
      const response = await fetch('/reward-api/rewards/request-ai-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might need to send user_id or other data here if the API requires it
        body: JSON.stringify({ user_id: 1 }), // Assuming user_id 1 for testing
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'AI 보상 생성 요청 실패');
      }

      const data = await response.json();
      setNotification({ type: 'success', message: data.message || 'AI 보상 생성 요청 성공!' });
      // Optionally, refresh garden data here if useGarden hook supports it
      // For now, user might need to refresh the page manually to see new rewards
    } catch (error) {
      setNotification({ type: 'error', message: error.message || '알 수 없는 오류 발생' });
      console.error('AI 보상 생성 요청 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const commonRewards = displayedRewards.filter(item => item.type === 'common');
  const personalizationRewards = displayedRewards.filter(item => item.type === 'personalization');

  return (
    <div className="garden-page-container">
      <div className="garden-header">
        <h1>기억의 정원</h1>
        <button className="generate-ai-reward-button" onClick={handleGenerateAiReward} disabled={isGenerating}>
          {isGenerating ? '생성 중...' : 'AI 보상 생성 요청'}
        </button>
        {notification && (
          <div className={"notification " + notification.type}>
            {notification.message}
          </div>
        )}
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
                        let cameraTargetY = (1.1 - (item.stage - 1) * 0.05).toFixed(2); // Dynamic Y based on stage

                        // Exception for the first item of '이야기 시퀀서'
                        if (serviceId === '2' && rewardsForService.indexOf(item) === 0) {
                          cameraTargetY = (parseFloat(cameraTargetY) - 0.15).toFixed(2);
                        }

                        // Exception for the third item of '이야기 시퀀서'
                        if (serviceId === '2' && rewardsForService.indexOf(item) === 2) {
                          cameraTargetY = (parseFloat(cameraTargetY) + 0.6).toFixed(2);
                        }

                        return (
                          <model-viewer
                            key={`${item.type}-${item.id}`}
                            src={(() => {
                              const s3Domain = "https://kibwa-17.s3.ap-southeast-1.amazonaws.com/";
                              const path = item.imageUrl.startsWith(s3Domain) ? item.imageUrl.substring(s3Domain.length) : item.imageUrl;
                              return `https://${CLOUDFRONT_DOMAIN}/${path}`;
                            })()}
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
              imageUrl: (() => {
                const s3Domain = "https://kibwa-17.s3.ap-southeast-1.amazonaws.com/";
                const sourceUrl = item.imageUrl || item.generated_image_url;
                const path = sourceUrl.startsWith(s3Domain) ? sourceUrl.substring(s3Domain.length) : sourceUrl;
                return `https://${CLOUDFRONT_DOMAIN}/${path}`;
              })(), // Use generated_image_url for personalization
              description: item.description,
              type: item.type, // Keep type for modal handling
              // Add other properties needed by handleModelClick if any
            }))}
            onClick={handleModelClick}
            cardDimensions={{ width: 300, height: 300 }} // Square dimensions
            autoFlipInterval={4000} // 1 second
           // Enable random rotation
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