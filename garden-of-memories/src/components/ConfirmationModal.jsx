import React from 'react';
import './ConfirmationModal.css'; // Will create this CSS file

const ConfirmationModal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>새로운 추억 앨범이 생성되었습니다!</h2>
        {imageUrl && (
          <img src={imageUrl} alt="새로운 추억 앨범" className="new-reward-thumbnail" />
        )}
        <p>정원에서 확인해보세요.</p>
        <button onClick={onClose} className="modal-close-button">닫기</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;