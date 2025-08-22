import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiEye, FiEdit, FiTrash2, FiPlay } from 'react-icons/fi';
import { logoutUser, createStory, getStories, updateStory, deleteStory, getCurrentUser } from '../../services/api';
import FamilyHeader from '../../components/FamilyHeader';
import './StoryGameDashboard.css';

// STORY API 기본 URL
const STORY_API_BASE_URL = 'http://localhost:8011';

const StoryGameDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: '' // UI용으로만 유지, API 호출시 제외
  });
  const [selectedStory, setSelectedStory] = useState(null);
  const [registeredStories, setRegisteredStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 카테고리 옵션
  const categories = [
    { value: 'family', label: '가족' },
    { value: 'anniversary', label: '기념일' },
    { value: 'travel', label: '여행' },
    { value: 'daily', label: '일상' },
    { value: 'memory', label: '추억' }
  ];

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const stories = await getStories();
        setRegisteredStories(stories);
      } catch (err) {
        setError(err);
        console.error('Error fetching stories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await createStory(formData);
      alert('이야기가 등록되었습니다!');
      // 등록 후 다시 데이터 로드
      const stories = await getStories();
      setRegisteredStories(stories);
      // 폼 초기화
      setFormData({
        title: '',
        category: '',
        content: ''
      });
    } catch (err) {
      setError(err);
      alert('이야기 등록 중 오류가 발생했습니다.');
      console.error('Error creating story:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryAction = async (storyId, action) => {
    console.log(`이야기 ${action}:`, storyId);
    
    setIsLoading(true);

    try {
      switch (action) {
        case 'preview':
          setSelectedStory(registeredStories.find(story => story.id === storyId));
          break;
        case 'edit':
          // TODO: 이야기 수정 모달 또는 페이지로 이동
          alert('이야기 수정 기능은 준비 중입니다.');
          break;
        case 'publish':
          await updateStory(storyId, { status: 'published' });
          alert('이야기가 게시되었습니다.');
          break;
        case 'private':
          await updateStory(storyId, { status: 'private' });
          alert('이야기가 비공개로 설정되었습니다.');
          break;
        case 'delete':
          if (window.confirm('정말로 이 이야기를 삭제하시겠습니까?')) {
            await deleteStory(storyId);
            alert('이야기가 삭제되었습니다.');
            // 삭제 후 다시 데이터 로드
            const stories = await getStories();
            setRegisteredStories(stories);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err);
      alert('이야기 작업 중 오류가 발생했습니다.');
      console.error('Error performing story action:', err);
    } finally {
      setIsLoading(false);
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
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error.message}</div>;
  }

  return (
    <div className="story-registration-page">
      <FamilyHeader 
        onBackClick={handleBackToDashboard}
      />

      <div className="story-dashboard-content">
        {/* 왼쪽 사이드바 - 이야기 등록 */}
        <aside className="story-sidebar">
          <section className="story-registration">
            <h2 className="story-section-title">이야기 등록</h2>
            
            <form onSubmit={handleSubmit} className="story-form">
              <div className="story-form-group">
                <label htmlFor="title" className="story-form-label">이야기 제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="story-form-input"
                  placeholder="이야기 제목을 입력하세요"
                  required
                />
              </div>

              <div className="story-form-group">
                <label htmlFor="content" className="story-form-label">이야기 내용</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="story-form-textarea"
                  placeholder="이야기 내용을 입력하세요"
                  rows="6"
                  required
                />
              </div>

              <div className="story-form-group">
                <label htmlFor="image_url" className="story-form-label">이미지 URL (선택사항)</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="story-form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="story-form-group">
                <label htmlFor="category" className="story-form-label">카테고리 (표시용)</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="story-form-select"
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="story-submit-button" disabled={isLoading}>
                {isLoading ? '등록 중...' : '이야기 등록'}
              </button>
            </form>
          </section>
        </aside>

        {/* 메인 콘텐츠 - 등록된 이야기 */}
        <main className="story-main-content">
          <section className="story-registered-stories">
            <h2 className="story-section-title">등록된 이야기</h2>
            
            {/* 에러 메시지 */}
            {error && (
              <div className="story-error-message">
                <p>❌ {error}</p>
                <button onClick={fetchStories} className="story-retry-button">
                  다시 시도
                </button>
              </div>
            )}
            
            {/* 로딩 상태 */}
            {isLoading && (
              <div className="story-loading">
                <p>📚 이야기를 불러오는 중...</p>
              </div>
            )}
            
            <div className="story-stories-list">
              {!isLoading && !error && registeredStories.length === 0 && (
                <div className="story-empty-state">
                  <p>📝 등록된 이야기가 없습니다.</p>
                  <p>왼쪽 폼을 사용해서 첫 번째 이야기를 등록해보세요!</p>
                </div>
              )}
              {registeredStories.map((story) => (
                <div key={story.id} className={`story-card ${editingStoryId === story.id ? 'editing' : ''}`}>
                  {editingStoryId === story.id ? (
                    // 편집 모드
                    <div className="story-edit-form">
                      <div className="story-edit-header">
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditInputChange}
                          className="story-edit-title-input"
                          placeholder="이야기 제목"
                        />
                        <div 
                          className="story-status-indicator"
                          style={{ backgroundColor: getStatusColor(story.status) }}
                        ></div>
                      </div>
                      
                      <div className="story-edit-meta">
                        <span className="story-card-date">{story.date}</span>
                        <select
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditInputChange}
                          className="story-edit-category-select"
                        >
                          <option value="">카테고리 없음</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <textarea
                        name="content"
                        value={editFormData.content}
                        onChange={handleEditInputChange}
                        className="story-edit-content-textarea"
                        placeholder="이야기 내용"
                        rows="4"
                      />
                      
                      <input
                        type="url"
                        name="image_url"
                        value={editFormData.image_url}
                        onChange={handleEditInputChange}
                        className="story-edit-image-input"
                        placeholder="이미지 URL (선택사항)"
                      />
                      
                      <div className="story-edit-actions">
                        <button 
                          className="story-edit-button save"
                          onClick={() => saveEdit(story.id)}
                          disabled={!editFormData.title.trim() || !editFormData.content.trim()}
                        >
                          저장
                        </button>
                        <button 
                          className="story-edit-button cancel"
                          onClick={cancelEditing}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <>
                      <div className="story-card-header">
                        <h3 className="story-card-title">{story.title}</h3>
                        <div 
                          className="story-status-indicator"
                          style={{ backgroundColor: getStatusColor(story.status) }}
                        ></div>
                      </div>
                      
                      <div className="story-card-meta">
                        <span className="story-card-date">{story.date}</span>
                        {story.category && <span className="story-card-category">{story.category}</span>}
                      </div>
                      
                      <p className="story-card-content">{story.content}</p>
                      
                      {story.image_url && (
                        <div className="story-card-image">
                          <img src={story.image_url} alt="이야기 이미지" className="story-image" />
                        </div>
                      )}
                      
                      <div className="story-card-actions">
                        <button 
                          className="story-action-button preview"
                          onClick={() => handleStoryAction(story.id, 'preview')}
                        >
                          <FiEye size={14} />
                          미리보기
                        </button>
                        <button 
                          className="story-action-button edit"
                          onClick={() => handleStoryAction(story.id, 'edit')}
                        >
                          <FiEdit size={14} />
                          수정
                        </button>
                        {story.status === 'draft' ? (
                          <button 
                            className="story-action-button publish"
                            onClick={() => handleStoryAction(story.id, 'publish')}
                          >
                            <FiPlay size={14} />
                            게시
                          </button>
                        ) : (
                          <button 
                            className="story-action-button private"
                            onClick={() => handleStoryAction(story.id, 'private')}
                          >
                            비공개
                          </button>
                        )}
                        <button 
                          className="story-action-button delete"
                          onClick={() => handleStoryAction(story.id, 'delete')}
                        >
                          <FiTrash2 size={14} />
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 - 미리보기 */}
        <aside className="story-preview-sidebar">
          <section className="story-preview-section">
            <h3 className="story-preview-title">사용자 화면 미리보기</h3>
            
            <div className="story-preview-container">
              {selectedStory ? (
                <div className="story-preview">
                  <h4 className="story-preview-story-title">{selectedStory.title}</h4>
                  <p className="story-preview-story-content">{selectedStory.content}</p>
                  {selectedStory.image_url && (
                    <div className="story-preview-image">
                      <img src={selectedStory.image_url} alt="이야기 이미지" className="story-preview-img" />
                    </div>
                  )}
                  <div className="story-preview-story-meta">
                    {selectedStory.category && <span className="story-preview-category">{selectedStory.category}</span>}
                    <span className="story-preview-date">{selectedStory.date}</span>
                  </div>
                </div>
              ) : (
                <div className="story-preview-placeholder">
                  <div className="story-placeholder-icon">
                    <FiEye size={48} />
                  </div>
                  <p className="story-placeholder-text">
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