import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns'; // Assuming date-fns is available or will be installed
import { FaVolumeUp } from 'react-icons/fa'; // Import speaker icon
import './DailyQuestionQA.css'; // Import CSS file

const DailyQuestionQA = ({ elderlyId }) => {
  const [questions, setQuestions] = useState([]); // Changed from single question to array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null); // New state for currently playing audio

  const handlePlayAudio = (url) => {
    if (playingAudioUrl === url) {
      // If already playing, pause it
      setPlayingAudioUrl(null);
    } else {
      // Play new audio
      setPlayingAudioUrl(url);
    }
  };

  useEffect(() => {
    const fetchDailyQuestionAndAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        console.log('Auth Token from localStorage:', token); // Debugging line
        const headers = { 'Authorization': `Bearer ${token}` }; // Re-added headers
        console.log('Request Headers:', headers); // Debugging line
        const formattedTodayForLog = format(new Date(), 'yyyy-MM-dd');
        console.log('Fetching daily question for elderlyId:', elderlyId); // Debugging line

        // Define a broad date range for historical data
        const today = new Date();
        const tomorrow = addDays(today, 1); // Fetch data up to and including tomorrow
        const startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1); // Fetch data from the last year relative to today

        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(tomorrow, 'yyyy-MM-dd');

        // Fetch historical daily questions
        const questionsUrl = new URL(`http://52.220.34.136:8001/questions/daily-questions/history`); // Use history endpoint
        questionsUrl.searchParams.append('user_id', elderlyId);
        questionsUrl.searchParams.append('start_date', formattedStartDate);
        questionsUrl.searchParams.append('end_date', formattedEndDate);
        console.log('Attempting to fetch questions from URL:', questionsUrl.toString());
        const questionsResponse = await fetch(questionsUrl.toString(), { headers });
        if (!questionsResponse.ok) {
          throw new Error(`HTTP error! status: ${questionsResponse.status}`);
        }
        const questionsData = await questionsResponse.json();
        // setQuestion(questionsData); // No longer setting a single question

        // Fetch all answers for the elderly user within the same date range
        const answersUrl = new URL(`http://52.220.34.136:8001/questions/answers`);
        answersUrl.searchParams.append('user_id', elderlyId);
        answersUrl.searchParams.append('start_date', formattedStartDate);
        answersUrl.searchParams.append('end_date', formattedEndDate);
        console.log('Attempting to fetch answers from URL:', answersUrl.toString());
        const answersResponse = await fetch(answersUrl.toString(), { headers });
        if (!answersResponse.ok) {
          throw new Error(`HTTP error! status: ${answersResponse.status}`);
        }
        const answersData = await answersResponse.json();

        // Process data: Group answers by question
        const questionsWithAnswers = questionsData.map(q => ({
          ...q,
          answers: answersData.filter(a => a.question_id === q.id)
        }));

        // Sort questions by daily_date in descending order (most recent first)
        questionsWithAnswers.sort((a, b) => {
          return new Date(b.daily_date) - new Date(a.daily_date);
        });

        setQuestions(questionsWithAnswers); // Set a new state for questions array

      } catch (err) {
        console.error("Failed to fetch daily question and answers:", err);
        setError("오늘의 질문 및 답변을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (elderlyId) {
      fetchDailyQuestionAndAnswers();
    }
  }, [elderlyId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>질문 및 답변을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="daily-question-qa-container">
      <h2>질문 및 답변 기록</h2>
      <table className="qa-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>질문</th>
            <th>답변 내용</th>
            <th>음성 답변</th>
            <th>답변 시간</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <React.Fragment key={q.id}>
              {q.answers.length > 0 ? (
                q.answers.map((answer, index) => (
                  <tr key={answer.id || `${q.id}-${index}`}>
                    {index === 0 && ( // Display date and question only for the first answer of a question
                      <td rowSpan={q.answers.length}>
                        {format(new Date(q.daily_date), 'yyyy-MM-dd')}
                      </td>
                    )}
                    {index === 0 && ( // Display question only for the first answer of a question
                      <td rowSpan={q.answers.length}>
                        {q.content}
                      </td>
                    )}
                    <td>{answer.text_content}</td>
                    <td>
                      {answer.audio_file_url && (
                        <FaVolumeUp
                          style={{ cursor: 'pointer', color: playingAudioUrl === answer.audio_file_url ? 'green' : '#007bff' }}
                          onClick={() => handlePlayAudio(answer.audio_file_url)}
                        />
                      )}
                    </td>
                    <td>{format(new Date(answer.created_at), 'HH:mm')}</td>
                  </tr>
                ))
              ) : (
                <tr key={q.id}>
                  <td>{format(new Date(q.daily_date), 'yyyy-MM-dd')}</td>
                  <td>{q.content}</td>
                  <td>X</td> {/* Answer content is X */}
                  <td>X</td> {/* Voice answer is X */}
                  <td>X</td> {/* Answer time is X */}
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {playingAudioUrl && (
        <audio src={playingAudioUrl} autoPlay onEnded={() => setPlayingAudioUrl(null)} />
      )}
    </div>
  );
};

export default DailyQuestionQA;