import React, { useEffect, useState } from 'react';
import './WeeklyReportPage.css'; // Assuming a CSS file for styling

const WeeklyReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Assuming the API is proxied correctly via vite.config.js
        const response = await fetch('/notifications/reports');
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
            <div key={report.id} className="report-card">
              <h2>{report.report_data.username}님의 주간 리포트</h2>
              <p>리포트 날짜: {new Date(report.report_date).toLocaleDateString()}</p>
              <h3>요약</h3>
              <ul>
                <li>인지 점수 평균: {report.report_data.summary.avg_cognitive_score}</li>
                <li>의미 점수 평균: {report.report_data.summary.avg_semantic_score}</li>
              </ul>
              <h3>상세 답변 내역</h3>
              {report.report_data.answers && report.report_data.answers.length > 0 ? (
                <ul>
                  {report.report_data.answers.map((answer, index) => (
                    <li key={index}>
                      <strong>질문:</strong> {answer.question_content}<br />
                      <strong>답변:</strong> {answer.text_content}<br />
                      (인지: {answer.cognitive_score}, 의미: {answer.semantic_score})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>답변 내역이 없습니다.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyReportPage;
