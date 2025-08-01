// src/services/api.js

const API_BASE_URL = "http://13.251.163.144:8020";

/**
 * 사용자 ID에 해당하는 카드 이미지 URL 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array<{src: string, matched: boolean}>>} - 포맷된 카드 이미지 객체 배열
 */
export const fetchCardImages = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/list/cards?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('카드 이미지 요청 실패');
    }
    const imageUrls = await response.json();
    // API 응답을 앱에서 사용할 형식으로 변환
    return imageUrls.map(url => ({ src: url, matched: false }));
  } catch (error) {
    console.error("카드 이미지 로딩 중 오류 발생:", error);
    // 오류 발생 시 빈 배열 반환 또는 다른 오류 처리
    return [];
  }
};

/**
 * 게임 결과를 서버에 저장합니다.
 * @param {object} resultData - 저장할 게임 결과 데이터
 * @returns {Promise<void>}
 */
export const saveGameResult = async (resultData) => {
  try {
    await fetch(`${API_BASE_URL}/games/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
    });
  } catch (err) {
    console.error("게임 결과 저장 실패:", err);
  }
};
