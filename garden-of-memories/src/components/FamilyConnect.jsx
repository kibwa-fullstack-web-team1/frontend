import React, { useState, useEffect } from 'react';
import { getAuthToken, getCurrentUser } from '../services/api';
import './FamilyConnect.css';

const FamilyConnect = ({ onConnectionSuccess }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 컴포넌트 마운트 시 현재 사용자 정보 가져오기
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const connectFamily = async () => {
    if (!invitationCode.trim()) return;
    
    setIsConnecting(true);
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

      // 보호자 사용자인지 확인
      if (currentUser.role !== 'guardian') {
        throw new Error('보호자 사용자만 가족과 연결할 수 있습니다.');
      }
      
      const response = await fetch('http://localhost:8000/family/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // JWT 토큰 사용
        },
        body: JSON.stringify({ 
          code: invitationCode.toUpperCase(),
          relationship_type_id: 5
        })
      });

      const data = await response.json();
      console.log('가족 연결 성공:', data); // 디버깅용

      // 백엔드 응답의 success 필드 확인
      if (data.success === false) {
        // 연결 실패 (이미 연결됨, 만료됨 등)
        setError(data.message || '연결에 실패했습니다.');
        setConnectionResult(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || '연결에 실패했습니다.');
      }

      setConnectionResult(data);
      
      // 성공 시 콜백 호출
      if (onConnectionSuccess) {
        onConnectionSuccess(data);
      }
      
      // 입력 필드 초기화
      setInvitationCode('');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    // 8자리까지만 입력 가능
    if (value.length <= 8) {
      setInvitationCode(value);
      setError(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      connectFamily();
    }
  };

  const resetForm = () => {
    setInvitationCode('');
    setConnectionResult(null);
    setError(null);
  };

  return (
    <div className="family-connect">
      <div className="connect-header">
        <h3>가족과 연결하기</h3>
        <p>시니어가 제공한 초대코드를 입력하여 가족과 연결하세요.</p>
      </div>

      {!connectionResult && (
        <div className="connect-form">
          <div className="input-group">
            <label htmlFor="invitation-code">초대코드</label>
            <div className="code-input-container">
              <input
                id="invitation-code"
                type="text"
                placeholder="예: A7B9C2D4"
                value={invitationCode}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                maxLength={8}
                className={error ? 'error' : ''}
              />
              <button 
                className="connect-btn"
                onClick={connectFamily} 
                disabled={isConnecting || !invitationCode.trim()}
              >
                {isConnecting ? '연결 중...' : '연결하기'}
              </button>
            </div>
            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
                <button onClick={resetForm} className="reset-btn">
                  다시 시도
                </button>
              </div>
            )}
          </div>
          
          <div className="help-text">
            <p>💡 초대코드는 시니어가 '가족 초대' 메뉴에서 생성할 수 있습니다.</p>
            <p>💡 초대코드는 24시간 후 만료됩니다.</p>
          </div>
        </div>
      )}

      {connectionResult && connectionResult.success !== false && (
        <div className="connection-result success">
          <div className="result-icon">✅</div>
          <h4>연결 성공!</h4>
          <p className="senior-name">
            <strong>{connectionResult.senior_name || '시니어'}</strong>님과 연결되었습니다.
          </p>
          <p className="result-message">
            이제 {connectionResult.senior_name || '시니어'}님의 활동 기록을 확인할 수 있습니다.
          </p>
          
          <div className="result-actions">
            <button 
              className="continue-btn primary"
              onClick={() => window.location.href = '/family-dashboard'}
            >
              가족 대시보드로 이동
            </button>
            <button 
              className="new-connection-btn secondary"
              onClick={resetForm}
            >
              다른 가족과 연결하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyConnect;
