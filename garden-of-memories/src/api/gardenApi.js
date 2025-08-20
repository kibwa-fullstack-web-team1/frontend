const REWARD_API_BASE_URL = '/reward-api';
const API_TIMEOUT = 10000;

/**
 * 사용자의 정원 아이템(리워드) 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} - 정원 아이템 객체 배열
 */
export const fetchGardenItems = async (userId) => {
  try {
    const response = await fetch(`${REWARD_API_BASE_URL}/users/${userId}/rewards`);
    if (!response.ok) {
      throw new Error('정원 아이템 조회 실패');
    }
    const data = await response.json();
    
    const placedItems = [];
    const inventoryItems = [];

    data.forEach(item => {
      const transformedItem = {
        ...item,
        left: item.position_x,
        top: item.position_y,
        imageUrl: item.image_url || item.generated_image_url
      };

      // position_x 또는 position_y가 null이 아니면 배치된 아이템으로 간주
      if (item.position_x !== null && item.position_y !== null) {
        placedItems.push(transformedItem);
      } else {
        inventoryItems.push(transformedItem);
      }
    });
<<<<<<< HEAD
    return { placedItems, inventoryItems }; // 오류 발생 시 빈 배열 반환
=======

    return { placedItems, inventoryItems };
>>>>>>> origin/main
  } catch (error) {
    console.error("정원 아이템 로딩 중 오류 발생:", error);
    return { placedItems: [], inventoryItems: [] }; // 오류 발생 시 빈 배열 반환
  }
};

/**
 * 정원 아이템의 위치를 업데이트합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} rewardInstanceId - 사용자 리워드 인스턴스 ID (UserCommonReward.id 또는 PersonalizationReward.id)
 * @param {string} rewardType - 리워드 타입 ('common' 또는 'personalization')
 * @param {{x: number, y: number}} position - 새로운 위치 좌표
 * @returns {Promise<object>} - 업데이트 결과
 */
export const updateGardenItemPosition = async (userId, rewardInstanceId, rewardType, position) => {
  try {
    const response = await fetch(`${REWARD_API_BASE_URL}/users/${userId}/rewards/${rewardInstanceId}/position?reward_type=${rewardType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position_x: position.left, position_y: position.top }),
    });

    if (!response.ok) {
      throw new Error('정원 아이템 위치 업데이트 실패');
    }
    return await response.json();
  } catch (error) {
    console.error("정원 아이템 위치 업데이트 실패:", error);
    throw error;
  }
};