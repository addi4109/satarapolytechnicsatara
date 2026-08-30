import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './DepartmentsPage.css';
import './Gallery.css';

const API_URL = '/api';
const years = ['1st Year', '2nd Year', '3rd Year'];
const VALID_TABS = ['about', 'vision', 'hod', 'faculty', 'infrastructure', 'curriculum', 'obe'];

function DepartmentsPage() {
  const { deptId } = useParams();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    VALID_TABS.includes(tabParam) ? tabParam : 'about'
  );
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetchDepartments();
  }, []);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && VALID_TABS.includes(t)) setActiveTab(t);
  }, [searchParams]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_URL}/departments`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setError('Failed to load departments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const activeSlug = deptId || (departments.length > 0 ? departments[0].slug : '');
  const dept = departments.find((d) => d.slug === activeSlug) || departments[0];

  const [obeTab, setObTab] = useState('peos');

  const sidebarItems = [
    { id: 'about', label: 'About' },
    { id: 'vision', label: 'Vision & Mission' },
    { id: 'hod', label: 'HOD Desk' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'curriculum', label: 'Curriculum / Syllabus' },
    { id: 'obe', label: 'Outcome Based Education' },
  ];

  if (loading) {
    return (
      <>
        <SEO title="Departments | Satara Polytechnic" description="Explore 6 engineering departments at Satara Polytechnic." keywords="engineering departments, polytechnic departments" url="/departments/computer" />
        <SkeletonPage />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBanner
          title="Departments"
          breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Departments</>}
        />
        <div className="dept-page-layout">
          <div className="dept-content-area" style={{ width: '100%' }}>
            <main className="about-content">
              <p style={{ textAlign: 'center', padding: '60px 20px', color: '#dc3545' }}>{error}</p>
            </main>
          </div>
        </div>
      </>
    );
  }

  if (!dept) {
    return (
      <>
        <PageBanner
          title="Departments"
          breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Departments</>}
        />
        <div className="dept-page-layout">
          <div className="dept-content-area" style={{ width: '100%' }}>
            <main className="about-content">
              <p style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>No departments found.</p>
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${dept.name} Department | Satara Polytechnic`}
        description={`Explore ${dept.name} department at Satara Polytechnic, Satara. ${dept.about ? dept.about.slice(0, 150) : 'Offering diploma engineering program with experienced faculty and modern labs.'}`}
        keywords={`${dept.name}, ${dept.slug} department, polytechnic ${dept.name}, Satara Polytechnic ${dept.name} engineering`}
        url={`/departments/${activeSlug}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Departments', url: '/departments/computer' },
          { name: dept.name },
        ])}
      />
      <PageBanner
        title="Departments"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Departments
          </>
        }
      />

      <div className="dept-page-layout">
        {/* section sidebar */}
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">{dept.name}</h3>
          <ul className="sidebar-list">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="arrow">→</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile sections list */}
          <ul className="dept-mobile-tabs">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`dept-mobile-tab ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="arrow">→</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="dept-content-area">
          <main className="about-content">
            {activeTab === 'about' && (
              <>
                <h2 className="content-heading">{dept.name}</h2>
                <div className="content-line"></div>
                {dept.image && (
                  <div className="dept-hero">
                    <img src={dept.image} alt={dept.name} />
                  </div>
                )}
                <p>{dept.about}</p>
                <div className="overview-stats">
                  {dept.slug !== 'general-science' && (
                    <div className="stat-box">
                      <span className="stat-num">{dept.intake}</span>
                      <span className="stat-txt">Intake</span>
                    </div>
                  )}
                  <div className="stat-box">
                    <span className="stat-num">{dept.faculty?.length || 0}</span>
                    <span className="stat-txt">Faculty</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">{dept.labs?.length || 0}</span>
                    <span className="stat-txt">Labs</span>
                  </div>
                  {dept.slug !== 'general-science' && (
                    <div className="stat-box">
                      <span className="stat-num">3</span>
                      <span className="stat-txt">Years</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'vision' && (
              <>
                <h2 className="content-heading">Vision & Mission</h2>
                <div className="content-line"></div>
                {dept.vision && (
                  <div className="vm-block">
                    <h3 className="vm-title">Vision</h3>
                    <p>{dept.vision}</p>
                  </div>
                )}
                {dept.mission && (
                  <div className="vm-block">
                    <h3 className="vm-title">Mission</h3>
                    {Array.isArray(dept.mission) ? (
                      <ul className="vm-list">
                        {dept.mission.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{dept.mission}</p>
                    )}
                  </div>
                )}
                {!dept.vision && !dept.mission && (
                  <p style={{ color: '#888' }}>Vision and mission details not available for this department.</p>
                )}
              </>
            )}

            {activeTab === 'infrastructure' && (
              <>
                <h2 className="content-heading">Infrastructure</h2>
                <div className="content-line"></div>
                <p>
                  The {dept.name} department has well-built infrastructure to
                  support quality technical education. The facilities include
                  modern laboratories, workshops, and computing resources.
                </p>
                {(() => {
                  const items = [...(dept.labs || []), ...(dept.infrastructure || [])];
                  return items.length > 0 ? (
                    <div className="labs-grid">
                      {items.map((item, i) => (
                        <div className="lab-img-card" key={i} style={{ cursor: item.image ? 'pointer' : 'default' }} onClick={() => item.image && setLightbox(item)}>
                          {item.image && (
                            <div className="lab-img-wrap">
                              <img src={item.image} alt={item.name} />
                            </div>
                          )}
                          <h4 className="lab-img-name">{item.name}</h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>No infrastructure items added yet.</p>
                  );
                })()}
              </>
            )}

            {activeTab === 'curriculum' && (
              <>
                <h2 className="content-heading">Curriculum / Syllabus</h2>
                <div className="content-line"></div>
                <p>
                  The curriculum for {dept.name} is prescribed by Maharashtra State
                  Board of Technical Education (MSBTE), Mumbai. Download the syllabus
                  for each semester below.
                </p>

                {dept.curriculum && dept.curriculum.length > 0 ? (
                  <div className="curriculum-wrapper">
                    {years.map((year) => {
                      const yearSubjects = dept.curriculum.filter((c) => c.year === year);
                      if (yearSubjects.length === 0) return null;
                      return (
                        <div key={year} style={{ marginBottom: '24px' }}>
                          <h3 className="curriculum-year">{year}</h3>
                          {[...new Set(yearSubjects.map((c) => c.semester))].sort((a, b) => a - b).map((sem) => {
                            const semSubjects = yearSubjects.filter((c) => c.semester === sem);
                            return (
                              <div key={sem} style={{ marginBottom: '16px' }}>
                                <h4 style={{ fontSize: '14px', color: '#7A263A', margin: '0 0 8px', fontWeight: 600 }}>Semester {sem}</h4>
                                <table className="curriculum-table">
                                  <thead>
                                    <tr>
                                      <th>Subject</th>
                                      <th>Link</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {semSubjects.map((sub, sIdx) => (
                                      <tr key={sIdx}>
                                        <td>{sub.name}</td>
                                        <td>
                                          {sub.url ? (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                              <a href={sub.url} className="curr-btn curr-view" target="_blank" rel="noreferrer">View</a>
                                              <a href={sub.url} className="curr-btn curr-download" download title="Download">
                                                <span className="curr-download-text">Download</span>
                                                <span className="curr-download-icon">
                                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                                </span>
                                              </a>
                                            </div>
                                          ) : (
                                            <span style={{ color: '#ccc' }}>—</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>Curriculum details not available yet.</p>
                )}
              </>
            )}

            {activeTab === 'obe' && (
              <div className="obe-main-card">
                <h2 className="content-heading">Outcome Based Education</h2>
                <div className="content-line"></div>
                <p>
                  The {dept.name} department follows the Outcome Based Education (OBE)
                  framework to ensure that students achieve the desired learning outcomes.
                </p>

                {/* Horizontal sub-tabs */}
                <div className="obe-tabs">
                  {['peos', 'pos', 'psos', 'cos'].map((tab) => (
                    <button
                      key={tab}
                      className={`obe-tab ${obeTab === tab ? 'active' : ''}`}
                      onClick={() => setObTab(tab)}
                    >
                      {tab === 'peos' && 'PEOs'}
                      {tab === 'pos' && 'POs'}
                      {tab === 'psos' && 'PSOs'}
                      {tab === 'cos' && 'COs'}
                    </button>
                  ))}
                </div>

                <div className="obe-content">
                  {obeTab === 'peos' && (
                    <div className="obe-sub-card">
                      <h3 className="obe-sub-heading">Program Educational Objectives (PEOs)</h3>
                      <p className="obe-desc">PEOs are broad statements that describe the career and professional achievements that the program is preparing graduates to achieve.</p>
                      {dept.peos && dept.peos.length > 0 ? (
                        <ul className="obe-list">
                          {dept.peos.map((peo, i) => (
                            <li key={i} className="obe-list-item">
                              <div>
                                {peo.title && <strong>{peo.title}</strong>}
                                {peo.description && <p>{peo.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>PEOs not added yet.</p>
                      )}
                    </div>
                  )}
                  {obeTab === 'pos' && (
                    <div className="obe-sub-card">
                      <h3 className="obe-sub-heading">Program Outcomes (POs)</h3>
                      <p className="obe-desc">POs are measurable outcomes that students are expected to achieve by the time of graduation.</p>
                      {dept.pos && dept.pos.length > 0 ? (
                        <ul className="obe-list">
                          {dept.pos.map((po, i) => (
                            <li key={i} className="obe-list-item">
                              <div>
                                {po.title && <strong>{po.title}</strong>}
                                {po.description && <p>{po.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>POs not added yet.</p>
                      )}
                    </div>
                  )}
                  {obeTab === 'psos' && (
                    <div className="obe-sub-card">
                      <h3 className="obe-sub-heading">Program Specific Outcomes (PSOs)</h3>
                      <p className="obe-desc">PSOs are outcomes that differentiate the program from other programs and reflect the discipline-specific competencies.</p>
                      {dept.psos && dept.psos.length > 0 ? (
                        <ul className="obe-list">
                          {dept.psos.map((pso, i) => (
                            <li key={i} className="obe-list-item">
                              <div>
                                {pso.title && <strong>{pso.title}</strong>}
                                {pso.description && <p>{pso.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>PSOs not added yet.</p>
                      )}
                    </div>
                  )}
                  {obeTab === 'cos' && (
                    <div className="obe-sub-card">
                      <h3 className="obe-sub-heading">Course Outcomes (COs)</h3>
                      <p className="obe-desc">COs are specific measurable outcomes that students should demonstrate upon successful completion of a course.</p>
                      {dept.cos && dept.cos.length > 0 ? (
                        <ul className="obe-list">
                          {dept.cos.map((co, i) => (
                            <li key={i} className="obe-list-item">
                              <div>
                                {co.title && <strong>{co.title}</strong>}
                                {co.description && <p>{co.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>COs not added yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'hod' && (
              <>
                <h2 className="content-heading">HOD Desk</h2>
                <div className="content-line"></div>
                <div className="officer-card">
                  <div className="officer-left">
                    {dept.hodImage ? (
                      <div className="officer-photo">
                        <img src={dept.hodImage} alt={dept.hod} />
                      </div>
                    ) : (
                      <div className="officer-photo officer-photo-placeholder">
                        <span>{dept.hod?.split(' ').pop()?.charAt(0) || '?'}</span>
                      </div>
                    )}
                    <h4 className="officer-name">{dept.hod}</h4>
                    <p className="officer-designation">Head of Department</p>
                    {dept.hodQual && (
                      <p className="officer-qual">{dept.hodQual}</p>
                    )}
                  </div>
                  <div className="officer-msg">
                    <p className="message-quote">
                      "Welcome to the Department of {dept.name}. We are committed to
                      providing quality education and practical training to our students."
                    </p>
                    {dept.hodMsg && (
                      <p style={{ whiteSpace: 'pre-line' }}>{dept.hodMsg}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'faculty' && (
              <>
                <h2 className="content-heading">Faculty</h2>
                <div className="content-line"></div>
                {dept.faculty && dept.faculty.length > 0 ? (
                  <div className="faculty-grid">
                    {dept.faculty.map((f, i) => (
                      <div className="faculty-card-new" key={i}>
                        <div className="fcard-photo">
                          {f.image ? (
                            <img src={f.image} alt={f.name} />
                          ) : (
                            <span>{f.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <h4 className="fcard-name">{f.name}</h4>
                        <p className="fcard-designation">{f.designation}</p>
                        <div className="fcard-details">
                          <span><strong>Qualification:</strong> {f.qual}</span>
                          <span><strong>Experience:</strong> {f.exp ? `${parseInt(f.exp, 10) + (new Date().getFullYear() - (f.expYear || new Date().getFullYear()))} years` : f.exp}</span>
                        </div>
                        {f.email && <a href={`mailto:${f.email}`} className="fcard-email">{f.email}</a>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>No faculty members added yet.</p>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.image} alt={lightbox.name} className="lightbox-img" />
            <div className="lightbox-info">
              <h3>{lightbox.name}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DepartmentsPage;
