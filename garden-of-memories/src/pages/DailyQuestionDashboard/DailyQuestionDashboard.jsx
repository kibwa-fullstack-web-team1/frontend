import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FamilyHeader from '../../components/FamilyHeader';
import ActionSelectionModal from '../../components/ActionSelectionModal';
import DataDisplayModal from '../../components/DataDisplayModal';
import NotificationHistory from '../../components/NotificationHistory';
import DailyQuestionQA from '../../components/DailyQuestionQA';
import './DailyQuestionDashboard.css';

const DailyQuestionDashboard = () => {
  const [elderlyList, setElderlyList] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [loadingElderly, setLoadingElderly] = useState(true);
  const [errorElderly, setErrorElderly] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showDailyQuestionQAModal, setShowDailyQuestionQAModal] = useState(false); // New state for Daily Question QA modal
  const [modalView, setModalView] = useState(null); // 'reports' or 'notifications' or 'dailyQuestionQA'

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [errorReports, setErrorReports] = useState(null);

  const navigate = useNavigate();
  const guardianId = 11; // TODO: This should be dynamically set

  useEffect(() => {
    const fetchElderlyList = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/users-api/family/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.seniors) {
          setElderlyList(data.seniors);
        }
      } catch (err) {
        setErrorElderly(err.message);
      } finally {
        setLoadingElderly(false);
      }
    };
    fetchElderlyList();
  }, [navigate]);

  useEffect(() => {
    if (modalView === 'reports' && selectedElderly) {
      const fetchReports = async () => {
        setLoadingReports(true);
        setErrorReports(null);
        try {
          const response = await fetch(`/notifications-api/notifications/reports?user_id=${selectedElderly.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setReports(data);
        } catch (error) {
          setErrorReports(error.message);
        } finally {
          setLoadingReports(false);
        }
      };
      fetchReports();
    }
  }, [modalView, selectedElderly]);

  const handleElderlySelect = (elderly) => {
    setSelectedElderly(elderly);
    setShowActionModal(true);
  };

  const handleShowReports = () => {
    setModalView('reports');
    setShowActionModal(false);
    setShowDataModal(true);
  };

  const handleShowNotifications = () => {
    setModalView('notifications');
    setShowActionModal(false);
    setShowDataModal(true);
  };

  const handleShowDailyQuestionQA = () => { // New handler for Daily Question QA
    setShowActionModal(false);
    setShowDailyQuestionQAModal(true);
  };

  const closeModal = () => {
    setShowDataModal(false);
    setShowDailyQuestionQAModal(false); // Close Daily Question QA modal as well
    setModalView(null);
    setSelectedElderly(null);
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return { category: '좋음', color: '#22C55E' };
    if (score >= 50) return { category: '보통', color: '#F59E0B' };
    return { category: '개선 필요', color: '#EF4444' };
  };

  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check if date is valid
      console.error("Invalid date string for getWeekOfMonth:", dateString); // Log the problematic string
      return "날짜 오류"; // Fallback string
    }
    const year = date.getFullYear(); // Not strictly needed for month/week of month, but harmless
    const month = date.getMonth(); // 0-indexed
    const dayOfMonth = date.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);

    return `${month + 1}월 ${weekNumber}주차`;
  };

  return (
    <div className="dq-app">
      <FamilyHeader 
        title="오늘의 질문 보호자 대시보드"
        onBackClick={() => navigate('/')}
      />
      <main className="dq-main-container">
        <div className="dq-elderly-selector-content">
          <h1 className="dq-elderly-selector-title">피보호자 선택</h1>
          <p>정보를 확인할 피보호자를 선택해주세요.</p>
          {loadingElderly && <p>로딩 중...</p>}
          {errorElderly && <p>오류: {errorElderly}</p>}
          {elderlyList.length > 0 ? (
            <ul className="dq-elderly-list">
              {elderlyList.map((elderly) => (
                <li key={elderly.id} className="dq-elderly-list-item" onClick={() => handleElderlySelect(elderly)}>
                  {elderly.username} {elderly.relationship_type ? `(${elderly.relationship_type})` : ''}
                </li>
              ))}
            </ul>
          ) : (
            !loadingElderly && <p>연결된 피보호자가 없습니다.</p>
          )}
        </div>
      </main>

      {showActionModal && (
        <ActionSelectionModal 
          onClose={() => setShowActionModal(false)}
          onReportsClick={handleShowReports}
          onNotificationsClick={handleShowNotifications}
          onDailyQuestionQAClick={handleShowDailyQuestionQA} // New prop for Daily Question QA
        />
      )}

      {showDataModal && selectedElderly && (
        <DataDisplayModal 
          title={modalView === 'reports' ? `${selectedElderly.username}님의 주간 리포트` : `${selectedElderly.username}님 관련 알림`}
          onClose={closeModal}
        >
          {modalView === 'reports' && (
            <div>
              {loadingReports && <p>리포트를 불러오는 중...</p>}
              {errorReports && <p>오류: {errorReports}</p>}
              {reports.length > 0 ? (
                <div className="dq-reports-list">
                  {reports.map((report) => (
                    <div 
                      key={report.id} 
                      className="dq-report-card"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <h3 className="dq-report-title">
                        {report.report_date ? `${getWeekOfMonth(report.report_date)} 리포트` : '날짜 정보 없음'}
                      </h3>
                      <p className="dq-report-score">
                        인지 점수 평균: {report.report_data.summary.avg_cognitive_score}
                        <span style={{ color: getScoreCategory(parseFloat(report.report_data.summary.avg_cognitive_score)).color }}>
                          ({getScoreCategory(parseFloat(report.report_data.summary.avg_cognitive_score)).category})
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                !loadingReports && <p>생성된 주간 리포트가 없습니다.</p>
              )}
            </div>
          )}
          {modalView === 'notifications' && (
            <NotificationHistory guardianId={guardianId} selectedElderly={selectedElderly} />
          )}
        </DataDisplayModal>
      )}

      {showDailyQuestionQAModal && selectedElderly && (
        <DataDisplayModal
          title={`${selectedElderly.username}님의 오늘의 질문 질의응답`}
          onClose={closeModal}
        >
          {/* Placeholder for DailyQuestionQA component */}
          <DailyQuestionQA elderlyId={selectedElderly.id} />
        </DataDisplayModal>
      )}
    </div>
  );
};

export default DailyQuestionDashboard;
