import React from 'react';
import { FaFileAlt, FaBell, FaQuestionCircle } from 'react-icons/fa';
import './ActionSelectionModal.css';

const ActionSelectionModal = ({ onClose, onReportsClick, onNotificationsClick, onDailyQuestionQAClick }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>무엇을 하시겠습니까?</h2>
        <div className="modal-actions">
          <button onClick={onReportsClick}><FaFileAlt /> 주간 리포트 보기</button>
          <button onClick={onDailyQuestionQAClick}><FaQuestionCircle /> 오늘의 질답 확인하기</button>
          <button onClick={onNotificationsClick}><FaBell /> 알림 기록 보기</button>
        </div>
        <button onClick={onClose} className="modal-close-button">닫기</button>
      </div>
    </div>
  );
};

export default ActionSelectionModal;
