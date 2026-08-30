import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
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
  const [lightbox, setLightbox] = useState(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    if (lightbox) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox]);

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
        <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "14px" }}>Loading...</div>
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

          {/* Placement Process - Static + Steps from Admin */}
          {active === 'process' && (
            <>
              <h2 className="content-heading">Placement Process</h2>
              <div className="content-line"></div>
              <p>
                The placement process at Satara Polytechnic, Satara is systematic and
                student-centric. Our Training &amp; Placement Cell ensures that every student is
                well-prepared for campus recruitment through a structured process that includes
                aptitude training, soft skill development, mock interviews, and group discussions.
              </p>
              <p>
                We maintain strong industry connections and regularly invite leading companies for
                campus recruitment drives. The placement cell coordinates the entire process from
                pre-placement talks to final offer letters, ensuring a smooth experience for both
                students and recruiters.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">50+</span>
                  <span className="stat-txt">Companies Visited</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">85%</span>
                  <span className="stat-txt">Placement Rate</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">03</span>
                  <span className="stat-txt">Training Modules</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">100%</span>
                  <span className="stat-txt">Career Support</span>
                </div>
              </div>

              {/* Steps from Admin */}
              {getSection('process').steps && getSection('process').steps.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 className="content-sub-heading">How It Works</h3>
                  <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '16px', borderRadius: '2px' }}></div>
                  {renderSteps(getSection('process').steps)}
                </div>
              )}

              {/* Key Features */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Why Our Placements Stand Out</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Aptitude Training</span>
                    <span className="info-value">Regular aptitude sessions covering quantitative, logical reasoning and verbal ability for all pre-final and final year students.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Soft Skills Development</span>
                    <span className="info-value">Communication skills, personality development, resume building and interview preparation workshops conducted throughout the year.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mock Interviews</span>
                    <span className="info-value">One-on-one mock interview sessions with industry professionals to build confidence and improve interview performance.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Industry Interaction</span>
                    <span className="info-value">Regular guest lectures, industrial visits and seminars by industry experts to bridge the gap between academics and industry.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Campus Recruitment</span>
                    <span className="info-value">On-campus recruitment drives organized with leading companies across IT, manufacturing, automobile and core engineering sectors.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Career Guidance</span>
                    <span className="info-value">Personalized career counselling for students interested in higher studies, entrepreneurship or government job preparations.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Placement Records - Static + Table + Images */}
          {active === 'records' && (
            <>
              <h2 className="content-heading">Placement Records</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara has a strong track record of successful campus
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
                    {getSection('records').recordImages.map((img, i) => (                          <div key={i} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => img.imageUrl && setLightbox({ url: img.imageUrl, caption: img.title })}>
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

          {/* Our Recruiters - Static + Admin Grid */}
          {active === 'recruiters' && (
            <>
              <h2 className="content-heading">Our Recruiters</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara has built strong industry partnerships over the years,
                attracting top companies from diverse engineering sectors for campus recruitment
                drives. Our Training &amp; Placement Cell maintains active relationships with leading
                organizations across IT, manufacturing, automobile, chemical, electrical, and
                core engineering domains.
              </p>
              <p>
                Companies regularly visit our campus to hire diploma engineers for roles in software
                development, production, quality control, maintenance, design, and project management.
                Our students are well-prepared through aptitude training, soft skill workshops, and
                industry-ready curriculum, making them preferred candidates for top recruiters.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">50+</span>
                  <span className="stat-txt">Partner Companies</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">15+</span>
                  <span className="stat-txt">Industry Sectors</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">85%</span>
                  <span className="stat-txt">Placement Rate</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">100%</span>
                  <span className="stat-txt">Training Support</span>
                </div>
              </div>

              {/* Recruiter Logos Grid */}
              {getSection('recruiters').recruiters && getSection('recruiters').recruiters.length > 0 && (
                <div style={{ marginTop: '36px' }}>
                  <h3 className="content-sub-heading">Companies That Recruit From Us</h3>
                  <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                  <div className="recruiters-grid">
                    {getSection('recruiters').recruiters.map((rec, i) => (
                      <div className="recruiter-item" key={i}>
                        {rec.logoUrl && (
                          <img src={rec.logoUrl} alt={rec.name} className="recruiter-item-logo" />
                        )}
                        <span className="recruiter-item-name">{rec.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Sectors */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Recruitment Sectors</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Information Technology</span>
                    <span className="info-value">Software development, web development, networking, and IT support roles in leading tech companies.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Manufacturing</span>
                    <span className="info-value">Production, quality control, CNC programming, and shop floor management in automotive and engineering firms.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Automobile</span>
                    <span className="info-value">Vehicle design, assembly line operations, service engineering, and dealership management roles.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Chemical Industry</span>
                    <span className="info-value">Process operations, plant maintenance, quality assurance, and environmental compliance positions.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Electrical & Electronics</span>
                    <span className="info-value">Power systems, control panels, instrumentation, and embedded systems roles in core companies.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Infrastructure & Construction</span>
                    <span className="info-value">Civil works, project management, site supervision, and structural design positions.</span>
                  </div>
                </div>
              </div>

              {/* Why Companies Choose Us */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Why Companies Choose Our Graduates</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Industry-Ready Skills</span>
                    <span className="info-value">Our curriculum includes practical training, workshops, and project work that prepare students for real-world engineering challenges from day one.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Strong Foundation</span>
                    <span className="info-value">Three years of comprehensive diploma education provides deep technical knowledge across theory, practical, and application-based learning.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Soft Skills Training</span>
                    <span className="info-value">Regular communication skills, personality development, and interview preparation sessions ensure students are confident and professional.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Aptitude & Reasoning</span>
                    <span className="info-value">Dedicated aptitude training modules covering quantitative, logical reasoning, and verbal ability — essential for campus recruitment screening.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Problem Solving Ability</span>
                    <span className="info-value">Hands-on lab experience and project-based learning develop strong analytical and problem-solving skills valued by employers.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Work Ethic & Discipline</span>
                    <span className="info-value">Our students are known for their punctuality, dedication, team spirit, and willingness to learn — qualities that recruiters highly appreciate.</span>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div style={{ marginTop: '36px', background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', margin: '0 0 8px' }}>Want to Recruit From Our Campus?</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px', lineHeight: '1.6' }}>
                  Partner with Satara Polytechnic for your next campus recruitment drive. Our Training &amp; Placement Cell will coordinate the entire process.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="tel:+919423342843" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', background: '#243358', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    📞 +91-94233 42843
                  </a>
                  <a href="mailto:satarapolyinfo@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', background: '#fff', color: '#243358', border: '1px solid #243358', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    ✉ satarapolyinfo@gmail.com
                  </a>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.url} alt={lightbox.caption || 'Image'} className="lightbox-img" />
            {lightbox.caption && (
              <div className="lightbox-info">
                <h3>{lightbox.caption}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Placements;
