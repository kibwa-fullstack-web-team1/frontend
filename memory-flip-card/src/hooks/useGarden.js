import { useState, useEffect } from 'react';
import { fetchGardenItems } from '../api/gardenApi';

const PERSONALIZATION_REWARD_CONVEYOR_TOP = 400; // Fixed top position for conveyor belt
const PERSONALIZATION_REWARD_ITEM_WIDTH = 80; // Standard item width
const PERSONALIZATION_REWARD_ITEM_SPACING = 50; // Spacing between items

const COMMON_REWARD_ITEM_BASE_WIDTH = 240; // Base width of common reward items

// Fixed positions for service category display areas
const SERVICE_CATEGORY_DISPLAY_POSITIONS = [
  { service_category_id: 1, label: "오늘의 질문", left: 150, top: 250 },
  { service_category_id: 2, label: "이야기 시퀀서", left: 450, top: 250 },
  { service_category_id: 3, label: "추억 카드 뒤집기", left: 750, top: 250 },
  { service_category_id: 4, label: "부모의 질문", left: 1050, top: 250 },
];

export const useGarden = (userId, gardenWidth) => {
  const [displayedRewards, setDisplayedRewards] = useState([]);
  const [personalizationConveyorWidth, setPersonalizationConveyorWidth] = useState(0);

  useEffect(() => {
    if (userId && gardenWidth > 0) { // Ensure gardenWidth is available
      fetchGardenItems(userId).then(({ placedItems: fetchedPlaced, inventoryItems: fetchedInventory }) => {
        const allRewards = [...fetchedPlaced, ...fetchedInventory];
        const commonRewards = [];
        const personalizationRewards = [];

        allRewards.forEach(item => {
          if (item.type === 'common') {
            commonRewards.push(item);
          } else if (item.type === 'personalization') {
            personalizationRewards.push(item);
          }
        });

        // Assign positions to common rewards based on service category display positions
        const positionedCommonRewards = commonRewards.map(item => {
          const categoryPosition = SERVICE_CATEGORY_DISPLAY_POSITIONS.find(
            pos => pos.service_category_id === item.service_category_id
          );

          if (categoryPosition) {
            // Center the common reward within its category display area
            const itemLeft = categoryPosition.left + (COMMON_REWARD_ITEM_BASE_WIDTH / 2) - (COMMON_REWARD_ITEM_BASE_WIDTH / 2); // Centered
            const itemTop = categoryPosition.top + (COMMON_REWARD_ITEM_BASE_WIDTH / 2) - (COMMON_REWARD_ITEM_BASE_WIDTH / 2); // Centered
            return { ...item, left: itemLeft, top: itemTop };
          } else {
            // Fallback if service category position not found
            return { ...item, left: 0, top: 0 }; 
          }
        });

        // Assign initial top positions for personalization rewards on conveyor belt
        const positionedPersonalizationRewards = personalizationRewards.map((item, index) => {
          const top = PERSONALIZATION_REWARD_CONVEYOR_TOP;
          return { ...item, top }; // Only pass top, left will be handled by flexbox
        });

        // Calculate conveyor width
        const calculatedWidth = personalizationRewards.length * (PERSONALIZATION_REWARD_ITEM_WIDTH + PERSONALIZATION_REWARD_ITEM_SPACING);
        setPersonalizationConveyorWidth(calculatedWidth);

        // Combine all positioned rewards
        setDisplayedRewards([...positionedCommonRewards, ...positionedPersonalizationRewards]);

      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [userId, gardenWidth]); // Re-run when gardenWidth changes

  return { displayedRewards, personalizationConveyorWidth };
};