import React from 'react';
import './ServiceLinksModal.css'; // Will create this CSS file

const ServiceLinksModal = ({ onClose }) => {
  const services = [
    { name: '오늘의 질문', link: '/daily-question' },
    { name: '이야기 순서 맞추기', link: '/story-sequencer' },
    { name: '추억 카드 뒤집기', link: '/memory-flip-card' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>새로운 추억을 만들기 위한, <br></br>우리의 인연이 조금 모자라요!</h2>
        <p>'기억의 정원'과 더 많은 인연을 쌓아볼까요?</p>
        <div className="service-links">
          {services.map((service, index) => (
            <a key={index} href={service.link} className="service-link">
              {service.name}
            </a>
          ))}
        </div>
        <button onClick={onClose} className="modal-close-button">닫기</button>
      </div>
    </div>
  );
};

export default ServiceLinksModal;