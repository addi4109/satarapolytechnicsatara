import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
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
        <SEO title="Examination | Satara Polytechnic" description="MSBTE exam schedule, rules, and results." keywords="MSBTE exam, exam schedule, results" url="/examination" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} | Examination`}
        description={`${active === 'schedule' ? 'Check MSBTE exam schedule for all semesters at Satara Polytechnic.' : active === 'results' ? 'View MSBTE exam results and result portal link.' : active === 'rules' ? 'Know the examination rules and regulations.' : active === 'revaluation' ? 'Revaluation process and fee details.' : 'Latest exam notices and circulars.'} Satara Polytechnic, Satara.`}
        keywords={`MSBTE exam ${active}, examination schedule, polytechnic exam results, Satara Polytechnic exam, revaluation`}
        url={`/examination/${page || 'schedule'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Examination', url: '/examination' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
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

              <style>{`
                .exam-rule-card {
                  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                  cursor: default;
                }
                .exam-rule-card:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 8px 24px rgba(36, 51, 88, 0.12);
                  border-color: #c8963e;
                }
                .exam-subsection-card {
                  transition: box-shadow 0.3s ease, border-color 0.3s ease;
                }
                .exam-subsection-card:hover {
                  box-shadow: 0 4px 16px rgba(36, 51, 88, 0.08);
                  border-color: #c8963e;
                }
                .exam-subsection-title {
                  transition: color 0.2s ease;
                }
                .exam-subsection-title:hover {
                  color: #c8963e !important;
                }
              `}</style>

              {/* Sub-Sections (new format) */}
              {getSection('rules').ruleSubSections && getSection('rules').ruleSubSections.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  {getSection('rules').ruleSubSections.map((subSection, ssIdx) => (
                    <div key={ssIdx} className="exam-subsection-card" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e4e8ed', borderRadius: '10px', background: '#fff' }}>
                      <h3 className="exam-subsection-title" style={{ margin: '0 0 12px', color: '#243358', fontSize: '21px', borderBottom: '2px solid #c8963e', paddingBottom: '6px' }}>
                        {subSection.subTitle || 'Untitled Section'}
                      </h3>
                      {subSection.rules && subSection.rules.map((rule, rIdx) => (
                        <div key={rIdx} className="exam-rule-card" style={{ marginBottom: '12px', padding: '14px 16px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '8px', marginLeft: '8px' }}>
                          <h4 style={{ margin: '0 0 6px', color: '#243358', fontSize: '18px' }}>
                            <span style={{ color: '#7A263A', marginRight: '8px' }}>Rule {rIdx + 1}:</span>
                            {rule.title}
                          </h4>
                          {rule.description && (
                            <p style={{ margin: '0 0 6px', color: '#555', fontSize: '16px', lineHeight: '1.6' }}>{rule.description}</p>
                          )}
                          {rule.subPoints && rule.subPoints.length > 0 && (
                            <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
                              {rule.subPoints.map((sp, spIdx) => (
                                <li key={spIdx} style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '3px' }}>{sp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Legacy flat rules (backward compatibility) */}
              {(!getSection('rules').ruleSubSections || getSection('rules').ruleSubSections.length === 0) && getSection('rules').rules && getSection('rules').rules.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  {getSection('rules').rules.map((rule, i) => (
                    <div key={i} className="exam-rule-card" style={{ marginBottom: '16px', padding: '16px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 8px', color: '#243358', fontSize: '18px' }}>
                        <span style={{ color: '#7A263A', marginRight: '8px' }}>Rule {i + 1}:</span>
                        {rule.title}
                      </h4>
                      {rule.description && (
                        <p style={{ margin: '0 0 6px', color: '#555', fontSize: '16px', lineHeight: '1.6' }}>{rule.description}</p>
                      )}
                      {rule.subPoints && rule.subPoints.length > 0 && (
                        <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                          {rule.subPoints.map((sp, spIdx) => (
                            <li key={spIdx} style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '3px' }}>{sp}</li>
                          ))}
                        </ul>
                      )}
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
                <div style={{ marginTop: '28px', textAlign: 'center' }}>
                  <style>{`
                    .result-portal-btn {
                      display: inline-flex;
                      align-items: center;
                      gap: 10px;
                      padding: 14px 36px;
                      background: linear-gradient(135deg, #243358 0%, #3a5080 100%);
                      color: #fff;
                      font-size: 16px;
                      font-weight: 600;
                      border: none;
                      border-radius: 50px;
                      text-decoration: none;
                      cursor: pointer;
                      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
                      box-shadow: 0 4px 15px rgba(36, 51, 88, 0.3);
                    }
                    .result-portal-btn:hover {
                      transform: translateY(-3px);
                      box-shadow: 0 8px 25px rgba(36, 51, 88, 0.4);
                      background: linear-gradient(135deg, #7A263A 0%, #a63446 100%);
                    }
                    .result-portal-btn:active {
                      transform: translateY(-1px);
                      box-shadow: 0 4px 12px rgba(36, 51, 88, 0.3);
                    }
                    .result-portal-btn .btn-arrow {
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      width: 28px;
                      height: 28px;
                      background: rgba(255,255,255,0.2);
                      border-radius: 50%;
                      font-size: 14px;
                      transition: transform 0.3s ease;
                    }
                    .result-portal-btn:hover .btn-arrow {
                      transform: translateX(4px);
                    }
                  `}</style>
                  <a
                    href={getSection('results').resultPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-portal-btn"
                  >
                    <span>View Result Portal</span>
                    <span className="btn-arrow">→</span>
                  </a>
                  <p style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>{getSection('results').resultPortalUrl}</p>
                </div>
              ) : (
                <div style={{ marginTop: '28px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 36px', background: '#f0f2f5', borderRadius: '50px', color: '#aaa', fontSize: '16px', fontWeight: 600 }}>
                    <span>Result Portal</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', fontSize: '14px' }}>→</span>
                  </div>
                  <p style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>Result portal link will be available soon.</p>
                </div>
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
                <div style={{ marginTop: '20px' }}>
                  {getSection('revaluation').revaluationSteps.map((step, i) => (
                    <div className="rev-step-card" key={i}>
                      <div className="step-number">{i + 1}</div>
                      <div className="step-content">
                        <h4>{step.title}</h4>
                        {step.description && <p>{step.description}</p>}
                        {step.subPoints && step.subPoints.length > 0 && (
                          <ul>
                            {step.subPoints.map((sp, spIdx) => (
                              <li key={spIdx}>{sp}</li>
                            ))}
                          </ul>
                        )}
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
