import { useState, useEffect, useRef, useCallback } from 'react';
import './CollegeRankers.css';

import API_URL from '../lib/api';

function CollegeRankers() {
  const [rankholders, setRankholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/examinations`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        data.forEach((s) => { mapped[s.section] = s; });
        setRankholders(mapped.rankholders?.rankholders || []);
      })
      .catch((err) => console.error('Failed to fetch rank holders:', err))
      .finally(() => setLoading(false));
  }, []);

  const maxIndex = Math.max(0, rankholders.length - 3);

  useEffect(() => {
    if (rankholders.length <= 3) return;
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [rankholders.length, maxIndex]);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (rankholders.length > 3) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 3500);
    }
  }, [rankholders.length, maxIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    resetAutoScroll();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    resetAutoScroll();
  };

  if (loading) return null;

  if (rankholders.length === 0) return null;

  const getVisibleCards = () => {
    const cards = [];
    const count = Math.min(3, rankholders.length);
    for (let i = 0; i < count; i++) {
      const idx = (currentIndex + i) % rankholders.length;
      cards.push({ ...rankholders[idx], _key: `${currentIndex}-${i}` });
    }
    return cards;
  };

  const getMedalIcon = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return '🏅';
  };

  return (
    <section className="rankers-section">
      <div className="rankers-header">
        <span className="rankers-badge">MERIT LIST</span>
        <h2 className="rankers-heading">Our Toppers</h2>
        <p className="rankers-subheading">
          Celebrating academic excellence — students who brought pride to Satara Polytechnic
        </p>
      </div>

      <div className="rankers-carousel">
        {rankholders.length > 3 && (
          <button className="ranker-arrow ranker-arrow-l" onClick={goToPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}

        <div className="rankers-track">
          <div className="rankers-grid">
            {getVisibleCards().map((holder) => (
              <div className="ranker-card" key={holder._key}>
                {holder.image && (
                  <div className="ranker-img-wrap">
                    <img src={holder.image} alt={holder.name} className="ranker-img" />
                  </div>
                )}
                <div className="ranker-card-content">
                  <h3 className="ranker-name">{holder.name}</h3>
                  <span className="ranker-badge">{holder.department}</span>
                  <div className="ranker-rank-row">
                    <div className="ranker-rank-box">
                      <span className="rank-number">{holder.rank}</span>
                      <span className="rank-label">Rank</span>
                    </div>
                  </div>
                  {holder.year && (
                    <span className="ranker-year">{holder.year}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {rankholders.length > 3 && (
          <button className="ranker-arrow ranker-arrow-r" onClick={goToNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>

      {rankholders.length > 3 && (
        <div className="rankers-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`ranker-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => { setCurrentIndex(idx); resetAutoScroll(); }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CollegeRankers;
