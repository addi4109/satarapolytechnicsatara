import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';

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

  const renderTables = (tables) => {
    if (!tables || tables.length === 0) return null;
    return (
      <div style={{ marginTop: '24px' }}>
        {tables.map((table, ti) => (
          <div key={ti} style={{ marginBottom: '24px' }}>
            {table.title && <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>{table.title}</h3>}
            <div className="fee-table-wrap">
              <table className="fee-table">
                <thead>
                  <tr>
                    {table.columns && table.columns.map((col, ci) => (
                      <th key={ci} style={ci === 0 ? { width: 50, textAlign: 'center' } : {}}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows && table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={ci === 0 ? { textAlign: 'center', fontWeight: 600, color: '#243358' } : ci === 1 ? { fontWeight: 500 } : {}}>{cell}</td>
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
                  <span className="stat-num">30+</span>
                  <span className="stat-txt">Magazines</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">15</span>
                  <span className="stat-txt">Computers</span>
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
              {renderTables(getSection('library').tables)}
            </>
          )}

          {/* Bus Facility */}
          {active === 'bus-facility' && (
            <>
              <h2 className="content-heading">{getSection('bus-facility').title || 'Bus Facility'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('bus-facility').content || STATIC_CONTENT.campus['bus-facility'])}
              {renderTables(getSection('bus-facility').tables)}
              {renderInfoRows(getSection('bus-facility').infoRows)}
            </>
          )}

          {/* Canteen */}
          {active === 'canteen' && (
            <>
              <h2 className="content-heading">{getSection('canteen').title || 'Canteen'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('canteen').content || STATIC_CONTENT.campus.canteen)}
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
                <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th style={{ width: 80, textAlign: 'center' }}>Photo</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Contact</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('office-staff').staffMembers.map((member, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td style={{ textAlign: 'center' }}>
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #e4e8ed' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#f0f3f8', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>N/A</div>
                            )}
                          </td>
                          <td className="fee-particular" style={{ fontWeight: 500 }}>{member.name}</td>
                          <td style={{ textAlign: 'center' }}>{member.designation}</td>
                          <td style={{ textAlign: 'center' }}>{member.phone}</td>
                          <td style={{ textAlign: 'center' }}>{member.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th style={{ width: 80, textAlign: 'center' }}>Photo</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Contact</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('non-teaching-staff').staffMembers.map((member, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td style={{ textAlign: 'center' }}>
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #e4e8ed' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#f0f3f8', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>N/A</div>
                            )}
                          </td>
                          <td className="fee-particular" style={{ fontWeight: 500 }}>{member.name}</td>
                          <td style={{ textAlign: 'center' }}>{member.designation}</td>
                          <td style={{ textAlign: 'center' }}>{member.phone}</td>
                          <td style={{ textAlign: 'center' }}>{member.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
