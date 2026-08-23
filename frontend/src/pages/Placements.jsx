import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { STATIC_CONTENT } from '../data/staticContent';
import './Placements.css';

const API_URL = '/api';

const routeMap = {
  about: 'about',
  process: 'process',
  records: 'records',
  recruiters: 'recruiters',
};

const sidebarLinks = [
  { id: 'about', label: 'About Placement Cell' },
  { id: 'process', label: 'Placement Process' },
  { id: 'records', label: 'Placement Records' },
  { id: 'recruiters', label: 'Our Recruiters' },
];

function Placements() {
  const { page } = useParams();
  const [active, setActive] = useState('about');
  const [sections, setSections] = useState({});
  const [placementCell, setPlacementCell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/placements-admin`).then((r) => r.json()),
      fetch(`${API_URL}/cells`).then((r) => r.json()),
    ])
      .then(([placementData, cellsData]) => {
        const mapped = {};
        placementData.forEach((s) => { mapped[s.section] = s; });
        setSections(mapped);

        // Find placement cell from cells
        const placementCellData = cellsData.find((c) =>
          c.name && c.name.toLowerCase().includes('placement')
        );
        if (placementCellData) {
          setPlacementCell(placementCellData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Helpers
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i}>{para}</p>
    ));
  };

  const renderSteps = (steps) => {
    if (!steps || steps.length === 0) return null;
    return (
      <div className="process-steps">
        {steps.map((step, i) => (
          <div className="process-step" key={i}>
            <div className="step-number">{i + 1}</div>
            <div className="step-content">
              <h4>{step.title}</h4>
              {step.desc && <p>{step.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getSection = (key) => sections[key] || {};

  if (loading) {
    return (
      <>
        <PageBanner title="Placements" breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Placements</>} />
        <div className="about-layout">
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="Placements"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Placements
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Placements</h3>
          <ul className="sidebar-list">
            {sidebarLinks.map((link) => (
              <li key={link.id}>
                <button
                  className={`sidebar-link ${active === link.id ? 'active' : ''}`}
                  onClick={() => setActive(link.id)}
                >
                  <span className="arrow">→</span>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="about-content">
          {/* About Placement Cell */}
          {active === 'about' && (
            <>
              <h2 className="content-heading">{getSection('about').title || 'About Placement Cell'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('about').content || STATIC_CONTENT.placements.about)}

              {/* Placement Officer */}
              {(getSection('about').officerName || getSection('about').officerPhoto) && (
                <div className="placement-officer-card">
                  {getSection('about').officerPhoto && (
                    <div className="placement-officer-photo">
                      <img src={getSection('about').officerPhoto} alt={getSection('about').officerName} />
                    </div>
                  )}
                  <div className="placement-officer-info">
                    <h4 className="placement-officer-name">{getSection('about').officerName}</h4>
                    <p className="placement-officer-designation">Placement Officer</p>
                    {getSection('about').officerQual && (
                      <p className="placement-officer-qual">{getSection('about').officerQual}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Placement Cell Members from Cells & Committees */}
              {placementCell && placementCell.members && placementCell.members.length > 0 && (
                <>
                  <h3 className="content-sub-heading">Placement Cell Members</h3>
                  <div className="fee-table-wrap" style={{ marginTop: '12px' }}>
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>Sr. No.</th>
                          <th>Name of Member</th>
                          <th>Designation</th>
                          <th>Contact Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {placementCell.members.map((member, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                            <td className="fee-particular" style={{ fontWeight: 500 }}>{member.name}</td>
                            <td style={{ textAlign: 'center' }}>{member.designation}</td>
                            <td style={{ textAlign: 'center' }}>{member.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ marginTop: '12px' }}>
                    <a href={`/cells/${placementCell.slug}`} style={{ color: '#243358', fontWeight: 600, fontSize: '14px' }}>
                      View Full Details →
                    </a>
                  </p>
                </>
              )}
            </>
          )}

          {/* Placement Process */}
          {active === 'process' && (
            <>
              <h2 className="content-heading">{getSection('process').title || 'Placement Process'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('process').content || STATIC_CONTENT.placements.process)}
              {renderSteps(getSection('process').steps)}
            </>
          )}

          {/* Placement Records */}
          {active === 'records' && (
            <>
              <h2 className="content-heading">{getSection('records').title || 'Placement Records'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('records').content || STATIC_CONTENT.placements.records)}

              {getSection('records').records && getSection('records').records.length > 0 && (
                <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr.</th>
                        <th>Year</th>
                        <th>Students Placed</th>
                        <th>Companies Visited</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('records').records.map((rec, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center' }}>{i + 1}</td>
                          <td className="fee-particular">{rec.year}</td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{rec.placed}</td>
                          <td style={{ textAlign: 'center' }}>{rec.companies}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Our Recruiters */}
          {active === 'recruiters' && (
            <>
              <h2 className="content-heading">{getSection('recruiters').title || 'Our Recruiters'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('recruiters').content || STATIC_CONTENT.placements.recruiters)}

              {getSection('recruiters').recruiters && getSection('recruiters').recruiters.length > 0 && (
                <div className="recruiters-grid" style={{ marginTop: '20px' }}>
                  {getSection('recruiters').recruiters.map((rec, i) => (
                    <div className="recruiter-item" key={i}>
                      {rec.logoUrl && (
                        <img src={rec.logoUrl} alt={rec.name} className="recruiter-item-logo" />
                      )}
                      <span className="recruiter-item-name">{rec.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Placements;
