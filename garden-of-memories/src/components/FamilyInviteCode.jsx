import React, { useState, useEffect } from 'react';
import { getAuthToken, getCurrentUser } from '../services/api';
import './FamilyInviteCode.css';

const FamilyInviteCode = () => {
  const [invitationCode, setInvitationCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 컴포넌트 마운트 시 현재 사용자 정보 가져오기
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const generateCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // JWT 토큰 가져오기
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('로그인이 필요합니다. 먼저 로그인해주세요.');
      }

      // 현재 사용자 정보 확인
      if (!currentUser) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      // 시니어 사용자인지 확인
      if (currentUser.role !== 'senior') {
        throw new Error('시니어 사용자만 초대코드를 생성할 수 있습니다.');
      }
      
      const response = await fetch('http://localhost:8000/family/invite-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // JWT 토큰 사용
        },
        body: JSON.stringify({ 
          invitee_email: 'test@example.com',
          relationship_type_id: 5
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '초대코드 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('백엔드 응답 데이터:', data); // 디버깅용
      
      // 백엔드 응답 구조에 맞춰 데이터 설정
      setInvitationCode({
        invitation_code: data.code, // 백엔드의 'code' 필드를 'invitation_code'로 매핑
        expires_at: data.expires_at,
        created_at: data.created_at,
        is_used: data.is_used
      });
    } catch (error) {
      console.error('초대코드 생성 오류:', error); // 디버깅용
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // invitation_code 필드가 있는지 확인
      const codeToCopy = invitationCode?.invitation_code || invitationCode?.code || '코드 없음';
      await navigator.clipboard.writeText(codeToCopy);
      alert('초대코드가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      const codeToShare = invitationCode?.invitation_code || invitationCode?.code || '코드 없음';
      navigator.share({
        title: '기억의 정원 초대코드',
        text: `초대코드: ${codeToShare}`,
        url: window.location.origin
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="family-invite-code">
      <div className="invite-header">
        <h3>가족을 초대하세요</h3>
        <p>초대코드를 생성하여 보호자와 연결할 수 있습니다.</p>
      </div>

      {!invitationCode && (
        <div className="generate-section">
          <button 
            className="generate-btn"
            onClick={generateCode} 
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '초대코드 생성'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {invitationCode && (
        <div className="invitation-code-display">
          <div className="code-header">
            <h4>초대코드</h4>
            <p className="expires-info">
              ⏰ 24시간 후 만료됩니다
            </p>
          </div>
          
          <div className="code-container">
            <div className="code">{invitationCode.invitation_code}</div>
            <button 
              className="copy-btn"
              onClick={copyToClipboard}
            >
              복사
            </button>
          </div>
          
          <div className="code-instructions">
            <p>이 코드를 보호자에게 알려주세요</p>
            <p>보호자는 이 코드를 입력하여 가족과 연결할 수 있습니다</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="share-btn primary"
              onClick={shareCode}
            >
              공유하기
            </button>
            <button 
              className="new-code-btn secondary"
              onClick={() => setInvitationCode(null)}
            >
              새 코드 생성
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyInviteCode;
