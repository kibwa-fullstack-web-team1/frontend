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
import StorySequence from './pages/StorySequence/StorySequence';
import EnterPage from './pages/EnterPage/EnterPage';
import FamilyPage from './pages/FamilyPage/FamilyPage';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/card-game" element={<CardGamePage />} />
        <Route path="/game-select" element={<GameSelectPage />} />
        <Route path="/game-select-dashboard" element={<GameSelectDashboard />} />
        <Route path="/daily-question" element={<DailyQuestionPage />} />
        <Route path="/card-game-dashboard" element={<CardGameDashboard />} />
        <Route path="/story-game-dashboard" element={<StoryGameDashboard />} />
        <Route path="/garden" element={<GardenPage />} />
        <Route path="/story-sequence" element={<StorySequence />} />
        <Route path="/enter" element={<EnterPage />} />
        <Route path="/family" element={<FamilyPage />} />
      </Routes>
    </Router>
  );
}

// test
// function App() {
//   return <MyPage />;
// }

export default App;