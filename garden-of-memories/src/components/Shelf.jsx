import React from 'react';

// A simple shelf made of basic box geometries
export const Shelf = ({ rewards, RewardModel, ...props }) => { // Accept RewardModel as prop
  const shelfColor = '#8B4513'; // A simple brown color for a wood-like feel

  // Dimensions of the shelf components
  const backWidth = 5;
  const backHeight = 6;
  const backDepth = 0.1;

  const shelfWidth = backWidth * 0.95;
  const shelfHeight = 0.1;
  const shelfDepth = 1.5;

  // Define positions for rewards on each shelf
  // These are relative to the shelf's own position [0,0,0]
  // Y-positions for each shelf tier (relative to group origin) 
  const bottomShelfY = shelfHeight;
  const middleShelfY = backHeight / 3 + shelfHeight;
  const topShelfY = (backHeight / 3) * 2 + shelfHeight;

  // X-positions for items on a shelf (centered on shelfWidth)
  // Adjusting for 4 items per shelf for bottom/middle, 2 for top
  const itemXPositions4 = [-shelfWidth / 2.5, -shelfWidth / 7.5, shelfWidth / 7.5, shelfWidth / 2.5];
  const itemXPositions2 = [-shelfWidth / 4, shelfWidth / 4];

  // Z-position for items (slightly in front of the backboard)
  const itemZ = shelfDepth / 2 + 0.1; // Slightly in front of the shelf edge

  // Scale factor for models to fit on the shelf
  const modelBaseScale = 0.5; // Adjust this based on actual model sizes

  // Function to get the scale based on item stage
  const getModelScale = (stage) => {
    return modelBaseScale * Math.pow(1.2, stage - 1);
  };

  // Distribute rewards across shelves
  const rewardsByShelf = {
    bottom: [],
    middle: [],
    top: [],
  };

  // Simple distribution logic (can be refined)
  // Assuming 10 rewards: 4 on bottom, 4 on middle, 2 on top
  rewards.forEach((reward, index) => {
    if (index < 4) {
      rewardsByShelf.bottom.push(reward);
    } else if (index < 8) {
      rewardsByShelf.middle.push(reward);
    } else {
      rewardsByShelf.top.push(reward);
    }
  });

  console.log("Rewards by Shelf:", rewardsByShelf); // Debug log

  return (
    <group {...props}>
      {/* Shelf geometry */}
      {/* Backboard */}
      <mesh position={[0, backHeight / 2, 0]}>
        <boxGeometry args={[backWidth, backHeight, backDepth]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>

      {/* Bottom Shelf */}
      <mesh position={[0, bottomShelfY, shelfDepth / 2]}>
        <boxGeometry args={[shelfWidth, shelfHeight, shelfDepth]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>

      {/* Middle Shelf */}
      <mesh position={[0, middleShelfY, shelfDepth / 2]}>
        <boxGeometry args={[shelfWidth, shelfHeight, shelfDepth]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>

      {/* Top Shelf */}
      <mesh position={[0, topShelfY, shelfDepth / 2]}>
        <boxGeometry args={[shelfWidth, shelfHeight, shelfDepth]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>

      {/* Render rewards on shelves */}
      {rewardsByShelf.bottom.map((reward, index) => (
        <RewardModel
          key={reward.id}
          url={reward.image_url}
          scale={getModelScale(reward.stage)}
          position={[itemXPositions4[index], bottomShelfY + shelfHeight / 2 + getModelScale(reward.stage) / 2, itemZ]}
        />
      ))}
      {rewardsByShelf.middle.map((reward, index) => (
        <RewardModel
          key={reward.id}
          url={reward.image_url}
          scale={getModelScale(reward.stage)}
          position={[itemXPositions4[index], middleShelfY + shelfHeight / 2 + getModelScale(reward.stage) / 2, itemZ]}
        />
      ))}
      {rewardsByShelf.top.map((reward, index) => (
        <RewardModel
          key={reward.id}
          url={reward.image_url}
          scale={getModelScale(reward.stage)}
          position={[itemXPositions2[index], topShelfY + shelfHeight / 2 + getModelScale(reward.stage) / 2, itemZ]}
        />
      ))}
    </group>
  );
};
