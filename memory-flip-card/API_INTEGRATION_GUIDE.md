# API 통합 가이드

이 문서는 프론트엔드와 백엔드 API를 연결하기 위한 가이드입니다.

## 🔧 현재 상태

현재 프론트엔드는 임시 데이터와 모의 API 호출을 사용하고 있습니다. 실제 백엔드 API와 연결하려면 아래 단계를 따라주세요.

## 📋 구현된 기능들

### 1. 인증 시스템
- **로그인**: `/auth/login` (POST)
- **회원가입**: `/auth/signup` (POST)
- **로그아웃**: `/auth/logout` (POST)
- **사용자 정보**: `/auth/me` (GET)

### 2. 보호자 대시보드
- **게임 결과 조회**: `/caregiver/game-results` (GET)
- **가족 사진 조회**: `/family-photos` (GET)
- **사진 업로드**: `/upload/photo` (POST)
- **주간 통계**: `/caregiver/weekly-stats` (GET)

### 3. 게임 관련
- **카드 이미지**: `/list/cards` (GET)
- **게임 결과 저장**: `/games/records` (POST)

## 🔄 API 연결 단계

### 1단계: 환경 변수 설정

`.env.local` 파일에 백엔드 API URL을 설정하세요:

```env
# 인증 관련 API (FastAPI 서버)
VITE_AUTH_API_BASE_URL=http://your-backend-url:port

# 게임 관련 API (기존 서버)
VITE_GAME_API_BASE_URL=http://your-game-server:port

# API 타임아웃 (밀리초)
VITE_API_TIMEOUT=10000
```

### 2단계: API 함수 활성화

각 페이지에서 주석 처리된 실제 API 호출을 활성화하세요:

#### 로그인 페이지 (`LoginPage.jsx`)
```javascript
// 주석 해제:
const response = await loginUser(formData.email, formData.password);

// 주석 처리:
// 임시 로그인 로직...
```

#### 회원가입 페이지 (`SignupPage.jsx`)
```javascript
// 주석 해제:
const response = await signupUser(
  formData.email,
  formData.password,
  formData.nickname,
  formData.phone,
  formData.role
);

// 주석 처리:
// 임시 회원가입 로직...
```

#### 보호자 대시보드 (`CaregiverDashboard.jsx`)
```javascript
// 주석 해제:
const gameResults = await fetchCaregiverGameResults(userId);
const familyPhotos = await fetchFamilyPhotos(userId);
const weeklyStats = await fetchWeeklyStats(userId);

// 파일 업로드:
const uploadResult = await uploadFileToServer(file, userId);
```

### 3단계: API 응답 형식 확인

백엔드에서 다음 형식으로 응답해야 합니다:

#### 로그인 응답
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "nickname": "사용자명",
    "role": "caregiver" // 또는 "elderly"
  }
}
```

#### 회원가입 응답
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "nickname": "사용자명",
    "role": "caregiver"
  }
}
```

#### 게임 결과 응답
```json
[
  {
    "id": 1,
    "title": "추억의 퍼즐",
    "date": "2024-01-15",
    "score": 85,
    "time": "12분 30초",
    "difficulty": "쉬움",
    "status": "completed"
  }
]
```

#### 가족 사진 응답
```json
[
  {
    "id": 1,
    "name": "가족여행.jpg",
    "date": "2024-01-15",
    "image_url": "https://example.com/images/family-trip.jpg"
  }
]
```

## 🧪 테스트 방법

### 임시 로그인 테스트
현재 임시 로그인 시스템을 사용하여 테스트할 수 있습니다:

1. **보호자로 로그인**: 이메일에 'caregiver' 포함
   - 예: `caregiver@test.com`
   - 결과: 보호자 대시보드로 이동

2. **일반 사용자로 로그인**: 이메일에 'caregiver' 미포함
   - 예: `user@test.com`
   - 결과: 게임 선택 페이지로 이동

### 임시 회원가입 테스트
회원가입 시 역할을 선택하면 해당 역할로 가입됩니다:
- "보호자" 선택 → 로그인 시 보호자 대시보드로 이동
- "노약자" 선택 → 로그인 시 게임 선택 페이지로 이동

## 📝 TODO 목록

- [ ] 실제 백엔드 API 엔드포인트 연결
- [ ] 에러 처리 및 사용자 피드백 개선
- [ ] 로딩 상태 UI 개선
- [ ] 토큰 만료 처리
- [ ] 파일 업로드 진행률 표시
- [ ] 실시간 데이터 업데이트 (웹소켓)

## 🔍 디버깅

개발자 도구 콘솔에서 다음 정보를 확인할 수 있습니다:
- API 호출 로그
- 사용자 정보
- 에러 메시지
- 임시 데이터 구조

## 📞 지원

API 연결에 문제가 있거나 추가 기능이 필요한 경우, 해당 부분의 주석을 참고하여 백엔드 개발팀과 협의하세요. 