import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiEye, FiEdit, FiTrash2, FiPlay } from 'react-icons/fi';
import { logoutUser } from '../../services/api';
import './StoryGameDashboard.css';

const StoryGameDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });
  const [selectedStory, setSelectedStory] = useState(null);

  // 카테고리 옵션
  const categories = [
    { value: 'family', label: '가족' },
    { value: 'anniversary', label: '기념일' },
    { value: 'travel', label: '여행' },
    { value: 'daily', label: '일상' },
    { value: 'memory', label: '추억' }
  ];

  // 등록된 이야기 데이터
  const registeredStories = [
    {
      id: 1,
      title: '할머니와의 첫 만남',
      category: '가족',
      content: '할머니를 처음 만났을 때의 이야기입니다. 그때 할머니는 따뜻한 미소로 저를 맞아주셨어요.',
      status: 'published', // published, draft, private
      date: '2024-01-15'
    },
    {
      id: 2,
      title: '생일 파티 추억',
      category: '기념일',
      content: '할머니의 80번째 생일 파티를 준비했던 날의 이야기입니다. 온 가족이 모여서 축하해드렸어요.',
      status: 'draft', // published, draft, private
      date: '2024-01-10'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: 실제 백엔드 API와 연결 시 이야기 등록 API 호출
    console.log('이야기 등록:', formData);
    
    // 임시로 등록된 이야기 목록에 추가
    const newStory = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      content: formData.content,
      status: 'draft',
      date: new Date().toISOString().split('T')[0]
    };
    
    console.log('새 이야기 등록:', newStory);
    
    // 폼 초기화
    setFormData({
      title: '',
      category: '',
      content: ''
    });
    
    alert('이야기가 등록되었습니다!');
  };

  const handleStoryAction = (storyId, action) => {
    console.log(`이야기 ${action}:`, storyId);
    
    switch (action) {
      case 'preview':
        setSelectedStory(registeredStories.find(story => story.id === storyId));
        break;
      case 'edit':
        // TODO: 이야기 수정 모달 또는 페이지로 이동
        alert('이야기 수정 기능은 준비 중입니다.');
        break;
      case 'publish':
        // TODO: 이야기 게시 API 호출
        alert('이야기가 게시되었습니다.');
        break;
      case 'private':
        // TODO: 이야기 비공개 설정 API 호출
        alert('이야기가 비공개로 설정되었습니다.');
        break;
      case 'delete':
        if (window.confirm('정말로 이 이야기를 삭제하시겠습니까?')) {
          // TODO: 이야기 삭제 API 호출
          alert('이야기가 삭제되었습니다.');
        }
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#22C55E';
      case 'draft':
        return '#F59E0B';
      case 'private':
        return '#6B7280';
      default:
        return '#22C55E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return '게시됨';
      case 'draft':
        return '임시저장';
      case 'private':
        return '비공개';
      default:
        return '게시됨';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/card-game-dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="story-registration-page">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container" onClick={handleBackToDashboard}>
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
        {/* 왼쪽 사이드바 - 이야기 등록 */}
        <aside className="sidebar">
          <section className="story-registration">
            <h2 className="section-title">이야기 등록</h2>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="이야기 제목을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">카테고리</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.label}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">내용</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="이야기 내용을 입력하세요"
                  rows="8"
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                이야기 등록
              </button>
            </form>
          </section>
        </aside>

        {/* 메인 콘텐츠 - 등록된 이야기 */}
        <main className="main-content">
          <section className="registered-stories">
            <h2 className="section-title">등록된 이야기</h2>
            
            <div className="stories-list">
              {registeredStories.map((story) => (
                <div key={story.id} className="story-card">
                  <div className="story-header">
                    <h3 className="story-title">{story.title}</h3>
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(story.status) }}
                    ></div>
                  </div>
                  
                  <div className="story-meta">
                    <span className="story-date">{story.date}</span>
                    <span className="story-category">{story.category}</span>
                  </div>
                  
                  <p className="story-content">{story.content}</p>
                  
                  <div className="story-actions">
                    <button 
                      className="action-button preview"
                      onClick={() => handleStoryAction(story.id, 'preview')}
                    >
                      <FiEye size={14} />
                      미리보기
                    </button>
                    <button 
                      className="action-button edit"
                      onClick={() => handleStoryAction(story.id, 'edit')}
                    >
                      <FiEdit size={14} />
                      수정
                    </button>
                    {story.status === 'draft' ? (
                      <button 
                        className="action-button publish"
                        onClick={() => handleStoryAction(story.id, 'publish')}
                      >
                        <FiPlay size={14} />
                        게시
                      </button>
                    ) : (
                      <button 
                        className="action-button private"
                        onClick={() => handleStoryAction(story.id, 'private')}
                      >
                        비공개
                      </button>
                    )}
                    <button 
                      className="action-button delete"
                      onClick={() => handleStoryAction(story.id, 'delete')}
                    >
                      <FiTrash2 size={14} />
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 - 미리보기 */}
        <aside className="preview-sidebar">
          <section className="preview-section">
            <h3 className="preview-title">사용자 화면 미리보기</h3>
            
            <div className="preview-container">
              {selectedStory ? (
                <div className="story-preview">
                  <h4 className="preview-story-title">{selectedStory.title}</h4>
                  <p className="preview-story-content">{selectedStory.content}</p>
                  <div className="preview-story-meta">
                    <span className="preview-category">{selectedStory.category}</span>
                    <span className="preview-date">{selectedStory.date}</span>
                  </div>
                </div>
              ) : (
                <div className="preview-placeholder">
                  <div className="placeholder-icon">
                    <FiEye size={48} />
                  </div>
                  <p className="placeholder-text">
                    이야기를 선택하면<br />
                    미리보기가 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default StoryGameDashboard; 