import React, { useState } from 'react';
import FamilyInviteCode from '../components/FamilyInviteCode';
import FamilyConnect from '../components/FamilyConnect';
import './FamilyTestPage.css';

const FamilyTestPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('senior');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 테스트용 사용자 데이터
  const testUsers = {
    senior: {
      id: 1,
      username: "김정원",
      email: "senior@test.com",
      role: "senior"
    },
    guardian: {
      id: 2,
      username: "김민지", 
      email: "guardian@test.com",
      role: "guardian"
    }
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentUser(testUsers[role]);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserRole('senior');
  };

  const handleConnectionSuccess = (result) => {
    console.log('가족 연결 성공:', result);
    alert(`🎉 ${result.senior_name}님과 연결되었습니다!`);
  };

  if (!isLoggedIn) {
    return (
      <div className="family-test-page">
        <div className="login-section">
          <h1>👨‍👩‍👧‍👦 가족 초대 & 연결</h1>
          <p>가족과의 연결을 위한 초대코드 시스템을 테스트해보세요</p>
          
          <div className="role-buttons">
            <button 
              className="role-btn senior"
              onClick={() => handleLogin('senior')}
            >
              👵 시니어로 테스트 (초대코드 생성)
            </button>
            <button 
              className="role-btn guardian"
              onClick={() => handleLogin('guardian')}
            >
              👨‍👩‍👧‍👦 보호자로 테스트 (초대코드 입력)
            </button>
          </div>
          
          <div className="test-info">
            <h3>테스트 시나리오</h3>
            <ol>
              <li>시니어 역할로 로그인하여 초대코드 생성</li>
              <li>보호자 역할로 로그인하여 초대코드로 가족 연결</li>
              <li>연결 성공 확인</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="family-test-page">
      <div className="test-header">
        <h1>👨‍👩‍👧‍👦 가족 초대 & 연결</h1>
        <div className="user-info">
          <span className="user-role">{userRole === 'senior' ? '👵 시니어' : '👨‍👩‍👧‍👦 보호자'}</span>
          <span className="username">{currentUser.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="test-content">
        {userRole === 'senior' ? (
          <div className="senior-test">
            <h2>👵 시니어: 가족 초대하기</h2>
            <p className="test-description">초대코드를 생성하여 가족을 초대하세요</p>
            <FamilyInviteCode currentUser={currentUser} />
          </div>
        ) : (
          <div className="guardian-test">
            <h2>👨‍👩‍👧‍👦 보호자: 가족과 연결하기</h2>
            <p className="test-description">시니어가 제공한 초대코드를 입력하여 가족과 연결하세요</p>
            <FamilyConnect 
              currentUser={currentUser} 
              onConnectionSuccess={handleConnectionSuccess}
            />
          </div>
        )}
      </div>

      <div className="test-instructions">
        <h3>📋 테스트 가이드</h3>
        {userRole === 'senior' ? (
          <div>
            <p><strong>시니어 테스트 단계:</strong></p>
            <ol>
              <li>"초대코드 생성" 버튼 클릭</li>
              <li>생성된 8자리 코드 확인</li>
              <li>코드를 복사하여 보호자에게 전달</li>
              <li>보호자 역할로 전환하여 연결 테스트</li>
            </ol>
          </div>
        ) : (
          <div>
            <p><strong>보호자 테스트 단계:</strong></p>
            <ol>
              <li>시니어가 제공한 초대코드 입력</li>
              <li>"연결하기" 버튼 클릭</li>
              <li>연결 성공 메시지 확인</li>
              <li>가족 대시보드로 이동</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTestPage;
