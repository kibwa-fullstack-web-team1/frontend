import React, { useState } from 'react';
import './FamilyPage.css';

const FamilyPage = () => {
  const [phone, setPhone] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (phone.trim() !== '') {
      // TODO: API 호출하여 인증번호 발송 로직 추가
      alert(`인증번호를 ${phone}으로 발송했습니다.`);
      // 임시로 바로 추가
      setFamilyMembers([...familyMembers, { id: Date.now(), phone, verified: false }]);
      setPhone('');
    }
  };

  return (
    <div className="family-page-container">
      <div className="family-page-content">
        <h1 className="family-page-title">가족 관리</h1>
        <p className="family-page-description">알림을 받을 가족의 연락처를 등록하고 관리하세요.</p>

        <form onSubmit={handleAddMember} className="add-member-form">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호를 입력하세요"
            className="phone-input"
          />
          <button type="submit" className="add-button">인증번호 발송</button>
        </form>

        <div className="family-list-container">
          <h2 className="family-list-title">등록된 가족</h2>
          <ul className="family-list">
            {familyMembers.map((member) => (
              <li key={member.id} className="family-list-item">
                <span>{member.phone}</span>
                {member.verified ? (
                  <span className="status-verified">인증 완료</span>
                ) : (
                  <span className="status-pending">인증 대기중</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FamilyPage;