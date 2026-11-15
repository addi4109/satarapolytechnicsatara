import { useEffect, useState } from 'react';
import RankerCard from './RankerCard';
import './InstituteRankers.css';

import API_URL from '../lib/api';

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

  if (loading || rankers.length === 0) return null;

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
            <RankerCard ranker={ranker} key={ranker._id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstituteRankers;
