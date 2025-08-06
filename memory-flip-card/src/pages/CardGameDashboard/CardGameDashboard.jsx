import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlus, FiArrowLeft, FiLogOut, FiEdit } from 'react-icons/fi';
import { logoutUser, uploadFamilyPhoto, fetchFamilyPhotos, getCurrentUser, fetchCaregiverGameResults } from '../../services/api';
import './CardGameDashboard.css';

const CardGameDashboard = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [familyPhotos, setFamilyPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  // 임시로 user2 사용 (실제로는 로그인한 사용자 정보 사용)
  const userId = 'user2';

  // 게임 결과 불러오기
  useEffect(() => {
    const loadGameResults = async () => {
      setLoadingResults(true);
      try {
        const offset = (currentPage - 1) * resultsPerPage;
        const data = await fetchCaregiverGameResults(userId, resultsPerPage, offset);
        setGameResults(data.results);
        setTotalResults(data.count);
      } catch (error) {
        console.error('게임 결과 로딩 실패:', error);
      } finally {
        setLoadingResults(false);
      }
    };

    loadGameResults();
  }, [userId, currentPage, resultsPerPage]);

  // 가족 사진 불러오기 함수
  const loadFamilyPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const photos = await fetchFamilyPhotos(userId);
      setFamilyPhotos(photos);
    } catch (error) {
      console.error('가족 사진 로딩 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      setFamilyPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  // 가족 사진 불러오기
  useEffect(() => {
    loadFamilyPhotos();
  }, [userId]);

  // TODO: 실제 백엔드 API에서 받아올 최근 업로드 데이터
  // 현재는 임시 데이터 (실제로는 API 호출로 가져옴)
  const recentUploads = [
    {
      id: 1,
      name: '가족여행.jpg',
      date: '2024-01-15',
      image: '/images/family-trip.jpg'
    },
    {
      id: 2,
      name: '생일파티.jpg',
      date: '2024-01-10',
      image: '/images/birthday-party.jpg'
    },
    {
      id: 3,
      name: '할머니와함께.jpg',
      date: '2024-01-05',
      image: '/images/with-grandma.jpg'
    }
  ];

  // 실제 백엔드 API와 연결된 파일 업로드 처리
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of files) {
        const result = await uploadFamilyPhoto(file, userId);
        
        if (result.success) {
          // 업로드 성공 시 로컬 상태에 추가
          const newFile = {
            id: result.photo_id,
            name: file.name,
            date: new Date().toISOString().split('T')[0],
            image: result.file_url
          };
          setUploadedFiles(prev => [newFile, ...prev]);
          
          // 중복 파일 메시지 표시
          if (result.message.includes('이미 업로드된 파일')) {
            console.log(result.message);
            // 사용자에게 중복 파일 알림 (선택사항)
            // alert(result.message);
          } else {
            console.log('파일 업로드 성공:', result.message);
          }
        }
      }
      
      // 업로드 완료 후 갤러리 새로고침
      await loadFamilyPhotos();
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 실제 백엔드 API와 연결된 드래그 앤 드롭 파일 업로드 처리
  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of files) {
        const result = await uploadFamilyPhoto(file, userId);
        
        if (result.success) {
          // 업로드 성공 시 로컬 상태에 추가
          const newFile = {
            id: result.photo_id,
            name: file.name,
            date: new Date().toISOString().split('T')[0],
            image: result.file_url
          };
          setUploadedFiles(prev => [newFile, ...prev]);
          
          // 중복 파일 메시지 표시
          if (result.message.includes('이미 업로드된 파일')) {
            console.log(result.message);
            // 사용자에게 중복 파일 알림 (선택사항)
            // alert(result.message);
          } else {
            console.log('파일 업로드 성공:', result.message);
          }
        }
      }
      
      // 업로드 완료 후 갤러리 새로고침
      await loadFamilyPhotos();
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '쉬움':
        return '#22C55E';
      case '보통':
        return '#F59E0B';
      case '어려움':
        return '#EF4444';
      default:
        return '#22C55E';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#22C55E';
      case 'incomplete':
        return '#EF4444';
      default:
        return '#22C55E';
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleStoryRegistration = () => {
    navigate('/story-game-dashboard');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="caregiver-dashboard">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">
              <FiArrowLeft />
            </div>
          </div>
          <div className="header-text">
            <h1 className="main-title">기억의 정원</h1>
            <p className="subtitle">보호자 대시보드</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="profile-avatar">김</div>
            <div className="profile-info">
              <span className="user-name">김보호자님</span>
              <span className="user-role">보호자</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* 왼쪽 사이드바 */}
        <aside className="sidebar">
          {/* 가족 사진 업로드 */}
          <section className="upload-section">
            <h2 className="section-title">가족 사진 업로드</h2>
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-label">
                {uploading ? (
                  <>
                    <div className="upload-spinner"></div>
                    <p className="upload-text">업로드 중...</p>
                  </>
                ) : (
                  <>
                    <FiUpload className="upload-icon" />
                    <p className="upload-text">사진을 드래그하거나 클릭하여 업로드</p>
                    <p className="upload-hint">JPG, PNG 파일만 지원</p>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* 최근 업로드 */}
          <section className="recent-uploads">
            <h3 className="section-subtitle">최근 업로드</h3>
            <div className="upload-list">
              {recentUploads.map((item) => (
                <div key={item.id} className="upload-item">
                  <div className="upload-thumbnail">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="upload-info">
                    <p className="upload-name">{item.name}</p>
                    <p className="upload-date">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 이야기 등록 */}
          <section className="story-registration-section">
            <h3 className="section-subtitle">이야기 관리</h3>
            <button className="story-registration-button" onClick={handleStoryRegistration}>
              <FiEdit size={16} />
              <span>이야기 등록</span>
            </button>
          </section>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          {/* 가족 사진 갤러리 */}
          <section className="gallery-section">
            <h2 className="section-title">가족 사진 갤러리</h2>
            <div className="photo-grid">
              {loadingPhotos ? (
                <div className="loading-photos">
                  <div className="loading-spinner"></div>
                  <p>사진을 불러오는 중...</p>
                </div>
              ) : familyPhotos.length === 0 ? (
                <div className="no-photos">
                  <p>아직 업로드된 사진이 없습니다.</p>
                  <p>왼쪽 사이드바에서 사진을 업로드해보세요.</p>
                </div>
              ) : (
                <>
                  {familyPhotos.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <div className="photo-container">
                        <img src={photo.image} alt={photo.name} />
                      </div>
                      <p className="photo-name">{photo.name}</p>
                      <p className="photo-date">{photo.date}</p>
                    </div>
                  ))}
                  <div className="photo-item add-photo">
                    <div className="photo-container">
                      <FiPlus className="add-icon" />
                    </div>
                    <p className="add-text">사진 추가</p>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 */}
        <aside className="results-sidebar">
          {/* 게임 결과 */}
          <section className="game-results">
            <h2 className="section-title">게임 결과</h2>
            <div className="results-list">
              {loadingResults ? (
                <div className="loading-results">
                  <div className="loading-spinner"></div>
                  <p>게임 결과를 불러오는 중...</p>
                </div>
              ) : gameResults.length === 0 ? (
                <div className="no-results">
                  <p>아직 게임 결과가 없습니다.</p>
                </div>
              ) : (
                gameResults.map((result) => (
                <div key={result.id} className="result-item">
                  <div className="result-header">
                    <h3 className="result-title">{result.title}</h3>
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(result.status) }}
                    ></div>
                  </div>
                  <p className="result-date">{result.date}</p>
                  
                  <div className="result-stats">
                    <div className="stat-item">
                      <span className="stat-label">점수</span>
                      <span className="stat-value">
                        {result.score ? `${result.score}점` : '미완료'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">소요시간</span>
                      <span className="stat-value">{result.time}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">난이도</span>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(result.difficulty) }}
                      >
                        {result.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
            
            {/* 페이지네이션 */}
            {!loadingResults && gameResults.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <span className="pagination-info">
                  {currentPage} / {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <button 
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={gameResults.length < resultsPerPage}
                >
                  다음
                </button>
              </div>
            )}
          </section>

          {/* 이번 주 통계 */}
          <section className="weekly-stats">
            <h3 className="stats-title">이번 주 통계</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">12</span>
                <span className="stat-label">게임 완료</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">78</span>
                <span className="stat-label">평균 점수</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CardGameDashboard; 