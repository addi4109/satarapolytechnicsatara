import { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyELKsGUmSXx5oU1TLTAO2B95c91ZRQ2Aw0jdYxI-RZA&s';

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 1000; // 1 second total
    const interval = 20;
    const step = (interval / duration) * 100;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 300);
      }
      setProgress(Math.min(current, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo-wrap">
          <img src={LOGO_URL} alt="Satara Polytechnic" className="loading-logo" />
        </div>
        <h1 className="loading-college-name">Satara Polytechnic, Satara</h1>
        <p className="loading-tagline">Excellence in Technical Education</p>

        <div className="loading-progress-wrap">
          <div className="loading-progress-bar">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loading-progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="loading-footer">
        <p>Affiliated to MSBTE, Mumbai | Approved by AICTE, New Delhi</p>
      </div>
    </div>
  );
}



export default LoadingScreen;
