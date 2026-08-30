import { useState } from 'react';
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

  return (
    <section className="spark-section">
      <div className="spark-inner">
        <p className="spark-subtitle">Our Word. Our Promise.</p>
        <h2 className="spark-heading">
          <span className="spark-s">S</span>
          <span className="spark-p">P</span>
          <span className="spark-a">A</span>
          <span className="spark-r">R</span>
          <span className="spark-k">K</span>
        </h2>

        <div className="spark-circle-wrap">
          <div className="spark-circle">
            {sparkValues.map((v, i) => {
              const angle = (i * 360) / 5 - 90;
              const rad = (angle * Math.PI) / 180;
              const radius = 110;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <button
                  key={v.letter}
                  className={`spark-dot ${activeIdx === i ? 'active' : ''}`}
                  style={{
                    '--dot-color': v.color,
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {v.letter}
                </button>
              );
            })}
            <div className="spark-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.5" className="spark-center-icon">
                <circle cx="12" cy="7" r="4"/>
                <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/>
              </svg>
            </div>
          </div>

          {/* Popup card shown on hover */}
          {activeIdx !== null && (
            <div
              className="spark-popup"
              style={{ '--popup-color': sparkValues[activeIdx].color }}
              onMouseEnter={() => setActiveIdx(activeIdx)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <h4 className="spark-popup-title">
                {sparkValues[activeIdx].letter} – {sparkValues[activeIdx].title}
              </h4>
              <p className="spark-popup-desc">{sparkValues[activeIdx].desc}</p>
            </div>
          )}
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
