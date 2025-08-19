// src/services/api.js

// 카드 게임 관련 API (기존 서버)
const CARD_GAME_BASE_URL = import.meta.env.VITE_DAILY_QUESTION_API_BASE_URL;

// 로그인 관련 API (FastAPI 서버)
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

/**
 * 로그인 API 호출
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<{token: string, user: object}>} - 로그인 성공 시 토큰과 사용자 정보
 * 
 * TODO: 실제 백엔드 API 엔드포인트와 연결
 * 현재 설정된 엔드포인트: ${AUTH_API_BASE_URL}/auth/login
 * 예상 응답 형식: { access_token: string, user: { id, email, nickname, role } }
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
 * @param {string} username - 사용자 이름
 * @param {string} phone - 사용자 전화번호
 * @param {string} role - 사용자 역할 (senior→senior, family→guardian)
 * @returns {Promise<{user: object}>} - 회원가입 성공 시 사용자 정보
 * 
 * TODO: 실제 백엔드 API 엔드포인트와 연결
 * 현재 설정된 엔드포인트: ${AUTH_API_BASE_URL}/auth/signup
 * 예상 요청 형식: { email, password, username, phone, role }
 * 예상 응답 형식: { success: boolean, message: string, user: object }
 */
export const signupUser = async (email, password, username, phone, role) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // 백엔드 API 형식에 맞게 데이터 변환
    const requestData = {
      username: username,
      email: email,
      phone_number: phone,
      hashed_password: password, // 백엔드에서 해시 처리할 것으로 예상
      role: role === 'senior' ? 'senior' : role === 'family' ? 'guardian' : role // senior→senior, family→guardian 매핑
    };

    const response = await fetch(`${AUTH_API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
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
 * 
 * TODO: 실제 백엔드 API와 연결 시 로그아웃 엔드포인트 호출
 * 현재는 로컬 스토리지만 정리
 * 예상 엔드포인트: ${AUTH_API_BASE_URL}/auth/logout
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
};

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<object>} 사용자 정보
 */
export const fetchUserInfo = async () => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // JWT 토큰에서 사용자 ID 추출
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('잘못된 JWT 토큰 형식입니다.');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.sub; // JWT의 sub 필드에서 사용자 ID 추출
    
    console.log('JWT에서 추출한 사용자 ID:', userId);

    // 사용자 ID로 사용자 정보 가져오기
    const response = await fetch(`${AUTH_API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`사용자 정보 요청 실패: ${response.status}`);
    }

    const userData = await response.json();
    console.log('API에서 가져온 사용자 정보:', userData);
    
    // 사용자 정보를 localStorage에 저장
    localStorage.setItem('userInfo', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  }
};

/**
 * localStorage에서 현재 사용자 정보를 가져옵니다 (동기 함수).
 * @returns {object|null} 사용자 정보
 */
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    const authToken = getAuthToken();
    
    // 토큰이 없으면 로그인하지 않은 상태
    if (!authToken) {
      return null;
    }
    
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return null;
  }
};

/**
 * 사용자가 로그인되어 있는지 확인합니다.
 * @returns {boolean} 로그인 상태
 */
