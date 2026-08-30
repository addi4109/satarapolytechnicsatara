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

        <div className="spark-layout">
          {/* Left cards */}
          <div className="spark-side spark-side-left">
            {sparkValues.filter((_, i) => i % 2 === 0).map((v) => {
              const idx = sparkValues.indexOf(v);
              return (
                <div
                  key={v.letter}
                  className={`spark-card ${activeIdx === idx ? 'active' : ''}`}
                  style={{ '--card-color': v.color }}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                >
                  <div className="spark-card-letter" style={{ background: v.color }}>{v.letter}</div>
                  <div className="spark-card-info">
                    <h4 className="spark-card-title">{v.letter} – {v.title}</h4>
                    <p className="spark-card-desc">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center wheel */}
          <div className="spark-wheel">
            <div className="spark-wheel-ring">
              {sparkValues.map((v, i) => {
                const angle = (i * 360) / 5 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 90;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;

                return (
                  <button
                    key={v.letter}
                    className={`spark-letter ${activeIdx === i ? 'active' : ''}`}
                    style={{
                      '--letter-color': v.color,
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={handleLeave}
                  >
                    {v.letter}
                  </button>
                );
              })}
              <div className="spark-wheel-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.5" className="spark-center-icon">
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="spark-side spark-side-right">
            {sparkValues.filter((_, i) => i % 2 === 1).map((v) => {
              const idx = sparkValues.indexOf(v);
              return (
                <div
                  key={v.letter}
                  className={`spark-card ${activeIdx === idx ? 'active' : ''}`}
                  style={{ '--card-color': v.color }}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                >
                  <div className="spark-card-letter" style={{ background: v.color }}>{v.letter}</div>
                  <div className="spark-card-info">
                    <h4 className="spark-card-title">{v.letter} – {v.title}</h4>
                    <p className="spark-card-desc">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active card detail below wheel */}
        {activeIdx !== null && (
          <div
            className="spark-detail"
            style={{ '--detail-color': sparkValues[activeIdx].color }}
          >
            <span className="spark-detail-letter" style={{ background: sparkValues[activeIdx].color }}>
              {sparkValues[activeIdx].letter}
            </span>
            <div>
              <h4 className="spark-detail-title">{sparkValues[activeIdx].title}</h4>
              <p className="spark-detail-desc">{sparkValues[activeIdx].desc}</p>
            </div>
          </div>
        )}

        <div className="spark-tagline">
          <span className="spark-tag-s">S</span><span className="spark-tag-p">P</span><span className="spark-tag-a">A</span><span className="spark-tag-r">R</span><span className="spark-tag-k">K</span>
          {' '}ignites potential, inspires growth and creates a brighter future.
        </div>
      </div>
    </section>
  );
}

export default SparkSection;
