import React, { useState, useEffect } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [elderlyList, setElderlyList] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [loadingElderly, setLoadingElderly] = useState(true);
  const [errorElderly, setErrorElderly] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);

  const guardianId = 11; // TODO: This should be dynamically set based on the logged-in user.

  useEffect(() => {
    const fetchElderlyList = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/users-api/family/members`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        const data = await response.json();
        // The response is an object with 'seniors' and 'guardians' arrays.
        if (data && data.seniors) {
          setElderlyList(data.seniors);
        }
      } catch (err) {
        setErrorElderly(err);
      } finally {
        setLoadingElderly(false);
      }
    };

    fetchElderlyList();
  }, [navigate]); // guardianId is no longer a dependency

  useEffect(() => {
    if (!selectedElderly) {
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Verify that the notification API supports filtering by triggering_user_id.
        const response = await fetch(`/notifications-api/notifications/history?recipient_user_id=${guardianId}&triggering_user_id=${selectedElderly.id}&skip=${skip}&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data.map(log => ({
          id: log.id,
          message: log.message,
          timestamp: new Date(log.sent_at).toLocaleString(),
          read: false, // This could be based on a 'read_at' field from the backend.
        })));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [selectedElderly, skip, limit, guardianId]);

  const handleSelectElderly = (elderly) => {
    setSelectedElderly(elderly);
    setSkip(0);
    setNotifications([]);
  };

  const handleBackToSelection = () => {
    setSelectedElderly(null);
    setNotifications([]);
    setError(null);
    setSkip(0);
  };

  if (loadingElderly) {
    return <div className="notification-page-container">보호중인 어르신 목록을 불러옵니다...</div>;
  }

  if (errorElderly) {
    return <div className="notification-page-container">오류: {errorElderly.message}</div>;
  }

  if (!selectedElderly) {
    return (
      <div className="notification-page-container">
        <div className="notification-page-content">
          <h1 className="notification-page-title">어르신 선택</h1>
          <p>알림을 확인할 어르신을 선택해주세요.</p>
          {elderlyList.length > 0 ? (
            <ul className="elderly-list">
              {elderlyList.map((elderly) => (
                <li key={elderly.id} className="elderly-list-item" onClick={() => handleSelectElderly(elderly)}>
                  {elderly.name || `어르신 (ID: ${elderly.id})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>연결된 어르신이 없습니다. 보호자-어르신 관계를 설정해주세요.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="notification-page-container">
      <div className="notification-page-content">
        <button onClick={handleBackToSelection} style={{ marginBottom: '1rem', float: 'left', cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}>
          &larr; 목록으로
        </button>
        <h1 className="notification-page-title" style={{ clear: 'both' }}>
          {selectedElderly.name || `어르신 (ID: ${selectedElderly.id})`} 관련 알림
        </h1>
        {loading ? (
          <p>알림을 불러오는 중...</p>
        ) : error ? (
          <p>오류: {error.message}</p>
        ) : notifications.length === 0 ? (
          <p>관련 알림이 없습니다.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id} className={`notification-list-item unread`}>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-timestamp">{notification.timestamp}</div>
              </li>
            ))}
          </ul>
        )}
        <div className="pagination-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setSkip(prevSkip => Math.max(0, prevSkip - limit))}
            disabled={skip === 0 || loading}
            style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
          >
            이전
          </button>
          <button
            onClick={() => setSkip(prevSkip => prevSkip + limit)}
            disabled={notifications.length < limit || loading}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;