export const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  return !!authToken;
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
    const response = await fetch(`/api/list/family-photos?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('카드 이미지 요청 실패');
    }
    const data = await response.json();
    
    // 백엔드 응답 형식에 맞게 처리
    // { "user_id": "string", "photos": [{ "id": 0, "file_url": "https://example.com/" }] }
    if (data && Array.isArray(data.photos)) {
      return data.photos.map(photo => ({ src: photo.file_url, matched: false }));
    } else {
      console.warn('예상과 다른 응답 형식:', data);
      return [];
    }
  } catch (error) {
    console.error("카드 이미지 로딩 중 오류 발생:", error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

/**
 * 카드게임 결과를 서버에 저장합니다.
 * @param {object} resultData - 저장할 카드게임 결과 데이터
 * @returns {Promise<object>} 저장 결과
 * 
 * 엔드포인트: ${CARD_GAME_BASE_URL}/records
 * 요청 형식: JSON
 * 응답 형식: { success: boolean, message: string, result_id: string }
 */
export const saveGameResult = async (resultData) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${CARD_GAME_BASE_URL}/games/records`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resultData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`카드게임 결과 저장 실패: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('카드게임 결과 저장 시간 초과');
    }
    console.error("카드게임 결과 저장 실패:", error);
    throw error;
  }
};

/**
 * 보호자 대시보드용 API 함수들
 * TODO: 실제 백엔드 API와 연결 시 구현
 */

/**
 * 보호자용 카드게임 결과 목록을 가져옵니다.
 * @param {string} userId - 보호자 사용자 ID
 * @param {number} limit - 조회할 결과 수 (기본값: 10)
 * @param {number} offset - 건너뛸 결과 수 (기본값: 0)
 * @returns {Promise<object>} 카드게임 결과 데이터
 * 
 * 엔드포인트: ${CARD_GAME_BASE_URL}/list?user_id=${userId}&limit=${limit}&offset=${offset}
 * 응답 형식: { user_id: string, count: number, results: Array }
 */
export const fetchCaregiverGameResults = async (userId, limit = 10, offset = 0) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${CARD_GAME_BASE_URL}/games/list?user_id=${userId}&limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`카드게임 결과 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    const transformedResults = data.results.map(result => ({
      id: result.id,
      title: `카드게임 (${result.difficulty})`,
      date: new Date().toISOString().split('T')[0], // 백엔드에서 created_at이 없으므로 현재 날짜 사용
      score: result.score,
      time: `${Math.floor(result.duration_seconds / 60)}분 ${result.duration_seconds % 60}초`,
      difficulty: result.difficulty,
      status: 'completed',
      attempts: result.attempts,
      matches: result.matches
    }));
    
    // 백엔드 응답 형식과 동일하게 반환
    return {
      user_id: data.user_id,
      count: data.count,
      results: transformedResults
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('카드게임 결과 조회 시간 초과');
    }
    console.error('카드게임 결과 조회 실패:', error);
    return {
      user_id: userId,
      count: 0,
      results: []
    };
  }
};

/**
 * 가족 사진 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 가족 사진 목록
 * 
 * 엔드포인트: ${AUTH_API_BASE_URL}/family-photos?user_id=${userId}
 * 응답 형식: [{ id, name, date, image_url }]
 */
export const fetchFamilyPhotos = async (userId) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${CARD_GAME_BASE_URL}/list/family-photos?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`가족 사진 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('백엔드 응답 데이터:', data); // 디버깅용 로그
    
    // 데이터 형태 확인 및 안전한 처리
    let photosArray = [];
    
    if (Array.isArray(data)) {
      // 직접 배열인 경우
      photosArray = data;
    } else if (data && Array.isArray(data.photos)) {
      // { photos: [...] } 형태인 경우
      photosArray = data.photos;
    } else if (data && Array.isArray(data.data)) {
      // { data: [...] } 형태인 경우
      photosArray = data.data;
    } else if (data && Array.isArray(data.results)) {
      // { results: [...] } 형태인 경우
      photosArray = data.results;
    } else {
      console.warn('예상하지 못한 데이터 형태:', data);
      return [];
    }
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return photosArray.map(photo => ({
      id: photo.id,
      name: photo.name || photo.file_name || 'Unknown',
      date: photo.created_at ? new Date(photo.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      image: photo.file_url || photo.image_url
    }));
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('가족 사진 조회 시간 초과');
    }
    console.error('가족 사진 조회 실패:', error);
    return [];
  }
};

/**
 * 가족 사진을 서버에 업로드합니다.
 * @param {File} file - 업로드할 파일
 * @param {string} userId - 사용자 ID
 * @returns {Promise<object>} 업로드 결과
 * 
 * 엔드포인트: ${AUTH_API_BASE_URL}/family-photos
 * 요청 형식: FormData with file and user_id
 * 응답 형식: { message: string, photo_id: string, file_url: string }
 */
export const uploadFamilyPhoto = async (file, userId) => {
  try {
    console.log('=== 업로드 시작 ===');
    console.log('파일 정보:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });
    console.log('사용자 ID:', userId);
    console.log('API URL:', `${CARD_GAME_BASE_URL}/upload/family-photos`);
    console.log('인증 토큰:', getAuthToken() ? '존재함' : '없음');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    // FormData 내용 확인
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    const response = await fetch(`${CARD_GAME_BASE_URL}/upload/family-photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData
    });

    console.log('=== 서버 응답 ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `업로드 실패: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('서버 에러 응답:', errorData);
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (parseError) {
        console.error('에러 응답 파싱 실패:', parseError);
        const errorText = await response.text();
        console.error('에러 응답 텍스트:', errorText);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('업로드 성공 응답:', result);
    
    return {
      success: true,
      message: result.message,
      photo_id: result.photo_id,
      file_url: result.file_url
    };
  } catch (error) {
    console.error('=== 업로드 오류 상세 ===');
    console.error('에러 타입:', error.name);
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
    throw error;
  }
};

