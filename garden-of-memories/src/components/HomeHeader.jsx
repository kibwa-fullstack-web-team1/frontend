import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHeader.css';

const HomeHeader = () => {
  const navigate = useNavigate();

  const handleEnterGarden = () => navigate('/login');
  const handleLinkClick = (e, path) => { 
    e.preventDefault(); 
    if (path) navigate(path); 
  };

  return (
    <header className="home-header-container home-header-frosted">
      <div className="home-header-logo">
        <div className="home-header-logo-mark">GoM</div>
        <h1 className="home-header-brand">
          <span className="home-serif">GARDEN</span> <span className="home-header-of">of</span> <span className="home-serif">MEMORIES</span>
        </h1>
      </div>
      <nav className="home-header-nav">
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>활동</a>
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>소개</a>
        <a href="#" className="home-header-nav-link" onClick={(e)=>handleLinkClick(e)}>문의</a>
        <button className="home-header-login-btn" onClick={handleEnterGarden}>로그인</button>
      </nav>
    </header>
  );
};

export default HomeHeader;
