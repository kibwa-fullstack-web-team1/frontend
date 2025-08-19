// src/services/api.js

// 카드 게임 관련 API (기존 서버)
const CARD_GAME_BASE_URL = import.meta.env.VITE_CARD_GAME_BASE_URL || "http://13.251.163.144:8020";

// 로그인 관련 API (FastAPI 서버)
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:8000";

// Story Sequencer API (새로 추가)
const STORY_API_BASE_URL = import.meta.env.VITE_STORY_API_BASE_URL || "http://localhost:8011";

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

    console.log('로그인 요청 시작:', { email });
    console.log('API URL:', `${AUTH_API_BASE_URL}/auth/login`);

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
      console.error('로그인 실패 응답:', errorData);
      throw new Error(errorData.detail || errorData.message || `로그인 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('로그인 성공 응답:', data);

    // 백엔드 응답 형식에 맞게 처리
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      console.log('JWT 토큰 저장됨');

      // 백엔드에서 받은 사용자 정보 사용
      const userInfo = {
        id: data.user?.id || data.user_id || 'temp_' + Date.now(), // 백엔드에서 받은 실제 ID 사용
        email: email,
        role: data.user_role || 'senior',
        username: data.user?.username || email.split('@')[0], // 백엔드에서 받은 username 사용
        phone_number: data.user?.phone_number || null
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('설정된 사용자 정보:', userInfo);
    } else {
      throw new Error('토큰 정보가 응답에 없습니다.');
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
 * @returns {Promise<{access_token: string, user_role: string}>} - 회원가입 성공 시 토큰과 역할
 * 
 * 백엔드 API 엔드포인트: ${AUTH_API_BASE_URL}/auth/register
 * 요청 형식: { username, email, phone_number, password, role }
 * 응답 형식: { message, access_token, token_type, user_role }
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
      password: password,  // 평문 비밀번호 (백엔드에서 해시 처리)
      role: role === 'senior' ? 'senior' : role === 'family' ? 'guardian' : role
    };

    console.log('회원가입 요청 데이터:', requestData);
    console.log('API URL:', `${AUTH_API_BASE_URL}/auth/register`);

    const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
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
      console.error('회원가입 실패 응답:', errorData);
      throw new Error(errorData.detail || errorData.message || `회원가입 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('회원가입 성공 응답:', data);

    // 회원가입 성공 시 토큰 저장
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);

      // 사용자 정보 설정
      const userInfo = {
        id: 'temp_' + Date.now(), // 임시 ID (실제로는 JWT에서 추출)
        email: email,
        role: data.user_role || role,
        username: username,
        phone_number: phone
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
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
 * 로그아웃 처리
 * 
 * 백엔드 API 엔드포인트: ${AUTH_API_BASE_URL}/auth/logout
 * 요청 헤더: Authorization: Bearer {token}
 * 응답 형식: { message: string, success: boolean }
 */
export const logoutUser = async () => {
  try {
    const authToken = getAuthToken();

    if (authToken) {
      // 백엔드 로그아웃 API 호출
      const response = await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('백엔드 로그아웃 성공:', data);
      } else {
        console.warn('백엔드 로그아웃 실패:', response.status);
        // 백엔드 로그아웃 실패해도 프론트엔드 로그아웃은 진행
      }
    }
  } catch (error) {
    console.warn('백엔드 로그아웃 중 오류:', error);
    // 백엔드 오류가 있어도 프론트엔드 로그아웃은 진행
  } finally {
    // 로컬 스토리지 정리 (항상 실행)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    console.log('프론트엔드 로그아웃 완료');
  }
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

    console.log('사용자 정보 요청 시작');

    // 백엔드의 /auth/verify 엔드포인트 사용
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('사용자 정보 요청 실패:', errorData);
      throw new Error(errorData.detail || errorData.message || `사용자 정보 요청 실패: ${response.status}`);
    }

    const userData = await response.json();
    console.log('API에서 가져온 사용자 정보:', userData);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const transformedUserData = {
      id: userData.user_id,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active,
      // username과 phone_number는 백엔드에서 제공하지 않으므로 기본값 설정
      username: userData.email.split('@')[0], // 이메일에서 추출
      phone_number: null
    };

    // 사용자 정보를 localStorage에 저장
    localStorage.setItem('userInfo', JSON.stringify(transformedUserData));

    return transformedUserData;
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

// ===== 이야기 관련 API 함수들 =====

/**
 * 새로운 이야기를 등록합니다.
 * @param {object} storyData - 이야기 데이터 { title, content, category }
 * @returns {Promise<object>} 등록된 이야기 정보
 */
export const createStory = async (storyData) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: storyData.title,
        content: storyData.content,
        category: storyData.category
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `이야기 등록 실패: ${response.status}`);
    }

    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error('이야기 등록 실패:', error);
    throw error;
  }
};

/**
 * 사용자의 이야기 목록을 조회합니다.
 * @returns {Promise<Array>} 이야기 목록
 */
export const getStories = async () => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `이야기 목록 조회 실패: ${response.status}`);
    }

    const result = await response.json();
    return result.results || [];
  } catch (error) {
    console.error('이야기 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 이야기를 수정합니다.
 * @param {number} storyId - 이야기 ID
 * @param {object} storyData - 수정할 이야기 데이터
 * @returns {Promise<object>} 수정된 이야기 정보
 */
export const updateStory = async (storyId, storyData) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(storyData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `이야기 수정 실패: ${response.status}`);
    }

    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error('이야기 수정 실패:', error);
    throw error;
  }
};

/**
 * 특정 이야기를 삭제합니다.
 * @param {number} storyId - 이야기 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteStory = async (storyId) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `이야기 삭제 실패: ${response.status}`);
    }

    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error('이야기 삭제 실패:', error);
    throw error;
  }
};

