import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';

const API_URL = '/api';

const routeMap = {
  schedule: 'schedule',
  rules: 'rules',
  results: 'results',
  revaluation: 'revaluation',
  notices: 'notices',
};

const sidebarLinks = [
  { id: 'schedule', label: 'Exam Schedule' },
  { id: 'rules', label: 'Exam Rules' },
  { id: 'results', label: 'Results' },
  { id: 'revaluation', label: 'Revaluation' },
  { id: 'notices', label: 'Exam Notices' },
];

function Examinations() {
  const { page } = useParams();
  const [active, setActive] = useState('schedule');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    fetch(`${API_URL}/examinations`)
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

  const getSection = (key) => sections[key] || {};

  if (loading) {
    return (
      <>
        <PageBanner title="Examination" breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Examination</>} />
        <div className="about-layout">
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="Examination"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Examination
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Examination</h3>
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
          {/* Exam Schedule */}
          {active === 'schedule' && (
            <>
              <h2 className="content-heading">{getSection('schedule').title || 'Exam Schedule'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('schedule').content || STATIC_CONTENT.examinations.schedule)}

              {getSection('schedule').schedules && getSection('schedule').schedules.length > 0 && (
                <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th>Exam Name</th>
                        <th>Semester</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th style={{ width: 120, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('schedule').schedules.map((item, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td className="fee-particular" style={{ fontWeight: 500 }}>{item.examName}</td>
                          <td style={{ textAlign: 'center' }}>{item.semester}</td>
                          <td style={{ textAlign: 'center' }}>{item.startDate}</td>
                          <td style={{ textAlign: 'center' }}>{item.endDate}</td>
                          <td style={{ textAlign: 'center' }}>
                            {item.pdfUrl ? (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#243358', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}
                              >
                                View PDF
                              </a>
                            ) : (
                              <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Exam Rules */}
          {active === 'rules' && (
            <>
              <h2 className="content-heading">{getSection('rules').title || 'Exam Rules'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('rules').content || STATIC_CONTENT.examinations.rules)}

              {getSection('rules').rules && getSection('rules').rules.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  {getSection('rules').rules.map((rule, i) => (
                    <div key={i} style={{ marginBottom: '16px', padding: '16px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 8px', color: '#243358', fontSize: '15px' }}>
                        <span style={{ color: '#7A263A', marginRight: '8px' }}>Rule {i + 1}:</span>
                        {rule.title}
                      </h4>
                      <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>{rule.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Results */}
          {active === 'results' && (
            <>
              <h2 className="content-heading">{getSection('results').title || 'Results'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('results').content || STATIC_CONTENT.examinations.results)}

              {getSection('results').resultPortalUrl ? (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <a
                    href={getSection('results').resultPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '12px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}
                  >
                    View Result Portal →
                  </a>
                </div>
              ) : (
                <p style={{ color: '#888', marginTop: '20px' }}>Result portal link will be available soon.</p>
              )}
            </>
          )}

          {/* Revaluation */}
          {active === 'revaluation' && (
            <>
              <h2 className="content-heading">{getSection('revaluation').title || 'Revaluation'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('revaluation').content || STATIC_CONTENT.examinations.revaluation)}

              {(getSection('revaluation').revaluationFee || getSection('revaluation').revaluationDeadline) && (
                <div className="info-table" style={{ marginTop: '20px' }}>
                  {getSection('revaluation').revaluationFee && (
                    <div className="info-row">
                      <span className="info-label">Revaluation Fee</span>
                      <span className="info-value">{getSection('revaluation').revaluationFee}</span>
                    </div>
                  )}
                  {getSection('revaluation').revaluationDeadline && (
                    <div className="info-row">
                      <span className="info-label">Last Date to Apply</span>
                      <span className="info-value">{getSection('revaluation').revaluationDeadline}</span>
                    </div>
                  )}
                </div>
              )}

              {getSection('revaluation').revaluationSteps && getSection('revaluation').revaluationSteps.length > 0 && (
                <div className="process-steps" style={{ marginTop: '20px' }}>
                  {getSection('revaluation').revaluationSteps.map((step, i) => (
                    <div className="process-step" key={i}>
                      <div className="step-number">{i + 1}</div>
                      <div className="step-content">
                        <h4>{step.title}</h4>
                        {step.description && <p>{step.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Exam Notices */}
          {active === 'notices' && (
            <>
              <h2 className="content-heading">{getSection('notices').title || 'Exam Notices'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('notices').content || STATIC_CONTENT.examinations.notices)}

              {getSection('notices').noticesData && getSection('notices').noticesData.length > 0 && (
                <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th>Title</th>
                        <th style={{ width: 120 }}>Date</th>
                        <th style={{ width: 100, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('notices').noticesData.map((item, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td>
                            <div className="fee-particular" style={{ fontWeight: 500 }}>{item.title}</div>
                            {item.description && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{item.description}</div>}
                          </td>
                          <td style={{ fontSize: '13px', color: '#666' }}>{item.date}</td>
                          <td style={{ textAlign: 'center' }}>
                            {item.pdfUrl ? (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#243358', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}
                              >
                                View PDF
                              </a>
                            ) : (
                              <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                            )}
                          </td>
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

export default Examinations;
