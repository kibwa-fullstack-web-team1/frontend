import React, { useState, useEffect } from 'react';
import './NotificationHistory.css';

const NotificationHistory = ({ guardianId, selectedElderly }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (!selectedElderly) {
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/notifications-api/notifications/history?recipient_user_id=${guardianId}&triggering_user_id=${selectedElderly.id}&skip=${skip}&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(prev => skip === 0 ? data : [...prev, ...data]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [selectedElderly, skip, limit, guardianId]);

  return (
    <div className="notification-history-container">
      {loading && <p>알림을 불러오는 중...</p>}
      {error && <p>오류: {error.message}</p>}
      {notifications.length === 0 && !loading && <p>관련 알림이 없습니다.</p>}
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li key={notification.id} className={`notification-list-item unread`}>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-timestamp">{new Date(notification.sent_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {notifications.length >= limit && (
        <button onClick={() => setSkip(prev => prev + limit)} disabled={loading}>
          더 보기
        </button>
      )}
    </div>
  );
};

export default NotificationHistory;
