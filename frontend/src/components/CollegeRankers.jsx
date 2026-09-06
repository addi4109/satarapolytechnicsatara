import { useState, useEffect } from 'react';
import './CollegeRankers.css';

import API_URL from '../lib/api';

function CollegeRankers() {
  const [rankholders, setRankholders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return null;

  if (rankholders.length === 0) return null;

  // Duplicate the items for seamless infinite scroll
  const items = rankholders.concat(rankholders);

  // Determine medal icon based on rank
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

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {items.map((holder, idx) => (
            <div className="ranker-card" key={`${idx}-${holder.name}`}>
              <div className="ranker-medal">
                {getMedalIcon(holder.rank)}
              </div>
              <div className="ranker-info">
                <div className="ranker-name">{holder.name}</div>
                <div className="ranker-dept">
                  <span className="ranker-badge">{holder.department}</span>
                  <span className="ranker-sem">Sem {holder.semester}</span>
                </div>
                <div className="ranker-rank-row">
                  <span className="ranker-rank">
                    <span className="rank-number">{holder.rank}</span>
                    <span className="rank-label">Rank</span>
                  </span>
                  <span className="ranker-marks">{holder.marks}</span>
                  <span className="ranker-year">{holder.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollegeRankers;
