import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlus, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { logoutUser, uploadFamilyPhoto, fetchFamilyPhotos, getCurrentUser, fetchCaregiverGameResults } from '../../services/api';
import FamilyHeader from '../../components/FamilyHeader';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const loadCurrentUser = () => {
      try {
        const user = getCurrentUser();
        if (user) {
          // guardian 역할인지 확인
          if (user.role === 'guardian') {
            setCurrentUser(user);
            console.log('현재 guardian 사용자:', user);
          } else {
            console.log('guardian이 아닌 사용자, 홈으로 리다이렉트');
            navigate('/');
            return;
          }
        } else {
          // 로그인되지 않은 경우 홈으로 리다이렉트
          console.log('로그인되지 않음, 홈으로 리다이렉트');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
        navigate('/');
        return;
      } finally {
        setLoadingUser(false);
      }
    };

    loadCurrentUser();
  }, [navigate]);

  // 게임 결과 불러오기
  useEffect(() => {
    if (!currentUser) return;

    const loadGameResults = async () => {
      setLoadingResults(true);
      try {
        const offset = (currentPage - 1) * resultsPerPage;
        const data = await fetchCaregiverGameResults(currentUser.id || currentUser.user_id, resultsPerPage, offset);
        setGameResults(data.results);
        setTotalResults(data.count);
      } catch (error) {
        console.error('게임 결과 로딩 실패:', error);
        setGameResults([]);
        setTotalResults(0);
      } finally {
        setLoadingResults(false);
      }
    };

    loadGameResults();
  }, [currentUser, currentPage, resultsPerPage]);

  // 가족 사진 불러오기 함수
  const loadFamilyPhotos = async () => {
    if (!currentUser) return;
    
    setLoadingPhotos(true);
    try {
      const userId = currentUser.id || currentUser.user_id;
      console.log('가족 사진 로딩 시작, 사용자 ID:', userId);
      
      const photos = await fetchFamilyPhotos(userId);
      
      // 응답 데이터 확인
      if (Array.isArray(photos)) {
        console.log('가족 사진 로딩 성공:', photos.length, '개의 사진');
        setFamilyPhotos(photos);
      } else {
        console.warn('가족 사진 응답이 배열이 아닙니다:', photos);
        setFamilyPhotos([]);
      }
    } catch (error) {
      console.error('가족 사진 로딩 실패:', error);
      // 에러 발생 시 빈 배열로 설정하고 사용자에게 알림
      setFamilyPhotos([]);
      
      // 네트워크 에러가 아닌 경우에만 알림 표시 (사용자 경험 개선)
      if (!error.message.includes('시간 초과') && !error.message.includes('Failed to fetch')) {
        console.error('가족 사진을 불러오는 중 문제가 발생했습니다:', error.message);
      }
    } finally {
      setLoadingPhotos(false);
    }
  };

  // 가족 사진 불러오기
  useEffect(() => {
    if (currentUser) {
      loadFamilyPhotos();
    }
  }, [currentUser]);

  // 실제 백엔드 API와 연결된 파일 업로드 처리
  const handleFileUpload = async (event) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 사용자 ID 확인 및 로깅
    const userId = currentUser.id || currentUser.user_id;
    if (!userId) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    console.log('파일 업로드 시작 - 사용자 정보:', {
      currentUser: currentUser,
      userId: userId
    });

    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // 파일 검증
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    for (const file of files) {
      console.log(`파일 검증: ${file.name}`, {
        size: file.size,
        type: file.type,
        sizeMB: (file.size / 1024 / 1024).toFixed(2)
      });
      
      if (file.size > maxFileSize) {
        alert(`파일 "${file.name}"이 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`파일 "${file.name}"의 형식이 지원되지 않습니다. JPG, PNG 파일만 업로드 가능합니다.`);
        return;
      }
    }
    
    setUploading(true);
    
    try {
      for (const file of files) {
        console.log(`파일 업로드 중: ${file.name}, 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        
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
          if (result.message && result.message.includes('이미 업로드된 파일')) {
            console.log(result.message);
            alert(`파일 "${file.name}"은 이미 업로드된 파일입니다.`);
          } else {
            console.log('파일 업로드 성공:', result.message);
            alert(`파일 "${file.name}" 업로드가 완료되었습니다.`);
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
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of files) {
        const result = await uploadFamilyPhoto(file, currentUser.id || currentUser.user_id);
        
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
          if (result.message && result.message.includes('이미 업로드된 파일')) {
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

<<<<<<< HEAD
  const handleLogout = () => {
    logoutUser();
    navigate('/');
=======
  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      try {
        await logoutUser();
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 중 오류:', error);
        navigate('/login');
      }
    }
>>>>>>> origin/main
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 로딩 중이거나 사용자 정보가 없으면 로딩 표시
  if (loadingUser || !currentUser) {
    return (
      <div className="card-dashboard">
        <div className="card-dashboard-loading">
          <div className="card-dashboard-loading-spinner"></div>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dashboard">
      <FamilyHeader 
        onBackClick={handleBackToHome}
      />

      <div className="card-dashboard-content">
        {/* 왼쪽 사이드바 */}
        <aside className="card-dashboard-sidebar">
          {/* 가족 사진 업로드 */}
          <section className="card-dashboard-upload-section">
            <h2 className="card-dashboard-section-title">가족 사진 업로드</h2>
            <div 
              className="card-dashboard-upload-area"
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
              <label htmlFor="file-upload" className="card-dashboard-upload-label">
                {uploading ? (
                  <>
                    <div className="card-dashboard-upload-spinner"></div>
                    <p className="card-dashboard-upload-text">업로드 중...</p>
                  </>
                ) : (
                  <>
                    <FiUpload className="card-dashboard-upload-icon" />
                    <p className="card-dashboard-upload-text">사진을 드래그하거나 클릭하여 업로드</p>
                    <p className="card-dashboard-upload-hint">JPG, PNG 파일만 지원</p>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* 최근 업로드 */}
          <section className="card-dashboard-recent-uploads">
            <h3 className="card-dashboard-section-subtitle">최근 업로드</h3>
            <div className="card-dashboard-upload-list">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.slice(0, 3).map((item) => (
                  <div key={item.id} className="card-dashboard-upload-item">
                    <div className="card-dashboard-upload-thumbnail">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="card-dashboard-upload-info">
                      <p className="card-dashboard-upload-name">{item.name}</p>
                      <p className="card-dashboard-upload-date">{item.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="card-dashboard-no-uploads">아직 업로드된 사진이 없습니다.</p>
              )}
            </div>
          </section>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="card-dashboard-main-content">
          {/* 가족 사진 갤러리 */}
          <section className="card-dashboard-gallery-section">
            <h2 className="card-dashboard-section-title">가족 사진 갤러리</h2>
            <div className="card-dashboard-photo-grid">
              {loadingPhotos ? (
                <div className="card-dashboard-loading-photos">
                  <div className="card-dashboard-loading-spinner"></div>
                  <p>사진을 불러오는 중...</p>
                </div>
              ) : familyPhotos.length === 0 ? (
                <div className="card-dashboard-no-photos">
                  <p>아직 업로드된 사진이 없습니다.</p>
                  <p>왼쪽 사이드바에서 사진을 업로드해보세요.</p>
                </div>
              ) : (
                <>
                  {familyPhotos.map((photo) => (
                    <div key={photo.id} className="card-dashboard-photo-item">
                      <div className="card-dashboard-photo-container">
                        <img src={photo.image} alt={photo.name} />
                      </div>
                      <p className="card-dashboard-photo-name">{photo.name}</p>
                      <p className="card-dashboard-photo-date">{photo.date}</p>
                    </div>
                  ))}
                  <div className="card-dashboard-photo-item add-photo">
                    <div className="card-dashboard-photo-container">
                      <FiPlus className="card-dashboard-add-icon" />
                    </div>
                    <p className="card-dashboard-add-text">사진 추가</p>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 */}
        <aside className="card-dashboard-results-sidebar">
          {/* 게임 결과 */}
          <section className="card-dashboard-game-results">
            <h2 className="card-dashboard-section-title">게임 결과</h2>
            <div className="card-dashboard-results-list">
              {loadingResults ? (
                <div className="card-dashboard-loading-results">
                  <div className="card-dashboard-loading-spinner"></div>
                  <p>게임 결과를 불러오는 중...</p>
                </div>
              ) : gameResults.length === 0 ? (
                <div className="card-dashboard-no-results">
                  <p>아직 게임 결과가 없습니다.</p>
                </div>
              ) : (
                gameResults.map((result) => (
                <div key={result.id} className="card-dashboard-result-item">
                  <div className="card-dashboard-result-header">
                    <h3 className="card-dashboard-result-title">{result.title}</h3>
                    <div 
                      className="card-dashboard-status-indicator"
                      style={{ backgroundColor: getStatusColor(result.status) }}
                    ></div>
                  </div>
                  <p className="card-dashboard-result-date">{result.date}</p>
                  
                  <div className="card-dashboard-result-stats">
                    <div className="card-dashboard-stat-item">
                      <span className="card-dashboard-stat-label">점수</span>
                      <span className="card-dashboard-stat-value">
                        {result.score ? `${result.score}점` : '미완료'}
                      </span>
                    </div>
                    <div className="card-dashboard-stat-item">
                      <span className="card-dashboard-stat-label">소요시간</span>
                      <span className="card-dashboard-stat-value">{result.time}</span>
                    </div>
                    <div className="card-dashboard-stat-item">
                      <span className="card-dashboard-stat-label">난이도</span>
                      <span 
                        className="card-dashboard-difficulty-badge"
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
              <div className="card-dashboard-pagination">
                <button 
                  className="card-dashboard-pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <span className="card-dashboard-pagination-info">
                  {currentPage} / {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <button 
                  className="card-dashboard-pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={gameResults.length < resultsPerPage}
                >
                  다음
                </button>
              </div>
            )}
          </section>

          {/* 이번 주 통계 */}
          <section className="card-dashboard-weekly-stats">
            <h3 className="card-dashboard-stats-title">이번 주 통계</h3>
            <div className="card-dashboard-stats-grid">
              <div className="card-dashboard-stat-card">
                <span className="card-dashboard-stat-number">{gameResults.length}</span>
                <span className="card-dashboard-stat-label">게임 완료</span>
              </div>
              <div className="card-dashboard-stat-card">
                <span className="card-dashboard-stat-number">
                  {gameResults.length > 0 
                    ? Math.round(gameResults.reduce((sum, result) => sum + (result.score || 0), 0) / gameResults.length)
                    : 0
                  }
                </span>
                <span className="card-dashboard-stat-label">평균 점수</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CardGameDashboard; 