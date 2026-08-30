import { useState, useRef, useCallback } from 'react';
import './SparkSection.css';

const sparkValues = [
  {
    letter: 'S',
    title: 'Skill',
    desc: 'We build strong technical skills and practical knowledge to create competent professionals.',
    color: '#1a7a8a',
  },
  {
    letter: 'P',
    title: 'Progress',
    desc: 'We strive for continuous improvement and embrace innovation to achieve a better tomorrow.',
    color: '#2e7d32',
  },
  {
    letter: 'A',
    title: 'Achievement',
    desc: 'We aim for excellence in everything we do and celebrate every milestone with pride.',
    color: '#c8963e',
  },
  {
    letter: 'R',
    title: 'Responsibility',
    desc: 'We encourage a sense of duty, discipline and ethical values towards society and the environment.',
    color: '#c62828',
  },
  {
    letter: 'K',
    title: 'Knowledge',
    desc: 'We believe in continuous learning, exploring ideas and gaining deeper understanding.',
    color: '#6a1b9a',
  },
];

// Positions for 5 letters around the circle (top, right, bottom-right, bottom-left, left)
const letterPositions = [
  { top: '0%', left: '50%', popupDir: 'right' },   // S - top center
  { top: '28%', left: '100%', popupDir: 'left' },   // P - right
  { top: '82%', left: '88%', popupDir: 'left' },    // A - bottom right
  { top: '82%', left: '12%', popupDir: 'right' },   // R - bottom left
  { top: '28%', left: '0%', popupDir: 'right' },    // K - left
];

function SparkSection() {
  const [activeIdx, setActiveIdx] = useState(null);
  const timeoutRef = useRef(null);

  const handleEnter = useCallback((i) => {
    clearTimeout(timeoutRef.current);
    setActiveIdx(i);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveIdx(null), 200);
  }, []);

  return (
    <section className="spark-section">
      <div className="spark-inner">
        <h2 className="spark-college-name">Satara Polytechnic, Satara</h2>
        <p className="spark-subtitle">Our Word. Our Promise.</p>
        <h3 className="spark-heading">
          <span className="spark-s">S</span>
          <span className="spark-p">P</span>
          <span className="spark-a">A</span>
          <span className="spark-r">R</span>
          <span className="spark-k">K</span>
        </h3>

        <div className="spark-circle-area">
          {/* The wheel */}
          <div className="spark-wheel-ring">
            {/* SVG decorative ring */}
            <svg className="spark-ring-svg" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="110" fill="none" stroke="#e4e8ed" strokeWidth="2" strokeDasharray="4 4"/>
              {/* Connecting lines from center to each letter */}
              {letterPositions.map((pos, i) => (
                <line
                  key={i}
                  x1="120" y1="120"
                  x2={parseFloat(pos.left) / 100 * 240}
                  y2={parseFloat(pos.top) / 100 * 240}
                  stroke={activeIdx === i ? sparkValues[i].color : '#e4e8ed'}
                  strokeWidth={activeIdx === i ? 2 : 1}
                  strokeDasharray={activeIdx === i ? 'none' : '3 3'}
                  style={{ transition: 'all 0.3s ease' }}
                />
              ))}
            </svg>

            {/* Center */}
            <div className="spark-wheel-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.5" className="spark-center-icon">
                <circle cx="12" cy="7" r="4"/>
                <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/>
              </svg>
            </div>

            {/* Fixed letter dots */}
            {sparkValues.map((v, i) => {
              const pos = letterPositions[i];
              const isActive = activeIdx === i;

              return (
                <div key={v.letter} className="spark-dot-wrap" style={{ top: pos.top, left: pos.left }}>
                  <button
                    className={`spark-dot ${isActive ? 'active' : ''}`}
                    style={{ '--dot-color': v.color }}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={handleLeave}
                  >
                    {v.letter}
                  </button>

                  {/* Popup next to this letter */}
                  {isActive && (
                    <div
                      className={`spark-popup popup-${pos.popupDir}`}
                      style={{ '--popup-color': v.color }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={handleLeave}
                    >
                      <h4 className="spark-popup-title">
                        <span style={{ color: v.color }}>{v.letter}</span> – {v.title}
                      </h4>
                      <p className="spark-popup-desc">{v.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="spark-tagline">
          <span className="spark-tag-s">S</span><span className="spark-tag-p">P</span><span className="spark-tag-a">A</span><span className="spark-tag-r">R</span><span className="spark-tag-k">K</span>
          {' '}ignites potential, inspires growth and creates a brighter future.
        </div>
      </div>
    </section>
  );
}

export default SparkSection;
