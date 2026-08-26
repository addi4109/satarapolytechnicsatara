import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
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
        <SEO title="Placements | Satara Polytechnic" description="Training & Placement Cell at Satara Polytechnic offering campus recruitment drives." keywords="polytechnic placements, campus recruitment" url="/placements" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} | Placements`}
        description={`${active === 'about' ? 'Training & Placement Cell at Satara Polytechnic offering campus recruitment drives and soft skill training.' : active === 'process' ? 'Step-by-step placement process at Satara Polytechnic.' : active === 'records' ? 'Year-wise placement records showing students placed and companies visited.' : 'Top recruiters visiting Satara Polytechnic campus for placements.'}`}
        keywords={`polytechnic placements, campus recruitment, training placement cell, Satara Polytechnic placements, ${active}`}
        url={`/placements/${page || 'about'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Placements', url: '/placements' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
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
                  <div className="placement-officer-left">
                    {getSection('about').officerPhoto && (
                      <div className="placement-officer-photo">
                        <img src={getSection('about').officerPhoto} alt={getSection('about').officerName} />
                      </div>
                    )}
                    <h4 className="placement-officer-name">{getSection('about').officerName}</h4>
                    <p className="placement-officer-designation">Placement Officer</p>
                    {getSection('about').officerQual && (
                      <p className="placement-officer-qual">{getSection('about').officerQual}</p>
                    )}
                  </div>
                  {getSection('about').officerMsg && (
                    <div className="placement-officer-msg">
                      <p style={{ whiteSpace: 'pre-line' }}>{getSection('about').officerMsg}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Office Team */}
              {getSection('about').officeTeam && getSection('about').officeTeam.length > 0 && (
                <>
                  <h3 className="content-sub-heading">Placement & Training Office Team</h3>
                  <div className="placement-team-grid">
                    {getSection('about').officeTeam.map((member, i) => (
                      <div className="placement-team-card" key={i}>
                        <div className="placement-team-photo">
                          {member.photo ? (
                            <img src={member.photo} alt={member.name} />
                          ) : (
                            <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <h4 className="placement-team-name">{member.name}</h4>
                        <p className="placement-team-designation">{member.designation}</p>
                        {member.qual && <p className="placement-team-qual">{member.qual}</p>}
                        {member.email && <a href={`mailto:${member.email}`} className="placement-team-email">{member.email}</a>}
                      </div>
                    ))}
                  </div>
                </>
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

          {/* Placement Records - Static + Table + Images */}
          {active === 'records' && (
            <>
              <h2 className="content-heading">Placement Records</h2>
              <div className="content-line"></div>
              <p>
                Shri Satara Polytechnic, Satara has a strong track record of successful campus
                placements. Our Training & Placement Cell regularly organizes recruitment drives
                with leading companies across various engineering sectors. Below are the year-wise
                placement records and supporting documents.
              </p>

              {/* Record Table */}
              {getSection('records').recordTable && getSection('records').recordTable.length > 0 && (
                <div style={{ marginTop: '28px' }}>
                  <h3 className="content-sub-heading">Year-wise Placement Records</h3>
                  <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                  <div className="fee-table-wrap">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th style={{ width: 60 }}>Sr. No.</th>
                          <th>Academic Year</th>
                          <th style={{ width: 160 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSection('records').recordTable.map((rec, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                            <td className="fee-particular" style={{ fontWeight: 600 }}>{rec.year}</td>
                            <td style={{ textAlign: 'center' }}>
                              {rec.pdfUrl ? (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <a
                                    href={`/api/pdf-proxy?url=${encodeURIComponent(rec.pdfUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 14px', background: '#243358', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                  >
                                    View
                                  </a>
                                  <a
                                    href={`/api/pdf-proxy?url=${encodeURIComponent(rec.pdfUrl)}`}
                                    download
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 14px', background: '#fff', color: '#243358', border: '1px solid #243358', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                  >
                                    Download
                                  </a>
                                </div>
                              ) : (
                                <span style={{ color: '#ccc', fontSize: '12px' }}>No PDF</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Record Images */}
              {getSection('records').recordImages && getSection('records').recordImages.length > 0 && (
                <div style={{ marginTop: '36px' }}>
                  <h3 className="content-sub-heading">Placement Record Gallery</h3>
                  <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {getSection('records').recordImages.map((img, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        {img.imageUrl && (
                          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e8ed', marginBottom: '12px' }}>
                            <img
                              src={img.imageUrl}
                              alt={img.title || 'Placement Record'}
                              style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                          </div>
                        )}
                        {img.title && (
                          <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#243358', margin: 0 }}>{img.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback if no data */}
              {(!getSection('records').recordTable || getSection('records').recordTable.length === 0) &&
               (!getSection('records').recordImages || getSection('records').recordImages.length === 0) && (
                <p style={{ marginTop: '20px', color: '#888' }}>Placement records will be updated soon. Check back later.</p>
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
