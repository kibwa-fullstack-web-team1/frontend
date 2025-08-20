import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiEye, FiEdit, FiTrash2, FiPlay } from 'react-icons/fi';
<<<<<<< HEAD
import { logoutUser, getCurrentUser } from '../../services/api';
=======
import { logoutUser, createStory, getStories, updateStory, deleteStory, getCurrentUser } from '../../services/api';
>>>>>>> origin/main
import FamilyHeader from '../../components/FamilyHeader';
import './StoryGameDashboard.css';

// STORY API 기본 URL
const STORY_API_BASE_URL = 'http://13.251.163.144:8011';

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
<<<<<<< HEAD
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: '' // UI용으로만 유지
  });
=======
>>>>>>> origin/main

  // 카테고리 옵션
  const categories = [
    { value: 'family', label: '가족' },
    { value: 'anniversary', label: '기념일' },
    { value: 'travel', label: '여행' },
    { value: 'daily', label: '일상' },
    { value: 'memory', label: '추억' }
  ];

<<<<<<< HEAD
  // API 함수들
  
  // 이야기 목록 조회
  const fetchStories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }

      // 현재 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const userRole = currentUser?.role || 'guardian';
      
      console.log('사용자 정보:', currentUser);
      console.log('사용자 역할:', userRole);
      console.log('API 요청 시작...');
      
      const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/`, {        
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-User-Role': userRole // 커스텀 헤더로 사용자 역할 전달
        }
      });
      
      console.log('API 응답 상태:', response.status, response.statusText);
      console.log('요청 헤더에 포함된 역할:', userRole);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('에러 응답 내용:', errorText);
        
        // 404 에러인 경우 User Service 문제일 가능성이 높으므로 빈 배열로 처리
        if (response.status === 404) {
          console.warn('404 에러 - 빈 이야기 목록으로 처리');
          setRegisteredStories([]);
          return;
        }
        
        throw new Error(`이야기 목록을 불러오는데 실패했습니다: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('이야기 목록 API 응답:', data);
      
      // API 응답 구조에 맞게 데이터 매핑
      const stories = data.results || data || [];
      setRegisteredStories(stories.map(story => ({
        id: story.id,
        title: story.title,
        content: story.content,
        image_url: story.image_url || '',
        category: story.category || '일반', // UI 표시용
        status: story.status || 'draft',
        date: story.created_at ? story.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      })));
      
    } catch (err) {
      console.error('이야기 목록 조회 실패:', err);
      setError(err.message);
      
      // 개발 환경에서는 임시 데이터 사용
      if (process.env.NODE_ENV === 'development') {
        console.warn('API 호출 실패, 임시 데이터 사용');
        setRegisteredStories([
          {
            id: 1,
            title: '할머니와의 첫 만남',
            content: '할머니를 처음 만났을 때의 이야기입니다. 그때 할머니는 따뜻한 미소로 저를 맞아주셨어요.',
            image_url: '',
            category: '가족',
            status: 'published',
            date: '2024-01-15'
          },
          {
            id: 2,
            title: '생일 파티 추억',
            content: '할머니의 80번째 생일 파티를 준비했던 날의 이야기입니다. 온 가족이 모여서 축하해드렸어요.',
            image_url: '',
            category: '기념일',
            status: 'draft',
            date: '2024-01-10'
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 이야기 목록 로드
  useEffect(() => {
=======
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
>>>>>>> origin/main
    fetchStories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

<<<<<<< HEAD
  // 인라인 편집을 위한 함수들
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (story) => {
    setEditingStoryId(story.id);
    setEditFormData({
      title: story.title,
      content: story.content,
      image_url: story.image_url || '',
      category: story.category
    });
  };

  const cancelEditing = () => {
    setEditingStoryId(null);
    setEditFormData({
      title: '',
      content: '',
      image_url: '',
      category: ''
    });
  };

  const saveEdit = async (storyId) => {
    try {
      // API 스펙에 맞는 데이터만 전송
      const apiData = {
        title: editFormData.title.trim(),
        content: editFormData.content.trim()
      };
      
      // image_url이 있으면 추가
      if (editFormData.image_url && editFormData.image_url.trim()) {
        apiData.image_url = editFormData.image_url.trim();
      }
      
      await updateStory(storyId, apiData);
      setEditingStoryId(null);
      setEditFormData({
        title: '',
        content: '',
        image_url: '',
        category: ''
      });
      alert('이야기가 수정되었습니다.');
    } catch (err) {
      alert(`이야기 수정에 실패했습니다: ${err.message}`);
    }
  };

  // 이야기 등록
  const createStory = async (storyData) => {
    try {
      setIsLoading(true);
      
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }

      // 현재 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const userRole = currentUser?.role || 'guardian';
      
      // API 스펙에 맞는 데이터만 전송
      const apiData = {
        title: storyData.title,
        content: storyData.content
      };
      
      // image_url이 있으면 추가
      if (storyData.image_url && storyData.image_url.trim()) {
        apiData.image_url = storyData.image_url.trim();
      }

      console.log('이야기 등록 시도 - 전송 데이터:', apiData);
      console.log('사용자 역할:', userRole);
      console.log('JWT Token:', authToken.substring(0, 20) + '...');
      
      const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-User-Role': userRole // 커스텀 헤더로 사용자 역할 전달
        },
        body: JSON.stringify(apiData)
      });
      
      console.log('이야기 등록 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('이야기 등록 에러 응답:', errorText);
        throw new Error(`이야기 등록에 실패했습니다: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('이야기 등록 성공:', result);
      
      // 목록 새로고침
      await fetchStories();
      
      return result;
      
    } catch (err) {
      console.error('이야기 등록 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createStory(formData);
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        image_url: '',
        category: ''
      });
      
      alert('이야기가 등록되었습니다!');
      
    } catch (err) {
      alert(`이야기 등록에 실패했습니다: ${err.message}`);
    }
  };

  // 이야기 수정
  const updateStory = async (storyId, updateData) => {
    try {
      setIsLoading(true);
      
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }

      // 현재 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const userRole = currentUser?.role || 'guardian';
      
      const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/${storyId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-User-Role': userRole // 커스텀 헤더로 사용자 역할 전달
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('이야기 수정 에러 응답:', errorText);
        throw new Error(`이야기 수정에 실패했습니다: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('이야기 수정 성공:', result);
      
      // 목록 새로고침
      await fetchStories();
      
      return result;
      
    } catch (err) {
      console.error('이야기 수정 실패:', err);
      throw err;
=======
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
>>>>>>> origin/main
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // 이야기 삭제
  const deleteStory = async (storyId) => {
    try {
      setIsLoading(true);
      
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      }

      // 현재 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const userRole = currentUser?.role || 'guardian';
      
      const response = await fetch(`${STORY_API_BASE_URL}/api/v0/stories/${storyId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-User-Role': userRole // 커스텀 헤더로 사용자 역할 전달
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('이야기 삭제 에러 응답:', errorText);
        throw new Error(`이야기 삭제에 실패했습니다: ${response.status} - ${errorText}`);
      }
      
      console.log('이야기 삭제 성공');
      
      // 목록 새로고침
      await fetchStories();
      
    } catch (err) {
      console.error('이야기 삭제 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 이야기 상태 변경 (API에서 지원하지 않을 수 있으므로 주석 처리)
  const updateStoryStatus = async (storyId, status) => {
    try {
      // 상태 변경은 API 스펙에 없으므로 일단 기본 업데이트로 처리
      console.warn('상태 변경 기능은 현재 API에서 지원하지 않습니다.');
      alert('상태 변경 기능은 준비 중입니다.');
    } catch (err) {
      throw err;
    }
  };

  const handleStoryAction = async (storyId, action) => {
    console.log(`이야기 ${action}:`, storyId);
    
=======
  const handleStoryAction = async (storyId, action) => {
    console.log(`이야기 ${action}:`, storyId);
    
    setIsLoading(true);

>>>>>>> origin/main
    try {
      switch (action) {
        case 'preview':
          setSelectedStory(registeredStories.find(story => story.id === storyId));
          break;
        case 'edit':
<<<<<<< HEAD
          // 인라인 편집 모드로 전환
          const storyToEdit = registeredStories.find(story => story.id === storyId);
          if (storyToEdit) {
            startEditing(storyToEdit);
          }
          break;
        case 'publish':
          await updateStoryStatus(storyId, 'published');
          break;
        case 'private':
          await updateStoryStatus(storyId, 'private');
=======
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
>>>>>>> origin/main
          break;
        case 'delete':
          if (window.confirm('정말로 이 이야기를 삭제하시겠습니까?')) {
            await deleteStory(storyId);
            alert('이야기가 삭제되었습니다.');
<<<<<<< HEAD
            // 선택된 이야기가 삭제된 경우 선택 해제
            if (selectedStory && selectedStory.id === storyId) {
              setSelectedStory(null);
            }
=======
            // 삭제 후 다시 데이터 로드
            const stories = await getStories();
            setRegisteredStories(stories);
>>>>>>> origin/main
          }
          break;
        default:
          break;
      }
    } catch (err) {
<<<<<<< HEAD
      alert(`작업 실행에 실패했습니다: ${err.message}`);
=======
      setError(err);
      alert('이야기 작업 중 오류가 발생했습니다.');
      console.error('Error performing story action:', err);
    } finally {
      setIsLoading(false);
>>>>>>> origin/main
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

<<<<<<< HEAD
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

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
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error.message}</div>;
  }

>>>>>>> origin/main
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