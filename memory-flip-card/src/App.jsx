// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import GamePage from './pages/GamePage/GamePage';
import UploadPage from './pages/UploadPage/UploadPage';
import GameSelectPage from './pages/GameSelectPage/GameSelectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/game-select" element={<GameSelectPage />} />
      </Routes>
    </Router>
  );
}

// test
// function App() {
//   return <MyPage />;
// }

export default App;
