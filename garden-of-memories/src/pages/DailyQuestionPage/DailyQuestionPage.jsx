import React, { useState, useEffect } from 'react';
import { getDailyQuestion, submitVoiceAnswer, getCurrentUser } from '../../services/api';
import { FiMic, FiMicOff } from 'react-icons/fi'; // Import icons
import './DailyQuestionPage.css';

function DailyQuestionPage() {
  const [question, setQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [userId, setUserId] = useState(null); // Initialize with null
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true); // New loading state

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log("getCurrentUser result:", currentUser);
    if (currentUser && currentUser.id) {
      setUserId(currentUser.id);
      console.log("UserId set to:", currentUser.id);
    } else {
      console.warn("User ID not found. Please log in.");
      // Optionally, redirect to login page if not logged in
    }
  }, []);

  useEffect(() => {
    console.log("UserId in second useEffect:", userId);
    if (userId) {
      handleGetDailyQuestion();
    }
  }, [userId]); // Fetch question when userId becomes available

  const handleGetDailyQuestion = async () => {
    console.log("Calling getDailyQuestion with userId:", userId);
    setIsLoadingQuestion(true); // Start loading
    try {
      const dailyQuestion = await getDailyQuestion(userId);
      setQuestion(dailyQuestion);
    } catch (error) {
      console.error('Failed to fetch daily question:', error);
      // Handle error, e.g., display an error message to the user
    } finally {
      setIsLoadingQuestion(false); // End loading
    }
  };

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);

        const audioChunks = [];
        recorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
          setAudioBlob(audioBlob);
        };
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userId) {
      console.error("User ID is not available. Cannot submit answer.");
      return;
    }
    if (audioBlob && question) {
      try {
        const response = await submitVoiceAnswer(question.id, userId, audioBlob);
        console.log('Answer submitted successfully:', response);
        // Handle successful submission (e.g., show a success message)
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }
  };

  return (
    <div className="daily-question-page home-gom-theme">
      {/* 배경 장식 */}
      <div className="home-gom-bg"/>
      <div className="home-petals">
        {/* 첫 번째 레이어 - 기본 꽃잎들 */}
        <span className="home-petal home-p1" />
        <span className="home-petal home-p2" />
        <span className="home-petal home-p3" />
        <span className="home-petal home-p4" />
        <span className="home-petal home-p5" />
        <span className="home-petal home-p6" />
        
        {/* 두 번째 레이어 - 추가 꽃잎들 */}
        <span className="home-petal home-p7" />
        <span className="home-petal home-p8" />
        
        {/* 세 번째 레이어 - 작은 꽃잎들 */}
        <span className="home-petal home-petal-small home-p13" />
        <span className="home-petal home-petal-small home-p14" />
        <span className="home-petal home-petal-small home-p15" />
        
        {/* 네 번째 레이어 - 큰 꽃잎들 */}
        <span className="home-petal home-petal-large home-p17" />
        <span className="home-petal home-petal-large home-p18" />
      </div>

      {/* 식물 잎사귀 장식 */}
      <div className="login-leaf-decoration">
        <div className="login-leaf login-leaf-top-right"></div>
        <div className="login-leaf login-leaf-bottom-right"></div>
        <div className="login-leaf login-leaf-bottom-left"></div>
      </div>

      <div className="daily-question-content-wrapper">
        {isLoadingQuestion ? (
          <p className="loading-message">오늘의 질문을 생성중이에요...</p>
        ) : question ? (
          <>
            <h1>오늘의 질문</h1>
            <p className="question-text">{question.content}</p>
            
            <div className="recording-controls">
              {!isRecording ? (
                <button onClick={handleStartRecording} disabled={!userId} className="recording-button">
                  <FiMic size={24} /> 답변 녹음 시작
                </button>
              ) : (
                <button onClick={handleStopRecording} disabled={!userId} className="recording-button stop-recording">
                  <FiMicOff size={24} /> 답변 녹음 중지
                </button>
              )}
              {isRecording && <div className="recording-indicator"></div>}
            </div>

            {audioBlob && (
              <div className="audio-playback">
                <audio src={URL.createObjectURL(audioBlob)} controls />
              </div>
            )}

            <button onClick={handleSubmitAnswer} disabled={!audioBlob || !question || !userId} className="recording-button submit-answer">
              답변 제출
            </button>
          </>
        ) : (
          <p className="error-message">질문을 불러오지 못했습니다.</p>
        )}
      </div>
    </div>
  );
}

export default DailyQuestionPage;
