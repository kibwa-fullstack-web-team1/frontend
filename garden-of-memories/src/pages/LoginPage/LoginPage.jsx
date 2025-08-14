import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight, FiX } from 'react-icons/fi';
import { loginUser, fetchUserInfo } from '../../services/api';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 실제 로그인 API 호출
      const response = await loginUser(formData.email, formData.password);

      if (!response || !response.access_token) {
        throw new Error('로그인에 실패했습니다.');
      }

      console.log('로그인 성공:', response);
      console.log('전체 응답 데이터:', JSON.stringify(response, null, 2));
      
      // 로그인 성공 후 사용자 정보 가져오기
      let userData;
      try {
        userData = await fetchUserInfo();
        console.log('사용자 정보 가져오기 성공:', userData);
      } catch (userInfoError) {
        console.warn('사용자 정보 가져오기 실패, 기본 정보 사용:', userInfoError);
        // 사용자 정보를 가져올 수 없는 경우 기본 정보 사용
        userData = { role: 'senior' }; // 기본값으로 어르신 역할 설정
      }

      // 사용자 역할 확인 (배열 형태 응답 처리)
      let role = null;
      if (Array.isArray(userData) && userData.length > 0) {
        role = userData[0].role;
      } else if (userData && userData.role) {
        role = userData.role;
      }

      console.log('확인된 사용자 역할:', role);

      // 역할 → 페이지 매핑
      const ROLE_ROUTE = {
        senior: '/game-select',
        family: '/game-select-dashboard',
        guardian: '/game-select-dashboard', // 혼용 대응
      };

      const nextPath = role && ROLE_ROUTE[role] ? ROLE_ROUTE[role] : '/game-select';

      console.log('결정된 nextPath:', nextPath, '(role:', role, ')');
      console.log('ROLE_ROUTE[role]:', role ? ROLE_ROUTE[role] : 'undefined');
      navigate(nextPath);

   } catch (err) {
     console.error('로그인 오류:', err);
     setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
   } finally {
     setIsLoading(false);
   }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    // 비밀번호 찾기 페이지로 이동 (향후 구현)
    alert('비밀번호 찾기 기능은 준비 중입니다.');
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
              </svg>
            </div>
            <h1 className="login-logo-text">Garden of Memory</h1>
          </div>
          <nav className="login-nav">
            <a href="#" className="login-nav-link">Games</a>
            <a href="#" className="login-nav-link">About Us</a>
            <a href="#" className="login-nav-link">Contact</a>
            <button className="login-sign-in-btn">Sign In</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main-content">
        <div className="login-container">
          <div className="login-form-wrapper">
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">소중한 기억들이 기다리고 있습니다</p>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-form-label">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-form-input"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-form-label">비밀번호</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="login-form-input"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="login-form-options">
                <label className="login-checkbox-container">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="login-checkbox"
                  />
                  <span className="login-checkmark"></span>
                  로그인 상태 유지
                </label>
                
                <button
                  type="button"
                  className="login-forgot-password"
                  onClick={handleForgotPassword}
                >
                  비밀번호 찾기
                </button>
              </div>

              {error && (
                <div className="login-error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="login-loading-spinner">
                    <div className="login-spinner"></div>
                    로그인 중...
                  </div>
                ) : (
                  <>
                    정원에 입장하기
                    <FiArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="login-signup-section">
              <span className="login-signup-text">아직 계정이 없으신가요?</span>
              <button
                type="button"
                className="login-signup-button"
                onClick={handleSignUp}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="login-footer">
          <div className="login-footer-content">
            <div className="login-footer-logo">
              <FiX size={16} />
              <span>Garden of Memory</span>
            </div>
            <p className="login-footer-description">
              소중한 기억들을 영원히 간직할 수 있는 디지털 정원입니다.
            </p>
            <div className="login-social-links">
              <a href="#" className="login-social-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M0 1.5L16 13.5" stroke="#171412" strokeWidth="1.5"/>
                </svg>
              </a>
              <a href="#" className="login-social-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.03 2.67L14.98 13.33" stroke="#171412" strokeWidth="1.5"/>
                </svg>
              </a>
              <a href="#" className="login-social-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M0 0L16 15.61" stroke="#171412" strokeWidth="1.5"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LoginPage; 