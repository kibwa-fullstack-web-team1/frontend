import React from 'react';
import './EnterPage.css';

const cards = [
  { id: 1, title: 'MEMORY', subtitle: '기억력 향상을 돕는 매칭 게임', tone: 'cream' },
  { id: 2, title: 'MEMORY', subtitle: '패턴 인지 훈련', tone: 'ivory' },
  { id: 3, title: 'GAME CATEGORIES', subtitle: '퍼즐/카드/퀴즈 모음', tone: 'white' },
  { id: 4, title: 'Nerory', subtitle: '주의집중 강화 활동', tone: 'peach' },
  { id: 5, title: 'HOSK', subtitle: '인지 자극 퍼즐', tone: 'sage' },
  { id: 6, title: 'LIIKSE', subtitle: '스토리 기억 훈련', tone: 'sand' },
  { id: 7, title: 'WELMORT', subtitle: '순서 기억 퍼즐', tone: 'gray' },
];

function FlowerSVG() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="10" stroke="#28231D" strokeWidth="2"/>
      <path d="M28 18c-6 0-8-6-8-8 4 0 8 2 8 8z" stroke="#28231D" strokeWidth="2" fill="none"/>
      <path d="M28 18c6 0 8-6 8-8-4 0-8 2-8 8z" stroke="#28231D" strokeWidth="2" fill="none"/>
      <path d="M18 28c0-6-6-8-8-8 0 4 2 8 8 8z" stroke="#28231D" strokeWidth="2" fill="none"/>
      <path d="M38 28c0-6 6-8 8-8 0 4-2 8-8 8z" stroke="#28231D" strokeWidth="2" fill="none"/>
      <path d="M28 38c-6 0-8 6-8 8 4 0 8-2 8-8z" stroke="#28231D" strokeWidth="2" fill="none"/>
      <path d="M28 38c6 0 8 6 8 8-4 0-8-2-8-8z" stroke="#28231D" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export default function GardenHome() {
  return (
    <div className="gom-page">
      {/* 배경 장식 (꽃잎) */}
      <div className="petals">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="petal" style={{ '--i': i }} />
        ))}
      </div>

      <header className="gom-header">
        <div className="brand">
          <span className="brand-top">GARDEN</span>
          <span className="brand-sub">of MEMORIES</span>
        </div>
        <nav className="actions">
          <button className="icon-btn" aria-label="Search">🔍</button>
          <button className="icon-btn" aria-label="Profile">👤</button>
        </nav>
      </header>

      <main className="gom-main">
        <h1 className="gom-title">Garden of Memories</h1>
        <p className="gom-sub">GAME CATEGORIES</p>

        <section className="cards">
          {cards.map((c) => (
            <article key={c.id} className={`card tone-${c.tone}`}>
              <div className="card-art">
                <FlowerSVG />
              </div>
              <div className="card-body">
                <h3 className="card-title">{c.title}</h3>
                <p className="card-desc">{c.subtitle}</p>
              </div>
            </article>
          ))}

          {/* 강조 카드 (우하단 강조 박스) */}
          <article className="card featured">
            <div className="wreath">
              <span className="berry" />
              <span className="leaf l1" />
              <span className="leaf l2" />
            </div>
            <div className="card-body">
              <h3 className="card-title">SPECIAL</h3>
              <p className="card-desc">추천 활동</p>
            </div>
          </article>
        </section>

        <div className="dots">
          <span className="dot" />
          <span className="dot active" />
          <span className="dot" />
        </div>
      </main>
    </div>
  );
}
