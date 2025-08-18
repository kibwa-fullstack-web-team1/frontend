import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ElderlyHeader from '../../components/ElderlyHeader';

import './DailyQuestionPage.css';

function DailyQuestionPage() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // 실제 녹음 기능은 여기에 구현
  };

  return (
    <div className="daily-question-page">
      <ElderlyHeader 
        title="오늘의 질문" 
        subtitle="오늘의 질문에 답해보세요"
        onBackClick={handleBackToHome}
      />

      <main className="daily-main-content">
        {/* Question Card */}
        <div className="daily-question-card">
          <div className="daily-question-content">
            <p className="daily-question-text">
              어린 시절 가장 기억에 남는 가족 여행은 어디였나요?
            </p>
          </div>
          
          <div className="daily-button-group">
            <button 
              className="daily-record-button"
              onClick={handleRecording}
            >
              <div className="daily-record-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3" fill="#000000"/>
                  <path d="M10 2V6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14V18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="daily-record-text">녹음하기</span>
            </button>
            
            <button 
              className="daily-listen-button"
              onClick={() => {/* 다시 듣기 기능 */}}
            >
              <div className="daily-listen-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L10 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 8L10 2L16 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="daily-listen-text">다시 듣기</span>
            </button>
          </div>
        </div>

        {/* Recording Tips */}
        <div className="daily-tips-card">
          <h3 className="daily-tips-title">💡 녹음 팁</h3>
          <ul className="daily-tips-list">
            <li className="daily-tip-item">조용한 곳에서 녹음해주세요</li>
            <li className="daily-tip-item">마이크에 가까이 말씀해주세요</li>
            <li className="daily-tip-item">천천히 또박또박 말씀해주세요</li>
            <li className="daily-tip-item">언제든지 다시 녹음할 수 있어요</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default DailyQuestionPage;
