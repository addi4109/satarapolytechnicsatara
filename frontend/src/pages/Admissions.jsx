import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';

const routeMap = {
  overview: 'overview',
  courses: 'courses',
  eligibility: 'eligibility',
  process: 'process',
  'first-year': 'first-year',
  'direct-second': 'direct-second',
  acap: 'acap',
  fees: 'fees',
  scholarships: 'scholarships',
  brochure: 'brochure',
};

const sidebarLinks = [
  { id: 'overview', label: 'Admission Overview' },
  { id: 'courses', label: 'Courses Offered' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'process', label: 'Admission Process' },
  { id: 'first-year', label: 'First Year Admission' },
  { id: 'direct-second', label: 'Direct Second Year' },
  { id: 'acap', label: 'A-CAP' },
  { id: 'fees', label: 'Fee Structure' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'brochure', label: 'College Brochure' },
  { id: 'apply', label: 'Apply Now' },
];

const API_URL = '/api';

function Admissions() {
  const { page } = useParams();
  const [active, setActive] = useState('overview');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    fetch(`${API_URL}/admissions-admin`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        data.forEach((s) => { mapped[s.section] = s; });
        setSections(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Helper: render content paragraphs
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i}>{para}</p>
    ));
  };

  // Helper: render stats
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

  // Helper: render steps
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

  // Helper: render documents list
  const renderDocuments = (docs) => {
    if (!docs || docs.length === 0) return null;
    return (
      <>
        <h3 className="content-sub-heading">Documents Required</h3>
        <ul className="vm-list">
          {docs.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </>
    );
  };

  // Helper: render info rows
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

  const getSection = (key) => sections[key] || {};

  if (loading) {
    return (
      <>
        <SEO title="Admissions | Satara Polytechnic" description="Diploma admission information at Satara Polytechnic." keywords="polytechnic admission, fee structure" url="/admissions/overview" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${active === 'fees' ? 'Fee Structure' : active === 'eligibility' ? 'Eligibility Criteria' : active === 'process' ? 'Admission Process' : active === 'first-year' ? 'First Year Admission' : active === 'direct-second' ? 'Direct Second Year' : active === 'acap' ? 'A-CAP Admission' : active === 'scholarships' ? 'Scholarships' : active === 'brochure' ? 'College Brochure' : active === 'courses' ? 'Courses Offered' : 'Admission Overview'} | Admissions 2026-27`}
        description={`${active === 'fees' ? 'Complete fee structure for First Year and Direct Second Year diploma programs at Satara Polytechnic.' : active === 'eligibility' ? 'Eligibility criteria for FY and Direct Second Year admission at Satara Polytechnic.' : active === 'process' ? 'Step-by-step admission process for diploma programs.' : active === 'first-year' ? 'First year diploma admission details and required documents.' : active === 'direct-second' ? 'Direct second year admission for SSC passed students.' : active === 'acap' ? 'A-CAP admission process for Maharashtra students.' : active === 'scholarships' ? 'Government and private scholarships for SC/ST/OBC/Minority students.' : active === 'brochure' ? 'Download the official college brochure for Satara Polytechnic.' : active === 'courses' ? '6 diploma engineering courses offered at Satara Polytechnic.' : 'Admission information for diploma engineering programs at Satara Polytechnic, Satara.'}`}
        keywords={`polytechnic admission 2026, ${active} admission, fee structure, eligibility, Satara Polytechnic admission, diploma admission`}
        url={`/admissions/${page || 'overview'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Admissions', url: '/admissions/overview' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
      <PageBanner
        title="Admissions"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Admissions
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Admissions</h3>
          <ul className="sidebar-list">
            {sidebarLinks.map((link) => (
              <li key={link.id}>
                {link.id === 'apply' ? (
                  <Link to="/admissions/apply" className="sidebar-link">
                    <span className="arrow">→</span>
                    {link.label}
                  </Link>
                ) : (
                  <button
                    className={`sidebar-link ${active === link.id ? 'active' : ''}`}
                    onClick={() => setActive(link.id)}
                  >
                    <span className="arrow">→</span>
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="about-content">
          {/* Overview */}
          {active === 'overview' && (
            <>
              <h2 className="content-heading">{getSection('overview').title || 'Admission Overview'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('overview').content || STATIC_CONTENT.admissions.overview)}
              {renderStats(getSection('overview').stats)}
            </>
          )}

          {/* Courses */}
          {active === 'courses' && (
            <>
              <h2 className="content-heading">{getSection('courses').title || 'Courses Offered'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('courses').content || STATIC_CONTENT.admissions.courses)}
              {getSection('courses').courseTable && getSection('courses').courseTable.length > 0 && (
                <div className="fee-table-wrap">
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>Sr. No.</th>
                        <th style={{ textAlign: 'left' }}>Course Name</th>
                        <th style={{ width: 100 }}>Duration</th>
                        <th style={{ width: 80 }}>Intake</th>
                        <th style={{ width: 120 }}>Direct 2nd Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSection('courses').courseTable.map((course, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td className="fee-particular">{course.name}</td>
                          <td style={{ textAlign: 'center' }}>{course.duration}</td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{course.intake}</td>
                          <td style={{ textAlign: 'center' }}>{course.direct2nd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Eligibility */}
          {active === 'eligibility' && (
            <>
              <h2 className="content-heading">{getSection('eligibility').title || 'Eligibility'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('eligibility').content || STATIC_CONTENT.admissions.eligibility)}

              {getSection('eligibility').eligFirstYear && getSection('eligibility').eligFirstYear.length > 0 && (
                <>
                  <h3 className="content-sub-heading">First Year Diploma</h3>
                  <ul className="vm-list">
                    {getSection('eligibility').eligFirstYear.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {getSection('eligibility').eligDirect2nd && getSection('eligibility').eligDirect2nd.length > 0 && (
                <>
                  <h3 className="content-sub-heading">Direct Second Year Diploma</h3>
                  <ul className="vm-list">
                    {getSection('eligibility').eligDirect2nd.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          {/* Process */}
          {active === 'process' && (
            <>
              <h2 className="content-heading">{getSection('process').title || 'Admission Process'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('process').content || STATIC_CONTENT.admissions.process)}
              {renderSteps(getSection('process').steps)}
            </>
          )}

          {/* First Year */}
          {active === 'first-year' && (
            <>
              <h2 className="content-heading">{getSection('first-year').title || 'First Year Admission'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('first-year').content || STATIC_CONTENT.admissions['first-year'])}
              {renderDocuments(getSection('first-year').documents)}
            </>
          )}

          {/* Direct Second Year */}
          {active === 'direct-second' && (
            <>
              <h2 className="content-heading">{getSection('direct-second').title || 'Direct Second Year Admission'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('direct-second').content || STATIC_CONTENT.admissions['direct-second'])}
              {renderDocuments(getSection('direct-second').documents)}
            </>
          )}

          {/* A-CAP */}
          {active === 'acap' && (
            <>
              <h2 className="content-heading">{getSection('acap').title || 'A-CAP'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('acap').content || STATIC_CONTENT.admissions.acap)}
              {renderDocuments(getSection('acap').documents)}
            </>
          )}

          {/* Fees */}
          {active === 'fees' && (
            <>
              <h2 className="content-heading">{getSection('fees').title || 'Fee Structure'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('fees').content || STATIC_CONTENT.admissions.fees)}

              {/* First Year Fee Table */}
              <div className="fee-table-wrap" style={{ marginTop: '20px' }}>
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Year</th>
                      <th style={{ textAlign: 'left' }}>Fee Particulars</th>
                      <th>OPEN / OBC / EWS / SEBC</th>
                      <th>VJNT / SBC</th>
                      <th>SC / ST</th>
                      <th>OPEN / OBC / EWS / SEBC VJNT / SBC Category Girls</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td rowSpan="7" className="fee-year-cell">First Year</td><td className="fee-particular">Tuition Fee</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Development Fee</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Enrollment Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Eligibility Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Insurance Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Identity Card Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr className="fee-total-row"><td className="fee-particular">Total Payable Fee</td><td className="fee-total"></td><td className="fee-total"></td><td className="fee-total"></td><td className="fee-total"></td></tr>
                  </tbody>
                </table>
              </div>

              {/* Direct Second Year Fee Table */}
              <div className="fee-table-wrap" style={{ marginTop: '24px' }}>
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Year</th>
                      <th style={{ textAlign: 'left' }}>Fee Particulars</th>
                      <th>OPEN / OBC / EWS / SEBC</th>
                      <th>VJNT / SBC</th>
                      <th>SC / ST</th>
                      <th>OPEN / OBC / EWS / SEBC VJNT / SBC Category Girls</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td rowSpan="7" className="fee-year-cell">Direct Second Year</td><td className="fee-particular">Tuition Fee</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Development Fee</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Enrollment Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Eligibility Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Insurance Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr><td className="fee-particular">Identity Card Fees</td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td><td className="fee-amount"></td></tr>
                    <tr className="fee-total-row"><td className="fee-particular">Total Payable Fee</td><td className="fee-total"></td><td className="fee-total"></td><td className="fee-total"></td><td className="fee-total"></td></tr>
                  </tbody>
                </table>
              </div>

              <p className="fee-note" style={{ marginTop: '12px', fontSize: 12, color: '#888' }}>
                Note: Above shown fee structure is applicable to candidate whose parent
                income is up to ₹ 8,00,000/-
              </p>
            </>
          )}

          {/* Scholarships */}
          {active === 'scholarships' && (
            <>
              <h2 className="content-heading">{getSection('scholarships').title || 'Scholarships'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('scholarships').content || STATIC_CONTENT.admissions.scholarships)}

              {getSection('scholarships').scholarshipDocs && getSection('scholarships').scholarshipDocs.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  {getSection('scholarships').scholarshipDocs.map((cat, i) => (
                    <div key={i} style={{ marginBottom: '24px' }}>
                      <h3 className="content-sub-heading">{cat.category}</h3>
                      {cat.scheme && <p className="scholarship-scheme"><strong>Scheme:</strong> {cat.scheme}</p>}
                      {cat.docs.length > 0 && (
                        <div className="courses-table-wrap">
                          <table className="courses-table">
                            <thead>
                              <tr>
                                <th style={{ width: 60 }}>Sr. No.</th>
                                <th>Document</th>
                                <th>Details / Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cat.docs.map((doc, j) => (
                                <tr key={j}>
                                  <td style={{ textAlign: 'center' }}>{doc.sr}</td>
                                  <td>{doc.document}</td>
                                  <td>{doc.details}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Brochure */}
          {active === 'brochure' && (
            <>
              <h2 className="content-heading">{getSection('brochure').title || 'College Brochure'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('brochure').content || STATIC_CONTENT.admissions.brochure)}

              {getSection('brochure').pdfUrl ? (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <a
                    href={`/api/pdf-proxy?url=${encodeURIComponent(getSection('brochure').pdfUrl)}`}
                    target="_blank"
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: '14px', textDecoration: 'none' }}
                  >
                    View Brochure
                  </a>
                  <a
                    href={`/api/pdf-proxy?url=${encodeURIComponent(getSection('brochure').pdfUrl)}`}
                    download
                    className="btn btn-secondary"
                    style={{ padding: '10px 24px', fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    Download Brochure
                  </a>
                      }
                    }}
                    style={{ padding: '10px 24px', fontSize: '14px' }}
                  >
                    Download Brochure
                  </a>
                </div>
              ) : (
                <p style={{ marginTop: '20px', color: '#888' }}>No brochure uploaded yet.</p>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Admissions;
