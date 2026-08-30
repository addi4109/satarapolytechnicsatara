import { useState, useEffect, useRef } from 'react';
import './SparkSection.css';

const sparkValues = [
  {
    letter: 'S',
    title: 'Skill',
    desc: 'We build strong technical skills and practical knowledge to create competent professionals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    color: '#1a7a8a',
    bgColor: 'rgba(26, 122, 138, 0.08)',
    borderColor: 'rgba(26, 122, 138, 0.2)',
  },
  {
    letter: 'P',
    title: 'Progress',
    desc: 'We strive for continuous improvement and embrace innovation to achieve a better tomorrow.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <polyline points="4 14 8 10 12 14"/>
      </svg>
    ),
    color: '#2e7d32',
    bgColor: 'rgba(46, 125, 50, 0.08)',
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  {
    letter: 'A',
    title: 'Achievement',
    desc: 'We aim for excellence in everything we do and celebrate every milestone with pride.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    ),
    color: '#c8963e',
    bgColor: 'rgba(200, 150, 62, 0.08)',
    borderColor: 'rgba(200, 150, 62, 0.2)',
  },
  {
    letter: 'R',
    title: 'Responsibility',
    desc: 'We encourage a sense of duty, discipline and ethical values towards society and the environment.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: '#c62828',
    bgColor: 'rgba(198, 40, 40, 0.08)',
    borderColor: 'rgba(198, 40, 40, 0.2)',
  },
  {
    letter: 'K',
    title: 'Knowledge',
    desc: 'We believe in continuous learning, exploring ideas and gaining deeper understanding.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    color: '#6a1b9a',
    bgColor: 'rgba(106, 27, 154, 0.08)',
    borderColor: 'rgba(106, 27, 154, 0.2)',
  },
];

function SparkSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`spark-section ${visible ? 'spark-visible' : ''}`} ref={ref}>
      <div className="spark-inner">
        <p className="spark-subtitle">Our Word. Our Promise.</p>
        <h2 className="spark-heading">
          <span className="spark-s">S</span>
          <span className="spark-p">P</span>
          <span className="spark-a">A</span>
          <span className="spark-r">R</span>
          <span className="spark-k">K</span>
        </h2>

        <div className="spark-wheel">
          <div className="spark-wheel-ring">
            {sparkValues.map((v, i) => (
              <div
                key={v.letter}
                className={`spark-segment spark-seg-${i}`}
                style={{ '--seg-color': v.color }}
              >
                <span className="spark-seg-letter">{v.letter}</span>
              </div>
            ))}
            <div className="spark-wheel-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.2" className="spark-center-icon">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                <circle cx="8" cy="18" r="1.5"/>
                <circle cx="12" cy="18" r="1.5"/>
                <circle cx="16" cy="18" r="1.5"/>
              </svg>
              <span className="spark-center-text">Empowering<br/>Minds</span>
            </div>
          </div>
        </div>

        <div className="spark-cards">
          {sparkValues.map((v, i) => (
            <div
              key={v.letter}
              className="spark-card"
              style={{
                '--card-color': v.color,
                '--card-bg': v.bgColor,
                '--card-border': v.borderColor,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="spark-card-icon" style={{ background: v.bgColor, color: v.color, borderColor: v.borderColor }}>
                {v.icon}
              </div>
              <div className="spark-card-content">
                <h3 className="spark-card-title">
                  <span className="spark-card-letter" style={{ color: v.color }}>{v.letter}</span>
                  {' – '}
                  <span>{v.title}</span>
                </h3>
                <p className="spark-card-desc">{v.desc}</p>
              </div>
            </div>
          ))}
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
