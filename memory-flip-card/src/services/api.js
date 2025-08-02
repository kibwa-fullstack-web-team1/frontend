// src/services/api.js

// 게임 관련 API (기존 서버)
const GAME_API_BASE_URL = "http://13.251.163.144:8020";

// 로그인 관련 API (FastAPI 서버)
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://13.251.163.144:8011";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

/**
 * 로그인 API 호출
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<{token: string, user: object}>} - 로그인 성공 시 토큰과 사용자 정보
 */
export const loginUser = async (email, password) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `로그인 실패: ${response.status}`);
    }

    const data = await response.json();
    
    // FastAPI 응답 형식에 맞게 처리
    // 일반적으로 FastAPI는 access_token, user 정보를 반환
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userInfo', JSON.stringify(data.user || data));
    } else if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user || data));
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
};

/**
 * 회원가입 API 호출
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @param {string} nickname - 사용자 닉네임
 * @param {string} phone - 사용자 전화번호
 * @param {string} role - 사용자 역할 (elderly/caregiver)
 * @returns {Promise<{user: object}>} - 회원가입 성공 시 사용자 정보
 */
export const signupUser = async (email, password, nickname, phone, role) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${AUTH_API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nickname, phone, role }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `회원가입 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
};

/**
 * 로그아웃 처리
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
};

/**
 * 현재 로그인 상태 확인
 * @returns {boolean} 로그인 상태
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * 현재 사용자 정보 가져오기
 * @returns {object|null} 사용자 정보
 */
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 인증 토큰 가져오기
 * @returns {string|null} 인증 토큰
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * 사용자 ID에 해당하는 카드 이미지 URL 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array<{src: string, matched: boolean}>>} - 포맷된 카드 이미지 객체 배열
 */
export const fetchCardImages = async (userId) => {
  try {
    const response = await fetch(`${GAME_API_BASE_URL}/list/cards?user_id=${userId}`);
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
    await fetch(`${GAME_API_BASE_URL}/games/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
    });
  } catch (err) {
    console.error("게임 결과 저장 실패:", err);
  }
};
