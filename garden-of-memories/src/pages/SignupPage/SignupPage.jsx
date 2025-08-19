import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { PiFlowerLotusLight } from 'react-icons/pi';
import { signupUser } from '../../services/api';
import RegisterHeader from '../../components/RegisterHeader';
import './SignupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    role: '',
    agreeToTerms: false
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
      {/* 식물 잎사귀 장식 */}
      <div className="signup-leaf-decoration">
        <div className="signup-leaf signup-leaf-top-right"></div>
        <div className="signup-leaf signup-leaf-bottom-right"></div>
        <div className="signup-leaf signup-leaf-bottom-left"></div>
      </div>

      {/* Header */}
      <RegisterHeader 
        onSignInClick={handleBackToLogin}
        showSignInButton={true}
      />

      {/* Main Content */}
      <main className="signup-main-content">
        <div className="signup-container">
          <div className="signup-form-wrapper">
            <h2 className="signup-title">회원가입</h2>
            <p className="signup-subtitle">소중한 기억들을 함께 만들어가세요</p>
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-form-group">
                <label htmlFor="nickname" className="signup-form-label">닉네임</label>
                <input 
                  type="text" 
                  id="nickname" 
                  name="nickname" 
                  value={formData.nickname} 
                  onChange={handleInputChange} 
                  className="signup-form-input" 
                  placeholder="닉네임을 입력하세요" 
                  required 
                />
              </div>

              <div className="signup-form-group">
                <label htmlFor="email" className="signup-form-label">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="signup-form-input" 
                  placeholder="이메일을 입력하세요" 
                  required 
                />
              </div>

              <div className="signup-form-group">
                <label htmlFor="phone" className="signup-form-label">전화번호</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="signup-form-input" 
                  placeholder="전화번호를 입력하세요" 
                  required 
                />
              </div>

              <div className="signup-form-group">
                <label htmlFor="password" className="signup-form-label">비밀번호</label>
                <div className="signup-password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="signup-form-input"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="signup-form-group">
                <label htmlFor="confirmPassword" className="signup-form-label">비밀번호 확인</label>
                <div className="signup-password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="signup-form-input"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="signup-form-group">
                <label className="signup-form-label">사용자 유형</label>
                <div className="signup-role-selection">
                  <label className={`signup-role-option ${formData.role === 'senior' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="senior"
                      checked={formData.role === 'senior'}
                      onChange={handleInputChange}
                      className="signup-role-radio"
                    />
                    <span className="signup-role-text">어르신</span>
                  </label>
                  <label className={`signup-role-option ${formData.role === 'family' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="family"
                      checked={formData.role === 'family'}
                      onChange={handleInputChange}
                      className="signup-role-radio"
                    />
                    <span className="signup-role-text">가족</span>
                  </label>
                </div>
              </div>

              <div className="signup-form-options">
                <label className="signup-checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="signup-checkbox"
                    required
                  />
                  <span className="signup-checkmark"></span>
                  <span className="signup-terms-text">
                    <a href="#" className="signup-terms-link">이용약관</a> 및 <a href="#" className="signup-terms-link">개인정보처리방침</a>에 동의합니다
                  </span>
                </label>
              </div>

              {error && <div className="signup-error-message">{error}</div>}

              <button type="submit" className="signup-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="signup-loading-spinner">
                    <div className="signup-spinner"></div>
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

            <div className="signup-login-section">
              <span className="signup-login-text">이미 계정이 있으신가요?</span>
              <button type="button" className="signup-login-button" onClick={handleBackToLogin}>
                로그인하기
              </button>
            </div>
          </div>
        </div>

        <footer className="signup-footer">
          <div className="signup-footer-content">
            <div className="signup-footer-logo">
              <PiFlowerLotusLight size={16} />
              <span>Garden of Memory</span>
            </div>
            <p className="signup-footer-description">
              소중한 기억들을 영원히 간직할 수 있는 디지털 정원입니다.
            </p>
            <div className="signup-social-links">
              <a href="#" className="signup-social-link">
                <FiInstagram size={16} />
              </a>
              <a href="#" className="signup-social-link">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="signup-social-link">
                <FiFacebook size={16} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default SignupPage; 