import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReportDetailPage.css'; // Assuming a CSS file for styling

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Fetch a single report by ID. The backend API currently returns all reports.
        // We will filter on the client-side for now.
        // Ideally, there should be a backend endpoint like /notifications/reports/{reportId}
        const response = await fetch('/notifications-api/notifications/reports');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const selectedReport = data.find(r => r.id === parseInt(reportId));
        if (selectedReport) {
          setReport(selectedReport);
        } else {
          setError(new Error("Report not found."));
        }
      } catch (error) {
        setError(error);
        console.error("Failed to fetch report details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]); // Re-fetch if reportId changes

  if (loading) {
    return <div className="report-detail-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="report-detail-container">오류 발생: {error.message}</div>;
  }

  if (!report) {
    return <div className="report-detail-container">보고서를 찾을 수 없습니다.</div>;
  }

  const endDate = new Date(report.report_date);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6); // Assuming week starts 6 days before end date (Sunday)

  const getScoreCategory = (score) => {
    if (score >= 80) {
      return { category: '좋음', color: 'green' };
    } else if (score >= 50) {
      return { category: '보통', color: 'orange' };
    } else {
      return { category: '개선 필요', color: 'red' };
    }
  };

  return (
    <div className="report-detail-container">
      <h1>{`${startDate.getMonth() + 1}.${startDate.getDate()} ~ ${endDate.getMonth() + 1}.${endDate.getDate()}`} 주간 리포트 상세</h1>
      <h2>{report.report_data.username}님</h2>
      <h3>요약</h3>
      <ul>
        <li>
          인지 점수 평균: {report.report_data.summary.avg_cognitive_score}
          <span style={{ color: getScoreCategory(parseFloat(report.report_data.summary.avg_cognitive_score)).color }}>
            ({getScoreCategory(parseFloat(report.report_data.summary.avg_cognitive_score)).category})
          </span>
        </li>
        <li>
          의미 점수 평균: {report.report_data.summary.avg_semantic_score}
          <span style={{ color: getScoreCategory(parseFloat(report.report_data.summary.avg_semantic_score)).color }}>
            ({getScoreCategory(parseFloat(report.report_data.summary.avg_semantic_score)).category})
          </span>
        </li>
        <li>최저 인지 점수: {report.report_data.summary.min_cognitive_score}</li>
        <li>최고 인지 점수: {report.report_data.summary.max_cognitive_score}</li>
        <li>최저 의미 점수: {report.report_data.summary.min_semantic_score}</li>
        <li>최고 의미 점수: {report.report_data.summary.max_semantic_score}</li>
      </ul>
      <h3>상세 답변 내역</h3>
      {report.report_data.answers && report.report_data.answers.length > 0 ? (
        <table className="answers-table">
          <thead>
            <tr>
              <th>질문</th>
              <th>답변</th>
              <th>인지 점수</th>
              <th>의미 점수</th>
            </tr>
          </thead>
          <tbody>
            {report.report_data.answers.map((answer, index) => (
              <tr key={index}>
                <td>{answer.question_content}</td>
                <td>{answer.text_content}</td>
                <td>{answer.cognitive_score}</td>
                <td>{answer.semantic_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>답변 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default ReportDetailPage;
