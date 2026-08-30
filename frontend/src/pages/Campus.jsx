import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';
import './DepartmentsPage.css';

const API_URL = '/api';

const routeMap = {
  library: 'library',
  'bus-facility': 'bus-facility',
  canteen: 'canteen',
  registrar: 'registrar',
  'office-staff': 'office-staff',
  'non-teaching-staff': 'non-teaching-staff',
};

const sidebarLinks = [
  { id: 'library', label: 'Library' },
  { id: 'bus-facility', label: 'Bus Facility' },
  { id: 'canteen', label: 'Canteen' },
  { id: 'registrar', label: "Registrar's Desk" },
  { id: 'office-staff', label: 'Office Staff' },
  { id: 'non-teaching-staff', label: 'Non Teaching Staff' },
];

function Campus() {
  const { page } = useParams();
  const [active, setActive] = useState('library');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    fetch(`${API_URL}/campus`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        data.forEach((s) => { mapped[s.section] = s; });
        setSections(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i}>{para}</p>
    ));
  };

  const renderInfoRows = (rows) => {
    if (!rows || rows.length === 0) return null;
    return (
      <div className="info-table">
        {rows.map((row, i) => (
          <div className="info-row" key={i}>
            <span className="info-label">{row.label}</span>
            <span className="info-value">{row.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderTables = (tables, wrapClass) => {
    if (!tables || tables.length === 0) return null;
    return (
      <div style={{ marginTop: '24px' }}>
        {tables.map((table, ti) => (
          <div key={ti} style={{ marginBottom: '24px' }}>
            {table.title && <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>{table.title}</h3>}
            <div className={`fee-table-wrap ${wrapClass || ''}`}>
              <table className="fee-table">
                <thead>
                  <tr>
                    {table.columns && table.columns.map((col, ci) => (
                      <th key={ci} style={ci === 0 ? { width: 50 } : {}}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows && table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={ci === 0 ? { width: 50, fontWeight: 600, color: '#243358' } : ci === 1 ? { fontWeight: 500 } : {}}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStats = (stats) => {
    if (!stats || stats.length === 0) return null;
    return (
      <div className="overview-stats">
        {stats.map((stat, i) => (
          <div className="stat-box" key={i}>
            <span className="stat-num">{stat.num}</span>
            <span className="stat-txt">{stat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const getSection = (key) => sections[key] || {};

  if (loading) {
    return (
      <>
        <SEO title="Campus | Satara Polytechnic" description="Explore campus facilities at Satara Polytechnic." keywords="college campus, library, canteen" url="/campus" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${active === 'bus-facility' ? 'Bus Facility' : active === 'non-teaching-staff' ? 'Non-Teaching Staff' : active.charAt(0).toUpperCase() + active.slice(1)} | Campus`}
        description={`${active === 'library' ? 'Library with 15000+ books, 50+ journals, and barcode-based issuing system at Satara Polytechnic.' : active === 'bus-facility' ? 'Bus facility for students and staff at Satara Polytechnic.' : active === 'canteen' ? 'College canteen serving hygienic food at affordable prices.' : active === 'registrar' ? "Registrar's desk for administrative work at Satara Polytechnic." : active === 'office-staff' ? 'Office staff members at Satara Polytechnic.' : 'Non-teaching staff at Satara Polytechnic.'}`}
        keywords={`Satara Polytechnic campus, college ${active}, polytechnic facilities, ${active} Satara Polytechnic`}
        url={`/campus/${page || 'library'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Campus', url: '/campus' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
      <PageBanner
        title="Campus"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Campus
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Campus</h3>
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
          {/* Library */}
          {active === 'library' && (
            <>
              <h2 className="content-heading">{getSection('library').title || 'Library'}</h2>
              <div className="content-line"></div>

              {/* Static professional content */}
              <p>
                The library of Satara Polytechnic, Satara is the intellectual heart of the institute, providing a comprehensive collection of knowledge resources to support academic excellence and research. Established with the vision of fostering a reading culture among students and faculty, the library serves as a hub for learning, exploration, and intellectual growth.
              </p>
              <p>
                The library is fully automated with a barcode-based issuing system powered by Libsys software, ensuring efficient management of book circulation, cataloguing, and inventory tracking. The staffed help desk assists students and faculty in locating resources, accessing digital databases, and navigating the library catalog.
              </p>
              <p>
                Our collection includes textbooks, reference books, handbooks, encyclopedias, directories, and standard specifications covering all branches of engineering — Computer, Electronics & Telecommunication, Mechanical, Chemical, Electrical, and Automobile. The library subscribes to leading national and international journals, periodicals, and magazines to keep students abreast of the latest developments in technology and science.
              </p>
              <p>
                The digital library section provides access to e-books, online journals, NPTEL video lectures, and other e-resources through INFLIBNET and other digital platforms. Students can access these resources both within the campus and remotely using their institutional credentials.
              </p>
              <p>
                The spacious reading hall with a seating capacity of 100 students provides a quiet and comfortable environment for self-study and group discussions. Reprographic facilities (photocopying and scanning) are available for students to reproduce reference material as needed.
              </p>

              {/* Static Stats */}
              <div className="overview-stats" style={{ marginTop: '24px' }}>
                <div className="stat-box">
                  <span className="stat-num">15000+</span>
                  <span className="stat-txt">Total Books</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">50+</span>
                  <span className="stat-txt">Journals & Periodicals</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">100</span>
                  <span className="stat-txt">Seating Capacity</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">6</span>
                  <span className="stat-txt">Departments Covered</span>
                </div>
              </div>

              {/* Info from backend */}
              {renderInfoRows(getSection('library').infoRows)}

              {/* Data Tables from admin */}
              {renderTables(getSection('library').tables, 'library-table')}

              {/* Library Rules */}
              {getSection('library').rules && getSection('library').rules.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', marginBottom: '12px' }}>Library Rules</h3>
                  <div className="rules-list">
                    {getSection('library').rules.map((rule, i) => (
                      <div className="rule-item" key={i}>
                        <div className="rule-number">{i + 1}</div>
                        <div className="rule-content">
                          <h4 className="rule-title">{rule.ruleTitle || `Rule ${i + 1}`}</h4>
                          <p className="rule-desc">{rule.ruleDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Library Images */}
              {getSection('library').images && getSection('library').images.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', marginBottom: '14px' }}>Library Gallery</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {getSection('library').images.map((img, i) => (
                      <div key={i} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', overflow: 'hidden', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                        <div style={{ width: '100%', height: '180px', background: '#f5f7fa', overflow: 'hidden' }}>
                          {img.url && <img src={img.url} alt={img.caption || 'Library'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        {img.caption && <p style={{ margin: 0, padding: '10px 14px', fontSize: '13px', color: '#555', textAlign: 'center', fontWeight: 500 }}>{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bus Facility */}
          {active === 'bus-facility' && (
            <>
              <h2 className="content-heading">{getSection('bus-facility').title || 'Bus Facility'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('bus-facility').content || STATIC_CONTENT.campus['bus-facility'])}

              {/* Bus Routes */}
              {getSection('bus-facility').busRoutes && getSection('bus-facility').busRoutes.length > 0 && (
                <div style={{ marginTop: '28px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', marginBottom: '16px' }}>Bus Routes</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {getSection('bus-facility').busRoutes.map((route, ri) => (
                      <div key={ri} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '12px', padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
                        {/* Route header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #243358, #1a2642)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🚌</div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#243358' }}>{route.routeName || `Route ${ri + 1}`}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{route.stops.length} stops</p>
                          </div>
                        </div>

                        {/* Visual route with road */}
                        <div style={{ position: 'relative', paddingLeft: '20px' }}>
                          {/* Road line */}
                          <div style={{ position: 'absolute', left: '11px', top: '8px', bottom: '8px', width: '3px', background: 'repeating-linear-gradient(to bottom, #c8963e 0px, #c8963e 8px, transparent 8px, transparent 14px)', borderRadius: '2px' }}></div>
                          {/* Stops */}
                          {route.stops.map((stop, si) => (
                            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: si < route.stops.length - 1 ? '0' : '0', position: 'relative', paddingBottom: si < route.stops.length - 1 ? '20px' : '0' }}>
                              {/* Stop dot */}
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: si === 0 ? '#27ae60' : si === route.stops.length - 1 ? '#c0392b' : '#243358', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, zIndex: 1, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>{si + 1}</div>
                              {/* Stop info */}
                              <div style={{ flex: 1, background: si === 0 ? '#f0faf4' : si === route.stops.length - 1 ? '#fdf2f2' : '#f8f9fa', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${si === 0 ? '#c8e6d4' : si === route.stops.length - 1 ? '#f5c6c6' : '#e8eaed'}` }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{stop}</span>
                                {si === 0 && <span style={{ fontSize: '11px', color: '#27ae60', fontWeight: 600, marginLeft: '8px' }}>START</span>}
                                {si === route.stops.length - 1 && route.stops.length > 1 && <span style={{ fontSize: '11px', color: '#c0392b', fontWeight: 600, marginLeft: '8px' }}>END</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {renderTables(getSection('bus-facility').tables)}
              {renderInfoRows(getSection('bus-facility').infoRows)}
            </>
          )}

          {/* Canteen */}
          {active === 'canteen' && (
            <>
              <h2 className="content-heading">Canteen</h2>
              <div className="content-line"></div>
              {renderContent(STATIC_CONTENT.campus.canteen)}

              {getSection('canteen').foodMenu && getSection('canteen').foodMenu.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', marginBottom: '14px' }}>Food Menu</h3>
                  <div className="fee-table-wrap">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Item Name</th>
                          <th>Category</th>
                          <th>Price (₹)</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSection('canteen').foodMenu.map((item, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                            <td style={{ fontWeight: 500 }}>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.price}</td>
                            <td>{item.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {renderTables(getSection('canteen').tables)}
              {renderInfoRows(getSection('canteen').infoRows)}
            </>
          )}

          {/* Registrar's Desk */}
          {active === 'registrar' && (
            <>
              <h2 className="content-heading">{getSection('registrar').title || "Registrar's Desk"}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('registrar').content || STATIC_CONTENT.campus.registrar)}
              {renderTables(getSection('registrar').tables)}
              {renderInfoRows(getSection('registrar').infoRows)}
            </>
          )}

          {/* Office Staff */}
          {active === 'office-staff' && (
            <>
              <h2 className="content-heading">{getSection('office-staff').title || 'Office Staff'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('office-staff').content || STATIC_CONTENT.campus['office-staff'])}

              {getSection('office-staff').staffMembers && getSection('office-staff').staffMembers.length > 0 && (
                <div className="faculty-grid" style={{ marginTop: '24px' }}>
                  {getSection('office-staff').staffMembers.map((member, i) => (
                    <div className="faculty-card-new" key={i}>
                      <div className="fcard-photo">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} />
                        ) : (
                          <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <h4 className="fcard-name">{member.name}</h4>
                      <p className="fcard-designation">{member.designation}</p>
                      <div className="fcard-details">
                        {member.phone && <span><strong>Phone:</strong> {member.phone}</span>}
                        {member.email && <span><strong>Email:</strong> {member.email}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Non Teaching Staff */}
          {active === 'non-teaching-staff' && (
            <>
              <h2 className="content-heading">{getSection('non-teaching-staff').title || 'Non Teaching Staff'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('non-teaching-staff').content || STATIC_CONTENT.campus['non-teaching-staff'])}

              {getSection('non-teaching-staff').staffMembers && getSection('non-teaching-staff').staffMembers.length > 0 && (
                <div className="faculty-grid" style={{ marginTop: '24px' }}>
                  {getSection('non-teaching-staff').staffMembers.map((member, i) => (
                    <div className="faculty-card-new" key={i}>
                      <div className="fcard-photo">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} />
                        ) : (
                          <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <h4 className="fcard-name">{member.name}</h4>
                      <p className="fcard-designation">{member.designation}</p>
                      <div className="fcard-details">
                        {member.phone && <span><strong>Phone:</strong> {member.phone}</span>}
                        {member.email && <span><strong>Email:</strong> {member.email}</span>}
                      </div>
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

export default Campus;
