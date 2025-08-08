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
    // 백엔드 데이터를 프론트엔드 형식에 맞게 변환 (예: position_x -> left)
    return data.map(item => ({
      ...item,
      left: item.position_x,
      top: item.position_y,
      // 공용 보상과 개인화 보상의 이미지 URL 필드 이름을 통일합니다.
      imageUrl: item.image_url || item.generated_image_url
    }));
  } catch (error) {
    console.error("정원 아이템 로딩 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
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