import React, { useRef, useState, useEffect } from 'react';
import { GardenItem } from '../../components/GardenItem';
import { useGarden } from '../../hooks/useGarden';
import ModelViewerModal from '../../components/ModelViewerModal';
import PersonalizationStack from '../../components/PersonalizationStack'; // New import
import ServiceLinksModal from '../../components/ServiceLinksModal';
import ConfirmationModal from '../../components/ConfirmationModal';
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
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [hasGeneratedReward, setHasGeneratedReward] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // New
  const [newRewardImageUrl, setNewRewardImageUrl] = useState(null); // New
  const [generatedRewardId, setGeneratedRewardId] = useState(null); // New
  

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

  useEffect(() => {
    if (!generatedRewardId) return;

    let pollInterval;
    let pollTimeout;
    const POLLING_INTERVAL = 2000; // Poll every 2 seconds
    const POLLING_TIMEOUT = 60000; // Stop polling after 60 seconds

    const pollForImageUrl = async () => {
      try {
        const response = await fetch(`/reward-api/rewards/personalization/${generatedRewardId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch personalization reward.');
        }
        const data = await response.json();
        console.log('Polling Response Data:', data);

        if (data.generated_image_url) {
          clearInterval(pollInterval);
          clearTimeout(pollTimeout);
          setNewRewardImageUrl(data.generated_image_url);
          setShowConfirmationModal(true);
          setIsGenerating(false); // Generation complete
          setGeneratedRewardId(null); // Reset for next generation
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
        clearTimeout(pollTimeout);
        setIsGenerating(false); // Stop generating state on error
        setGeneratedRewardId(null); // Reset
      }
    };

    // Start polling
    pollInterval = setInterval(pollForImageUrl, POLLING_INTERVAL);

    // Set timeout to stop polling after a certain period
    pollTimeout = setTimeout(() => {
      clearInterval(pollInterval);
      console.log('Polling timed out. Image URL not received within 20 seconds.');
      setIsGenerating(false); // Stop generating state on timeout
      setGeneratedRewardId(null); // Reset
      // Optionally, show an error message to the user
    }, POLLING_TIMEOUT);

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
      clearTimeout(pollTimeout);
    };
  }, [generatedRewardId]); // Rerun when generatedRewardId changes

  const { displayedRewards, personalizationConveyorWidth } = useGarden(1, gardenWidth);

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const handleGenerateAiReward = async () => {
    if (hasGeneratedReward) { // If a reward has already been generated
      setShowServiceModal(true); // Show the service modal
      return; // Exit the function
    }

    setIsGenerating(true);
    
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
      console.log('API Response Data:', data); // Log the full response data
      
      setHasGeneratedReward(true); // Set to true on successful generation
      setGeneratedRewardId(data.id); // Store the ID of the newly created reward

      // The image URL will be polled later, so no need to extract here
      // Optionally, refresh garden data here if useGarden hook supports it
      // For now, user might need to refresh the page manually to see new rewards
    } catch (error) {
      
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
        <button className={`generate-ai-reward-button ${hasGeneratedReward ? 'button-generated' : ''}`} onClick={handleGenerateAiReward} disabled={isGenerating}>
          {isGenerating ? '생성 중...' : '새 추억 앨범 만들기'}
        </button>
        
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
                  <div key={serviceId} className="service-shelf" data-service-name={serviceName}>
                    <div className="shelf-display-area"> {/* New container for display area */}
                      <div className="shelf-items">
                        {rewardsForService.map(item => {
                          const size = 70 * Math.pow(1.2, item.stage - 10);
                          let cameraTargetY = (1.1 - (item.stage - 1) * 0.05).toFixed(2); // Dynamic Y based on stage

                          // Exception for the first item of '이야기 시퀀서'
                          if (serviceId === '2' && rewardsForService.indexOf(item) === 0) {
                            cameraTargetY = (parseFloat(cameraTargetY) - 0.5).toFixed(2);
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
                              })()}n                              alt={item.name}
                              ar
                              ar-modes="webxr scene-viewer quick-look"
                              shadow-intensity="5"
                              camera-target="0m 0.1m 0m" /* Fixed for debugging */
                              style={{ width: `100px`, height: `100px`, display: 'block' }} /* Fixed for debugging */
                              onClick={() => handleModelClick(item)}
                            ></model-viewer>
                          );
                        })}
                      </div>
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
      {showConfirmationModal && (
        <ConfirmationModal
          imageUrl={newRewardImageUrl}
          onClose={() => setShowConfirmationModal(false)}
        />
      )}
      {showServiceModal && (
        <ServiceLinksModal onClose={() => setShowServiceModal(false)} />
      )}
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