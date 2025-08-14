import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { signupUser } from '../../services/api';
import './SignupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    // 유효성 검사
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.nickname || !formData.phone || !formData.role) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }



    setIsLoading(true);
    setError('');

    try {
      // TODO: 실제 백엔드 API와 연결 시 signupUser 함수 호출
      // const response = await signupUser(
      //   formData.email,
      //   formData.password,
      //   formData.nickname,
      //   formData.phone,
      //   formData.role
      // );
      
      // 임시 회원가입 로직 (백엔드 API 연결 전까지 사용)
      console.log('임시 회원가입 데이터:', {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        phone: formData.phone,
        role: formData.role
      });
      
      // 임시 지연 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 임시 성공 응답 (실제로는 백엔드에서 받아올 데이터)
      const response = {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: 'temp_' + Date.now(),
          email: formData.email,
          nickname: formData.nickname,
          role: formData.role
        }
      };
      
      console.log('임시 회원가입 성공:', response);
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };



  return (
    <div className="signup-page">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.14 0.38L14.85 15.62" stroke="#171412" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="logo-text">Garden of Memory</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Games</a>
          <a href="#" className="nav-link">About Us</a>
          <a href="#" className="nav-link">Contact</a>
          <button className="sign-in-btn" onClick={handleBackToLogin}>Sign In</button>
        </nav>
      </header>

      <main className="main-content">
        <div className="signup-container">
          <div className="signup-form-wrapper">
            <h2 className="signup-title">회원가입</h2>
            <p className="signup-subtitle">소중한 기억들을 함께 만들어가세요</p>
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="nickname" className="form-label">닉네임</label>
                <input 
                  type="text" 
                  id="nickname" 
                  name="nickname" 
                  value={formData.nickname} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="닉네임을 입력하세요" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="이메일을 입력하세요" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">전화번호</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="전화번호를 입력하세요" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">비밀번호</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    className="form-input" 
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

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="비밀번호를 다시 입력하세요" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">역할 선택</label>
                <div className="role-selection">
                  <div 
                    className={`role-card ${formData.role === 'elderly' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'elderly' }))}
                  >
                    <div className="role-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="#171412"/>
                      </svg>
                    </div>
                    <span className="role-text">노약자</span>
                  </div>
                  <div 
                    className={`role-card ${formData.role === 'caregiver' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'caregiver' }))}
                  >
                    <div className="role-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M16 4C16 6.21 14.21 8 12 8C9.79 8 8 6.21 8 4C8 1.79 9.79 0 12 0C14.21 0 16 1.79 16 4ZM4 18V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V18C20 15.79 18.21 14 16 14H8C5.79 14 4 15.79 4 18Z" fill="#171412"/>
                      </svg>
                    </div>
                    <span className="role-text">보호자</span>
                  </div>
                </div>
              </div>



              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="signup-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    회원가입 중...
                  </div>
                ) : (
                  <>
                    회원가입 완료
                    <FiArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="login-section">
              <span className="login-text">이미 계정이 있으신가요?</span>
              <button type="button" className="login-button" onClick={handleBackToLogin}>
                로그인하기
              </button>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <FiX size={16} />
              <span>Garden of Memory</span>
            </div>
            <p className="footer-description">
              소중한 기억들을 영원히 간직할 수 있는 디지털 정원입니다.
            </p>
            <div className="social-links">
              {/* 소셜 링크들 */}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default SignupPage; 