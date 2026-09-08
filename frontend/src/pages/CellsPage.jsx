import { useState, useEffect } from 'react';
import { SkeletonCards } from "../components/Skeleton";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './CellsPage.css';

import API_URL from '../lib/api';

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
          <SkeletonCards count={6} />
        ) : cells.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
            No cells or committees available yet.
          </p>
        ) : (
          <div className="cells-table-wrap">
            <table className="cell-card-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Cell / Committee Name</th>
                </tr>
              </thead>
              <tbody>
                {cells.map((cell, idx) => (
                  <tr key={cell._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <a
                        href={`/cells/${cell.slug}`}
                        style={{ fontWeight: 600, color: '#243358', textDecoration: 'none' }}
                      >
                        {cell.name}
                      </a>
                      {cell.description && (
                        <div style={{ fontSize: '12.5px', color: '#666', lineHeight: '1.6', marginTop: '4px' }}>
                          {cell.description}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default CellsPage;
