import { useState, useEffect } from 'react';
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './CellsPage.css';

const API_URL = '/api';

function CellsPage() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/cells`)
      .then((res) => res.json())
      .then((data) => setCells(data))
      .catch((err) => console.error('Failed to fetch cells:', err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <SEO
        title="Cells & Committees | Anti-Ragging, NSS, IQAC"
        description="Learn about various cells and committees at Satara Polytechnic including Anti-Ragging Cell, NSS, IQAC, Grievance Redressal, Women Grievance Cell, and more."
        keywords="anti-ragging cell, NSS cell, IQAC, college committees, grievance redressal, Satara Polytechnic committees"
        url="/cells"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Cells & Committees' },
        ])}
      />
      <PageBanner
        title="Cell and Committees"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Cell and Committees
          </>
        }
      />

      <div className="cells-page-wrap">
        <h2 className="cells-main-heading">Cell and Committees</h2>
        <div className="cells-main-line"></div>
        <p className="cells-intro">
          Satara Polytechnic, Satara has established various cells and committees to
          ensure the overall development of students, maintain discipline, and address
          grievances. These cells work towards creating a safe, inclusive, and
          supportive learning environment for all students.
        </p>

        {loading ? (
          null
        ) : cells.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
            No cells or committees available yet.
          </p>
        ) : (
          <div className="cells-grid">
            {cells.map((cell) => (
              <a href={`/cells/${cell.slug}`} className="cell-card-link" key={cell._id}>
                <div className="cell-card">
                  <h3 className="cell-card-heading">{cell.name}</h3>
                  <p className="cell-card-desc">{cell.description}</p>
                  <span className="cell-card-arrow">View Details →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CellsPage;
