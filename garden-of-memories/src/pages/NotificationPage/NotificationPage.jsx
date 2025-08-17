import React, { useState, useEffect } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // TODO: Replace with actual API call to notification-service GET /history
        // For now, simulate API call
        const dummyNotifications = [
          { id: 1, message: '새로운 보상을 획득했습니다: 지혜의 씨앗', timestamp: '2025-08-16 10:00:00', read: false },
          { id: 2, message: '오늘의 질문에 답변할 시간입니다.', timestamp: '2025-08-17 09:00:00', read: false },
          { id: 3, message: '주간 리포트가 생성되었습니다.', timestamp: '2025-08-15 18:00:00', read: true },
        ];
        setNotifications(dummyNotifications);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="notification-page-container">알림을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="notification-page-container">오류: {error.message}</div>;
  }

  return (
    <div className="notification-page-container">
      <div className="notification-page-content">
        <h1 className="notification-page-title">알림</h1>
        {notifications.length === 0 ? (
          <p>새로운 알림이 없습니다.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id} className={`notification-list-item ${notification.read ? 'read' : 'unread'}`}>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-timestamp">{notification.timestamp}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
