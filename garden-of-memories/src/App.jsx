// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import CardGamePage from './pages/CardGamePage/CardGamePage';
import GameSelectPage from './pages/GameSelectPage/GameSelectPage';
import CardGameDashboard from './pages/CardGameDashboard/CardGameDashboard';
import GameSelectDashboard from './pages/GameSelectDashboard/GameSelectDashboard';
import StoryGameDashboard from './pages/StoryGameDashboard/StoryGameDashboard';
import GardenPage from './pages/GardenPage/GardenPage';
import DailyQuestionPage from './pages/DailyQuestionPage/DailyQuestionPage';
import DailyQuestionDashboard from './pages/DailyQuestionDashboard/DailyQuestionDashboard';
import StorySequence from './pages/StorySequence/StorySequence';
import HomePage from './pages/HomePage/HomePage';
import NotificationPage from './pages/NotificationPage/NotificationPage';
import WeeklyReportPage from './pages/WeeklyReportPage/WeeklyReportPage';
import ReportDetailPage from './pages/ReportDetailPage/ReportDetailPage';
import FamilyTestPage from './pages/FamilyTestPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 홈 페이지 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* 인증 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 게임 페이지들 */}
        <Route path="/card-game" element={<CardGamePage />} />
        <Route path="/game-select" element={<GameSelectPage />} />
        <Route path="/game-select-dashboard" element={<GameSelectDashboard />} />
        <Route path="/daily-question" element={<DailyQuestionPage />} />
        <Route path="/daily-question-dashboard" element={<DailyQuestionDashboard />} />
        <Route path="/card-game-dashboard" element={<CardGameDashboard />} />
        <Route path="/story-game-dashboard" element={<StoryGameDashboard />} />
        <Route path="/garden" element={<GardenPage />} />
        <Route path="/story-sequence" element={<StorySequence />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/reports" element={<WeeklyReportPage />} />
        <Route path="/reports/:reportId" element={<ReportDetailPage />} />
        
        {/* 테스트 페이지 */}
        <Route path="/family-test" element={<FamilyTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
