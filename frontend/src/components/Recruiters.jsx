import { useState, useEffect } from 'react';
import './Recruiters.css';

const API_URL = '/api';

function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/placements-admin/recruiters`)
      .then((res) => res.json())
      .then((data) => setRecruiters(data.recruiters || []))
      .catch((err) => console.error('Failed to fetch recruiters:', err));
  }, []);

  if (recruiters.length === 0) return null;

  const items = recruiters.concat(recruiters);

  return (
    <section className="recruiters-section">
      <h2 className="recruiters-heading">Our Top Recruiters</h2>
      <div className="recruiters-line"></div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {items.map((r, idx) => (
            <div className="recruiter-card" key={idx}>
              <img src={r.logoUrl || r.logo} alt={r.name} className="recruiter-logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Recruiters;
