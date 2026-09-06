import { useState, useEffect, useRef, useCallback } from 'react';
import './CollegeRankers.css';

import API_URL from '../lib/api';

function CollegeRankers() {
  const [rankholders, setRankholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/examinations`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      // Accept both 'image' (admin) and 'photoUrl' (legacy model) fields
      const raw = mapped.rankholders?.rankholders || [];
      const normalised = raw.map((h) => ({
        ...h,
        image: h.image || h.photoUrl || '',
      }));
      setRankholders(normalised);
    } catch (err) {
      console.error('Failed to fetch rank holders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for reload event from admin panel
  useEffect(() => {
    const handler = () => {
      fetchRef.current += 1;
      fetchData();
    };
    window.addEventListener('rankers-reload', handler);
    return () => window.removeEventListener('rankers-reload', handler);
  }, [fetchData]);

  const getMedalIcon = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return '🏅';
  };

  const rankClass = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return 'gold';
    if (r === 2) return 'silver';
    if (r === 3) return 'bronze';
    return 'default';
  };  return (
    <section className="rankers-section">
      <div className="rankers-inner">
        <div className="rankers-header">
          <span className="rankers-badge">MERIT LIST</span>
          <h2 className="rankers-heading">Our Toppers</h2>
          <p className="rankers-subheading">
            Celebrating academic excellence — students who brought pride to Satara Polytechnic
          </p>
        </div>

        <div className="rankers-grid">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div className="ranker-item ranker-card-skeleton" key={i}>
                <div className="ranker-img-wrap-skeleton" />
                <div className="ranker-line-skeleton" />
                <div className="ranker-line-skeleton short" />
              </div>
            ))
          ) : rankholders.length === 0 ? (
            <div className="rankers-empty">
              <p className="rankers-empty-text">No rank holders added yet.</p>
            </div>
          ) : (
            rankholders.map((holder) => (
              <div className="ranker-item" key={holder.name + holder.rank}>
                <div className="ranker-img-wrap">
                  <div className="ranker-img-ring" />
                  {holder.image ? (
                    <img
                      src={holder.image}
                      alt={holder.name}
                      className="ranker-img"
                      crossOrigin="anonymous"
                      decoding="async"
                      onError={(e) => {
                        e.target.replaceWith(
                          <div className="ranker-img-placeholder">
                            <span>👤</span>
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <div className="ranker-img-placeholder">
                      <span>👤</span>
                    </div>
                  )}
                </div>
                <div className="ranker-card-content">
                  <span className="ranker-rank-label">Rank Holder</span>
                  <h3 className="ranker-name">{holder.name}</h3>
                  <span className="ranker-department">{holder.department}</span>
                  <div className="ranker-rank-box">
                    <span className={`rank-number rank-number-${rankClass(holder.rank)}`}>
                      <span className="star">★</span>
                      {holder.rank}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default CollegeRankers;
