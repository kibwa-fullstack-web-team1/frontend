import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FamilyHeader from '../../components/FamilyHeader';
import './DailyQuestionDashboard.css';

const DailyQuestionDashboard = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 샘플 데이터 (fallback용)
  const sampleDailyQuestions = [
    {
      id: 1,
      title: '오늘 하루 이야기',
      date: '2024년 1월 15일',
      duration: '12분 30초',
      keywords: ['가족', '음식', '산책', '봄'],
      preview: '오늘은 정말 좋은 하루였어요. 아침에 일어나서 창문을 열었는데 햇살이 너무 따뜻했어요. 그래서 기분이 좋아졌죠. 점심에는 딸이 만들어준 김치찌개를 먹었는데 정말 맛있었어요. 어릴...',
      status: 'active'
    },
    {
      id: 2,
      title: '병원 다녀온 이야기',
      date: '2024년 1월 14일',
      duration: '8분 45초',
      keywords: ['건강', '병원', '검진'],
      preview: '오늘은 정기검진을 받으러 병원에 다녀왔어요. 의사선생님이 건강상태가 많이 좋아졌다고 하시더라고요. 혈압도 정상이고 당뇨 수치도 안정적이래요. 정말 다행이에요. 그동안 약을 꾸준히...',
      status: 'active'
    },
    {
      id: 3,
      title: '손자와의 통화',
      date: '2024년 1월 13일',
      duration: '15분 20초',
      keywords: ['가족', '손자', '학교', '요리'],
      preview: '오늘 손자가 전화를 걸어왔어요. 학교에서 있었던 일들을 이야기해주더라고요. 수학 시험에서 100점을 받았다고 자랑하는데 정말 기특했어요. 그리고 다음 주에 놀러 온다고 하니까 너무...',
      status: 'active'
    },
    {
      id: 4,
      title: '옛날 생각',
      date: '2024년 1월 12일',
      duration: '20분 10초',
      keywords: ['추억', '가족', '여행', '시간'],
      preview: '오늘은 왠지 옛날 생각이 많이 났어요. 젊었을 때 남편과 함께 여행 갔던 기억들이요. 제주도에 신혼여행 갔을 때가 생각나네요. 그때는 정말 행복했는데... 지금도 행복하지만 그때와...',
      status: 'inactive'
    }
  ];

  // API 호출 함수
  useEffect(() => {
    const fetchDailyQuestions = async () => {
      try {
        setLoading(true);
        // API 엔드포인트 - WeeklyReportPage와 유사한 구조
        const response = await fetch('/notifications-api/notifications/daily-questions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyQuestions(data);
      } catch (error) {
        setError(error);
        console.error("Failed to fetch daily questions:", error);
        // 에러 발생 시 샘플 데이터 사용
        setDailyQuestions(sampleDailyQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyQuestions();
  }, []);

  // 점수 분류 함수 (WeeklyReportPage에서 가져옴)
  const getScoreCategory = (score) => {
    if (score >= 80) {
      return { category: '좋음', color: '#22C55E' };
    } else if (score >= 50) {
      return { category: '보통', color: '#F59E0B' };
    } else {
      return { category: '개선 필요', color: '#EF4444' };
    }
  };

  // 질문 클릭 핸들러
  const handleQuestionClick = (questionId) => {
    navigate(`/daily-questions/${questionId}`);
  };

  // 뒤로 가기 핸들러
  const handleBackToHome = () => {
    navigate('/');
  };

  const dates = [
    { date: '2024-01-15', label: '2024년 1월 15일', active: true },
    { date: '2024-01-14', label: '2024년 1월 14일', active: false },
    { date: '2024-01-13', label: '2024년 1월 13일', active: false },
    { date: '2024-01-12', label: '2024년 1월 12일', active: false }
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#22C55E' : '#F59E0B';
  };

  // 검색 필터링 함수
  const filteredQuestions = dailyQuestions.filter(question => {
    const searchLower = searchQuery.toLowerCase();
    return (
      question.title?.toLowerCase().includes(searchLower) ||
      question.preview?.toLowerCase().includes(searchLower) ||
      question.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  // 로딩 상태
  if (loading) {
    return (
      <div className="dq-app">
        <div className="dq-loading-container">
          <div className="dq-loading-spinner">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L22.09 8.26L30 9L22.09 9.74L20 16L17.91 9.74L10 9L17.91 8.26L20 2Z" fill="#171412"/>
            </svg>
          </div>
          <p className="dq-loading-text">일일 질문 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && dailyQuestions.length === 0) {
    return (
      <div className="dq-app">
        <div className="dq-error-container">
          <div className="dq-error-icon">⚠️</div>
          <h2 className="dq-error-title">데이터 로딩 실패</h2>
          <p className="dq-error-message">
            일일 질문 데이터를 불러오는데 실패했습니다: {error.message}
          </p>
          <button 
            className="dq-retry-button"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dq-app">
      {/* FamilyHeader 사용 */}
      <FamilyHeader 
        onBackClick={handleBackToHome}
      />

      <div className="dq-main-container">
        {/* 왼쪽 사이드바 */}
        <aside className="dq-sidebar">
          <h2 className="dq-sidebar-title">날짜별 조회</h2>
          
          <div className="dq-date-list">
            {dates.map((dateItem) => (
              <button
                key={dateItem.date}
                className={`dq-date-item ${dateItem.active ? 'dq-date-item--active' : ''}`}
                onClick={() => handleDateSelect(dateItem.date)}
              >
                {dateItem.label}
              </button>
            ))}
          </div>

          <div className="dq-search-section">
            <h3 className="dq-search-title">검색</h3>
            <div className="dq-search-input-container">
              <input
                type="text"
                className="dq-search-input"
                placeholder="제목, 내용, 키워드로 검색..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="dq-search-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="#000000" strokeWidth="2"/>
                  <path d="M14 14L17 17" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="dq-main-content">
          <div className="dq-content-header">
            <h2 className="dq-content-title">음성 기록 조회</h2>
            <p className="dq-content-description">
              선택한 날짜의 음성 기록을 텍스트로 확인하세요
            </p>
          </div>

          {/* 에러 알림 (데이터는 있지만 API 에러가 있는 경우) */}
          {error && dailyQuestions.length > 0 && (
            <div className="dq-error-banner">
              <div className="dq-error-banner-content">
                <span className="dq-error-banner-icon">⚠️</span>
                <span className="dq-error-banner-text">
                  API 연결에 문제가 있어 샘플 데이터를 표시하고 있습니다.
                </span>
              </div>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {filteredQuestions.length === 0 ? (
            <div className="dq-empty-state">
              <div className="dq-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="dq-empty-title">검색 결과가 없습니다</h3>
              <p className="dq-empty-description">
                다른 키워드로 검색해보세요.
              </p>
            </div>
          ) : (
            <div className="dq-questions-grid">
              {filteredQuestions.map((question) => (
                <div 
                  key={question.id} 
                  className="dq-question-card"
                  onClick={() => handleQuestionClick(question.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dq-question-header">
                    <h3 className="dq-question-title">{question.title}</h3>
                    <div className="dq-question-date">{question.date}</div>
                  </div>

                  <div className="dq-question-status">
                    <div 
                      className="dq-status-dot" 
                      style={{ backgroundColor: getStatusColor(question.status) }}
                    ></div>
                  </div>

                  <div className="dq-question-details">
                    <div className="dq-detail-item">
                      <span className="dq-detail-label">재생 시간</span>
                      <span className="dq-detail-value">{question.duration}</span>
                    </div>

                    {/* 점수 표시 (API에서 점수 데이터가 있는 경우) */}
                    {question.cognitive_score && (
                      <div className="dq-detail-item">
                        <span className="dq-detail-label">인지 점수</span>
                        <span className="dq-detail-value">
                          {question.cognitive_score}
                          <span 
                            className="dq-score-category"
                            style={{ color: getScoreCategory(parseFloat(question.cognitive_score)).color }}
                          >
                            ({getScoreCategory(parseFloat(question.cognitive_score)).category})
                          </span>
                        </span>
                      </div>
                    )}

                    {question.semantic_score && (
                      <div className="dq-detail-item">
                        <span className="dq-detail-label">의미 점수</span>
                        <span className="dq-detail-value">
                          {question.semantic_score}
                          <span 
                            className="dq-score-category"
                            style={{ color: getScoreCategory(parseFloat(question.semantic_score)).color }}
                          >
                            ({getScoreCategory(parseFloat(question.semantic_score)).category})
                          </span>
                        </span>
                      </div>
                    )}

                    <div className="dq-detail-item">
                      <span className="dq-detail-label">키워드</span>
                      <div className="dq-keywords">
                        {question.keywords?.map((keyword, index) => (
                          <span key={index} className="dq-keyword-tag">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="dq-detail-item">
                      <span className="dq-detail-label">내용 미리보기</span>
                      <p className="dq-content-preview">{question.preview}</p>
                    </div>
                  </div>

                  <button 
                    className="dq-view-full-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestionClick(question.id);
                    }}
                  >
                    전체 내용 보기
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DailyQuestionDashboard;
