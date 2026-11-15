import { useEffect, useState } from 'react';
import './InstituteRankers.css';

import API_URL from '../lib/api';

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function InstituteRankers() {
  const [rankers, setRankers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/rankers`)
      .then((r) => r.json())
      .then((data) => setRankers(Array.isArray(data) ? data : []))
      .catch(() => setRankers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || rankers.length < 3) return null;

  const topRankers = [...rankers]
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 3);

  return (
    <section className="rankers-section" aria-labelledby="rankers-heading">
      <div className="rankers-inner">
        <header className="rankers-header">
          <span className="rankers-badge">Institute Toppers</span>
          <h2 id="rankers-heading" className="rankers-heading">Institute Rankers</h2>
          <div className="rankers-line" />
          <p className="rankers-sub">
            Celebrating our highest academic achievers and their outstanding results.
          </p>
        </header>

        <div className="rankers-grid">
          {topRankers.map((ranker) => (
            <article
              className={`ranker-card ranker-rank-${ranker.rank || 1}`}
              key={ranker._id}
            >
              <div className="ranker-card-top">
                <span className="ranker-badge">Rank {ranker.rank}</span>
                <div className="ranker-photo">
                  {ranker.photo ? (
                    <img src={ranker.photo} alt={ranker.name} />
                  ) : (
                    <span>{initialsOf(ranker.name) || '?'}</span>
                  )}
                </div>
              </div>

              <div className="ranker-card-body">
                <h3 className="ranker-name">{ranker.name}</h3>
                {ranker.branch && <p className="ranker-branch">{ranker.branch}</p>}

                <div className="ranker-meta">
                  {ranker.year && <span className="ranker-year">{ranker.year}</span>}
                  {ranker.score && <span className="ranker-score">{ranker.score}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstituteRankers;
