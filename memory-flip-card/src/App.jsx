// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import CardGamePage from './pages/CardGamePage/CardGamePage';
import GameSelectPage from './pages/GameSelectPage/GameSelectPage';
import CardGameDashboard from './pages/CardGameDashboard/CardGameDashboard';
import StoryGameDashboard from './pages/StoryGameDashboard/StoryGameDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/game" element={<CardGamePage />} />
        <Route path="/game-select" element={<GameSelectPage />} />
        <Route path="/card-game-dashboard" element={<CardGameDashboard />} />
        <Route path="/story-game-dashboard" element={<StoryGameDashboard />} />
      </Routes>
    </Router>
  );
}

// test
// function App() {
//   return <MyPage />;
// }

export default App;
