const NOTIFICATION_API_BASE_URL = '/notification-api';

/**
 * 전화번호 인증 코드 발송 API 호출
 * @param {string} phoneNumber - 인증 코드를 받을 전화번호
 * @returns {Promise<object>} - API 응답
 */
export const sendVerificationCode = async (phoneNumber) => {
  try {
    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/notifications/phone/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `인증 코드 발송 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('인증 코드 발송 오류:', error);
    throw error;
  }
};

/**
 * 전화번호 인증 코드 검증 API 호출
 * @param {string} phoneNumber - 인증한 전화번호
 * @param {string} code - 사용자가 입력한 인증 코드
 * @returns {Promise<object>} - API 응답
 */
export const verifyCode = async (phoneNumber, code) => {
  try {
    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/notifications/phone/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber, verification_code: code }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `인증 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('코드 인증 오류:', error);
    throw error;
  }
};

/**
 * 알림 내역 조회 API 호출
 * @param {number} userId - 알림을 조회할 사용자 ID
 * @param {number} skip - 건너뛸 알림 수
 * @param {number} limit - 가져올 알림 수
 * @returns {Promise<Array>} - 알림 목록
 */
export const getNotificationHistory = async (userId, skip = 0, limit = 100) => {
  try {
    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/notifications/history?recipient_user_id=${userId}&skip=${skip}&limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `알림 내역 조회 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('알림 내역 조회 오류:', error);
    throw error;
  }
};
