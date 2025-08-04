import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlus, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '../../services/api';
import './CardGameDashboard.css';

const CardGameDashboard = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // TODO: 실제 백엔드 API에서 받아올 게임 결과 데이터
  // 현재는 임시 데이터 (실제로는 API 호출로 가져옴)
  const gameResults = [
    {
      id: 1,
      title: '추억의 퍼즐',
      date: '2024-01-15',
      score: 85,
      time: '12분 30초',
      difficulty: '쉬움',
      status: 'completed'
    },
    {
      id: 2,
      title: '시간 여행자',
      date: '2024-01-14',
      score: 72,
      time: '25분 15초',
      difficulty: '보통',
      status: 'completed'
    },
    {
      id: 3,
      title: '기억의 미로',
      date: '2024-01-13',
      score: null,
      time: '중단됨',
      difficulty: '어려움',
      status: 'incomplete'
    },
    {
      id: 4,
      title: '감정의 정원',
      date: '2024-01-12',
      score: 95,
      time: '18분 45초',
      difficulty: '쉬움',
      status: 'completed'
    }
  ];

  // TODO: 실제 백엔드 API에서 받아올 가족 사진 데이터
  // 현재는 임시 데이터 (실제로는 API 호출로 가져옴)
  const familyPhotos = [
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

  // TODO: 실제 백엔드 API와 연결 시 파일 업로드 처리
  // 현재는 임시로 로컬 상태에만 저장 (실제로는 서버에 업로드)
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      date: new Date().toISOString().split('T')[0],
      file: file
    }));
    setUploadedFiles(prev => [...newFiles, ...prev]);
    
    // TODO: 실제 파일 업로드 API 호출
    // files.forEach(file => {
    //   uploadFileToServer(file);
    // });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // TODO: 실제 백엔드 API와 연결 시 드래그 앤 드롭 파일 업로드 처리
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      date: new Date().toISOString().split('T')[0],
      file: file
    }));
    setUploadedFiles(prev => [...newFiles, ...prev]);
    
    // TODO: 실제 파일 업로드 API 호출
    // files.forEach(file => {
    //   uploadFileToServer(file);
    // });
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
                <FiUpload className="upload-icon" />
                <p className="upload-text">사진을 드래그하거나 클릭하여 업로드</p>
                <p className="upload-hint">JPG, PNG 파일만 지원</p>
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
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 */}
        <aside className="results-sidebar">
          {/* 게임 결과 */}
          <section className="game-results">
            <h2 className="section-title">게임 결과</h2>
            <div className="results-list">
              {gameResults.map((result) => (
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
              ))}
            </div>
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