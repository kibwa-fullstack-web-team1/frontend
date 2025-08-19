import { useState, useEffect } from 'react';
import { fetchGardenItems } from '../api/gardenApi';

const PERSONALIZATION_REWARD_CONVEYOR_TOP = 400; // Fixed top position for conveyor belt
const PERSONALIZATION_REWARD_ITEM_WIDTH = 80; // Standard item width
const PERSONALIZATION_REWARD_ITEM_SPACING = 50; // Spacing between items

const COMMON_REWARD_ITEM_BASE_WIDTH = 240; // Base width of common reward items

// Fixed positions for service category display areas


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
        const positionedCommonRewards = commonRewards; // No positioning here

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

      }).catch(error => { // ADD CATCH BLOCK
        console.error('Error fetching garden items:', error);
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [userId, gardenWidth]); // Re-run when gardenWidth changes

  return { displayedRewards, personalizationConveyorWidth };
};