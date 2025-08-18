import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeeklyReportPage.css'; // Assuming a CSS file for styling

const WeeklyReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Assuming the API is proxied correctly via vite.config.js
        const response = await fetch('/notifications-api/notifications/reports');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError(error);
        console.error("Failed to fetch weekly reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportClick = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  if (loading) {
    return <div className="weekly-report-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="weekly-report-container">오류 발생: {error.message}</div>;
  }

  return (
    <div className="weekly-report-container">
      <h1>주간 리포트</h1>
      {reports.length === 0 ? (
        <p>생성된 주간 리포트가 없습니다.</p>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <div key={report.id} className="report-card" onClick={() => handleReportClick(report.id)}>
              {(() => {
                const endDate = new Date(report.report_date);
                const startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 6); // Assuming week starts 6 days before end date (Sunday)

                const formattedStartDate = `${startDate.getMonth() + 1}.${startDate.getDate()}`;
                const formattedEndDate = `${endDate.getMonth() + 1}.${endDate.getDate()}`;

                return <h2>{formattedStartDate} ~ {formattedEndDate} 주간 리포트</h2>;
              })()}
              <p>인지 점수 평균: {report.report_data.summary.avg_cognitive_score}</p>
              <p>의미 점수 평균: {report.report_data.summary.avg_semantic_score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyReportPage;
