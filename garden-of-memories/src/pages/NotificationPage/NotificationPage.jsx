import React, { useState, useEffect } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5); // Display 5 notifications per page

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/notifications-api/notifications/history?recipient_user_id=11&skip=${skip}&limit=${limit}`); // TODO: 테스트용. 실제로는 로그인한 보호자의 user ID로 대체해야 합니다.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data.map(log => ({
          id: log.id,
          message: log.message,
          timestamp: new Date(log.sent_at).toLocaleString(), // Format timestamp
          read: false, // Assuming all fetched are unread for now, or add a 'read' field to backend
          triggering_user_id: log.triggering_user_id,
          recipient_user_id: log.recipient_user_id,
        })));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [skip, limit]);

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
        <div className="pagination-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setSkip(prevSkip => Math.max(0, prevSkip - limit))}
            disabled={skip === 0}
            style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
          >
            이전 페이지
          </button>
          <button
            onClick={() => setSkip(prevSkip => prevSkip + limit)}
            disabled={notifications.length < limit} // Simple check for last page
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            다음 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
