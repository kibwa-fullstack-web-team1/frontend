import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, getAuthToken, logoutUser } from '../../services/api';
import ElderlyHeader from '../../components/ElderlyHeader';
import './GameSelectPage.css';

function GameSelectPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showFamilyInvite, setShowFamilyInvite] = useState(false);
  const [invitationCode, setInvitationCode] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isGroupCode, setIsGroupCode] = useState(true);  // 기본값을 그룹 초대코드로 설정
  const [showFamilyConnect, setShowFamilyConnect] = useState(false);
  const [connectCode, setConnectCode] = useState('');
  const [connectionResult, setConnectionResult] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // 현재 사용자 정보 확인
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      console.log('GameSelectPage - 현재 사용자 정보:', user);
      console.log('GameSelectPage - 사용자 역할:', user?.role);
      setCurrentUser(user);
    } else {
      console.log('GameSelectPage - 로그인되지 않음');
    }
  }, []);

  // 사용자 정보가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('GameSelectPage - currentUser 상태 변경:', currentUser);
    console.log('GameSelectPage - showFamilyConnect 상태:', showFamilyConnect);
  }, [currentUser, showFamilyConnect]);

  const handleFamilyInvite = () => {
    setShowFamilyInvite(true);
  };

  const handleFamilyConnect = () => {
    setShowFamilyConnect(true);
  };

  const handleCloseFamilyInvite = () => {
    setShowFamilyInvite(false);
    setInvitationCode(null);
  };

  const handleCloseFamilyConnect = () => {
    setShowFamilyConnect(false);
    setConnectCode('');
    setConnectionResult(null);
  };

  const handleConnectCodeChange = (e) => {
    setConnectCode(e.target.value);
  };

  const connectWithFamily = async () => {
    if (!connectCode.trim()) {
      alert('초대코드를 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch('http://localhost:8000/family/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          code: connectCode.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setConnectionResult({
          success: true,
          message: '가족과 성공적으로 연결되었습니다!',
          senior_name: data.senior_name || '시니어'
        });
      } else {
        setConnectionResult({
          success: false,
          message: data.detail || '가족 연결에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('가족 연결 오류:', error);
      setConnectionResult({
        success: false,
        message: '연결 중 오류가 발생했습니다.'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const resetConnection = () => {
    setConnectCode('');
    setConnectionResult(null);
  };

  const generateInvitationCode = async () => {
    setIsGeneratingCode(true);
    
    try {
      // JWT 토큰 가져오기
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('🔍 초대코드 생성 시작 - isGroupCode:', isGroupCode);

      let response;
      if (isGroupCode) {
        // 그룹 초대코드 생성
        console.log('🚀 그룹 초대코드 API 호출 시작');
        response = await fetch('http://localhost:8000/family/invite-code/group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            max_guardians: 10,
            relationship_type_id: 5,
            expires_in_days: 30
          })
        });
        console.log('✅ 그룹 초대코드 API 응답:', response.status);
      } else {
        // 개별 초대코드 생성
        console.log('🚀 개별 초대코드 API 호출 시작');
        response = await fetch('http://localhost:8000/family/invite-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            invitee_email: 'test@example.com',
            relationship_type_id: 5,
            is_group_code: false
          })
        });
        console.log('✅ 개별 초대코드 API 응답:', response.status);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '초대코드 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('📊 받은 데이터:', data);
      
      setInvitationCode({
        code: data.code,
        expires_at: data.expires_at,
        created_at: data.created_at,
        is_used: data.is_used,
        is_group_code: data.is_group_code,
        max_guardians: data.max_guardians,
        current_guardians: data.current_guardians
      });
      
      console.log('🎯 설정된 초대코드 상태:', {
        code: data.code,
        is_group_code: data.is_group_code,
        max_guardians: data.max_guardians
      });
      
    } catch (error) {
      console.error('❌ 초대코드 생성 오류:', error);
      alert(error.message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationCode.code);
      alert('초대코드가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: '기억의 정원 초대코드',
        text: `초대코드: ${invitationCode.code}`,
        url: window.location.origin
      });
    } else {
      copyToClipboard();
    }
  };

  const handleGoToFamilyInvite = () => {
    // HomePage로 이동
    navigate('/');
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

  const games = [
    {
      id: 'memory-flip-card',
      title: '추억의 퍼즐 맞추기',
      description: '흩어진 기억의 조각들을 맞춰보세요',
      difficulty: '쉬움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'story-sequence',
      title: '시간 여행자',
      description: '과거와 현재를 오가며 이야기를 완성하세요',
      difficulty: '보통',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 7.5L12.5 12.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M10 1L10 19" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 4.94L5.36 6.36" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 15.64L16.06 17.06" stroke="#171412" strokeWidth="1.5"/>
          <path d="M1 10L19 10" stroke="#171412" strokeWidth="1.5"/>
          <path d="M3.94 13.64L5.36 15.06" stroke="#171412" strokeWidth="1.5"/>
          <path d="M14.64 2.94L16.06 4.36" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'memory-maze',
      title: '오늘의 질문',
      description: "오늘의 질문에 답하며 새로운 나를 발견하세요",
      difficulty: '어려움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'emotion-garden',
      title: '감정의 정원',
      description: '다양한 감정들을 키워 아름다운 정원을 만드세요',
      difficulty: '쉬움',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 2.5L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
          <path d="M12.92 12.92L17.5 17.5" stroke="#171412" strokeWidth="1.5"/>
        </svg>
      )
    }
  ];

  const handleGameSelect = (gameId) => {
    switch (gameId) {
      case 'memory-flip-card':
        navigate('/card-game');
        break;
      case 'story-sequence':
        navigate('/story-sequence');
        break;
      case 'memory-maze':
        navigate('/daily-question');
        break;
      case 'emotion-garden':
        navigate('/game');
        break;
      default:
        navigate('/game');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="game-select-page">
      <ElderlyHeader 
        title="기억의 정원" 
        subtitle="게임을 선택하세요"
        onBackClick={handleBackToHome}
      />

      <main className="select-main-content">
        {/* 가족 연결 안내 */}
        {isAuthenticated() && (
          <div className="select-family-connect-info">
            <div className="select-family-connect-content">
              <h3>가족과 함께하는 게임</h3>
              <p>가족과 함께 게임을 즐기고 결과를 공유해보세요!</p>
              <p style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
                디버그: 현재 사용자 역할 = {currentUser?.role || 'undefined'}
              </p>
              {currentUser && currentUser.role === 'senior' ? (
                <button className="select-family-connect-btn" onClick={handleFamilyInvite}>
                  가족 초대하기 (시니어)
                </button>
              ) : currentUser && currentUser.role === 'guardian' ? (
                <button className="select-family-connect-btn" onClick={handleFamilyConnect}>
                  가족 연결하기 (보호자)
                </button>
              ) : (
                <div>
                  <button className="select-family-connect-btn" onClick={() => navigate('/login')}>
                    로그인하기
                  </button>
                  <button 
                    className="select-family-connect-btn" 
                    style={{marginLeft: '10px', background: '#dc3545'}}
                    onClick={() => setCurrentUser({...currentUser, role: 'guardian'})}
                  >
                    보호자 역할로 테스트
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="select-games-grid">
          {games.map((game) => (
            <div key={game.id} className="select-game-card" onClick={() => handleGameSelect(game.id)}>
              <div className="select-game-header">
                <div className="select-game-icon">
                  {game.icon}
                </div>
                <div className="select-game-difficulty">
                  {game.difficulty}
                </div>
              </div>
              
              <div className="select-game-content">
                <h3 className="select-game-title">{game.title}</h3>
                <p className="select-game-description">{game.description}</p>
              </div>
              
              <button className="select-game-start-btn">
                게임 시작
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="select-footer">
          <div className="select-footer-content">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" fill="#171412"/>
            </svg>
            <span>Garden of Memory</span>
          </div>
        </div>
      </main>

      {/* 가족 초대 모달 */}
      {showFamilyInvite && (
        <div className="select-family-invite-modal">
          <div className="select-family-invite-modal-content">
            <div className="select-family-invite-modal-header">
              <h3>가족 초대하기</h3>
              <button className="select-family-invite-modal-close" onClick={handleCloseFamilyInvite}>
                ✕
              </button>
            </div>
            <div className="select-family-invite-modal-body">
              <div className="select-family-invite-code-section">
                <h4>초대코드 생성</h4>
                <p>가족을 초대하기 위한 초대코드를 생성하세요.</p>
                
                {/* 초대코드 타입 선택 */}
                <div className="select-family-invite-code-type">
                  <label>
                    <input
                      type="radio"
                      name="codeType"
                      value="group"
                      checked={isGroupCode}
                      onChange={() => setIsGroupCode(true)}
                    />
                    <span>그룹 초대코드 (여러 보호자 연결 가능)</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="codeType"
                      value="individual"
                      checked={!isGroupCode}
                      onChange={() => setIsGroupCode(false)}
                    />
                    <span>개별 초대코드 (1명만 연결 가능)</span>
                  </label>
                </div>
                
                <button 
                  className="select-family-invite-generate-code-btn" 
                  onClick={generateInvitationCode}
                  disabled={isGeneratingCode}
                >
                  {isGeneratingCode ? '초대코드 생성 중...' : '초대코드 생성하기'}
                </button>
                
                {invitationCode && (
                  <div className="select-family-invite-code-details">
                    <h5>생성된 초대코드</h5>
                    <div className="select-family-invite-code-display">
                      <span className="select-family-invite-code-text">{invitationCode.code}</span>
                    </div>
                    <div className="select-family-invite-code-info">
                      <p>초대코드 타입: <strong>{invitationCode.is_group_code ? '그룹 초대코드' : '개별 초대코드'}</strong></p>
                      {invitationCode.is_group_code && (
                        <>
                          <p>최대 보호자 수: <strong>{invitationCode.max_guardians}명</strong></p>
                          <p>현재 연결된 보호자: <strong>{invitationCode.current_guardians}명</strong></p>
                        </>
                      )}
                      <p>만료일: <strong>{new Date(invitationCode.expires_at).toLocaleDateString()}</strong></p>
                      <p>생성일: <strong>{new Date(invitationCode.created_at).toLocaleDateString()}</strong></p>
                    </div>
                    <div className="select-family-invite-code-actions">
                      <button className="select-family-invite-copy-code-btn" onClick={copyToClipboard}>
                        초대코드 복사
                      </button>
                      <button className="select-family-invite-share-code-btn" onClick={shareCode}>
                        초대코드 공유
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="select-family-invite-modal-footer">
              <button className="select-family-invite-modal-btn" onClick={handleCloseFamilyInvite}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 가족 연결 모달 */}
      {showFamilyConnect && (
        <div className="select-family-connect-modal">
          <div className="select-family-connect-modal-content">
            <div className="select-family-connect-modal-header">
              <h3>가족 연결하기</h3>
              <button className="select-family-connect-modal-close" onClick={handleCloseFamilyConnect}>
                ✕
              </button>
            </div>
            <div className="select-family-connect-modal-body">
              <div className="select-family-connect-code-input-section">
                <label htmlFor="connectCode">초대코드 입력:</label>
                <input
                  type="text"
                  id="connectCode"
                  value={connectCode}
                  onChange={handleConnectCodeChange}
                  placeholder="초대코드를 입력하세요"
                />
                <button 
                  className="select-family-connect-connect-btn" 
                  onClick={connectWithFamily}
                  disabled={isConnecting}
                >
                  {isConnecting ? '연결 중...' : '가족 연결하기'}
                </button>
              </div>
              {connectionResult && (
                <div className={`select-family-connect-result ${connectionResult.success ? 'success' : 'error'}`}>
                  {connectionResult.message}
                  {connectionResult.success && connectionResult.senior_name && (
                    <p>시니어: {connectionResult.senior_name}</p>
                  )}
                </div>
              )}
              {connectionResult && (
                <button className="select-family-connect-reset-btn" onClick={resetConnection}>
                  다시 입력
                </button>
              )}
            </div>
            <div className="select-family-connect-modal-footer">
              <button className="select-family-connect-modal-btn" onClick={handleCloseFamilyConnect}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameSelectPage; 