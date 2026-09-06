import { useState, useEffect, useRef, useCallback } from 'react';
import './CollegeRankers.css';

import API_URL from '../lib/api';

function RankerPhoto({ image, name }) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div className="ranker-photo-placeholder">
        <span>👤</span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      className="ranker-photo"
      crossOrigin="anonymous"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

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

  const rankClass = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return 'gold';
    if (r === 2) return 'silver';
    if (r === 3) return 'bronze';
    return 'default';
  };

  const ordinalSuffix = (rank) => {
    const r = parseInt(rank, 10);
    if (Number.isNaN(r)) return '';
    const mod100 = r % 100;
    if (mod100 >= 11 && mod100 <= 13) return 'th';
    switch (r % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
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
              <div className="ranker-card ranker-card-skeleton" key={i}>
                <div className="ranker-top" />
                <div className="ranker-card-body">
                  <div className="ranker-line-skeleton" />
                  <div className="ranker-line-skeleton short" />
                  <div className="ranker-line-skeleton short" />
                </div>
              </div>
            ))
          ) : rankholders.length === 0 ? (
            <div className="rankers-empty">
              <p className="rankers-empty-text">No rank holders added yet.</p>
            </div>
          ) : (
            rankholders.map((holder) => (
              <div className="ranker-card" key={holder.name + holder.rank}>
                {/* Gold-trimmed circular photo window */}
                <div className="ranker-top">
                  <RankerPhoto image={holder.image} name={holder.name} />
                </div>

                {/* Gold ribbon banner */}
                <div className="ranker-ribbon">
                  <span className="ranker-ribbon-text">★ RANK HOLDER ★</span>
                  <span className="ranker-ribbon-border" aria-hidden="true" />
                </div>

                <div className="ranker-card-body">
                  <h3 className="ranker-name">{holder.name}</h3>

                  {/* Gold divider with mortarboard */}
                  <div className="ranker-divider">
                    <span className="ranker-divider-line" />
                    <span className="ranker-divider-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10L12 5 2 10l10 5 10-5z" />
                        <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
                      </svg>
                    </span>
                  </div>

                  <span className="ranker-department">{holder.department}</span>

                  {/* Circular rank badge framed by laurel wreaths */}
                  <div className="ranker-rank-box">
                    <div className="ranker-laurel-left" aria-hidden="true">
                      <span className="ranker-leaf" />
                      <span className="ranker-leaf" />
                      <span className="ranker-leaf" />
                    </div>
                    <div className={`ranker-badge ${rankClass(holder.rank)}`}>
                      <span className="ranker-badge-number">{holder.rank}</span>
                      <span className="ranker-badge-suffix">{ordinalSuffix(holder.rank)}</span>
                    </div>
                    <div className="ranker-laurel-right" aria-hidden="true">
                      <span className="ranker-leaf" />
                      <span className="ranker-leaf" />
                      <span className="ranker-leaf" />
                    </div>
                    <span className="ranker-star" aria-hidden="true">★</span>
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