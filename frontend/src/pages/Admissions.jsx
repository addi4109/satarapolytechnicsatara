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

  // Helper: render sub-sections
  const renderSubSections = (subSections) => {
    if (!subSections || subSections.length === 0) return null;
    return subSections.map((sub, i) => (
      <div key={i} style={{ marginTop: '32px' }}>
        {sub.title && (
          <>
            <h3 className="content-sub-heading">{sub.title}</h3>
            <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '16px', borderRadius: '2px' }}></div>
          </>
        )}
        {renderContent(sub.content)}
        {renderStats(sub.stats)}
        {sub.documents && sub.documents.length > 0 && (
          <>
            <h3 className="content-sub-heading">Documents Required</h3>
            <ul className="vm-list">
              {sub.documents.map((doc, j) => (
                <li key={j}>{doc}</li>
              ))}
            </ul>
          </>
        )}
        {renderSteps(sub.steps)}
      </div>
    ));
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
          {/* Overview - Static Professional Layout */}
          {active === 'overview' && (
            <>
              <h2 className="content-heading">Admission Overview</h2>
              <div className="content-line"></div>
              <p>
                Welcome to the Admissions section of Shri Satara Polytechnic, Satara — one of the
                premier diploma engineering institutes in Maharashtra, established with a vision to
                provide quality technical education. Our institute is approved by AICTE, New Delhi
                and affiliated to MSBTE, Mumbai, offering six full-time diploma programmes in
                engineering disciplines.
              </p>
              <p>
                Admissions to all diploma programmes are conducted as per the rules and schedules
                laid down by the Directorate of Technical Education (DTE), Maharashtra through the
                Central Admission Process (CAP). Students can also seek admission through the
                Institute Level / Management quota for vacant seats.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">06</span>
                  <span className="stat-txt">Engineering Programs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">360</span>
                  <span className="stat-txt">Annual Intake</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">02</span>
                  <span className="stat-txt">Admission Routes</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">100%</span>
                  <span className="stat-txt">Career-Focused Education</span>
                </div>
              </div>

              {/* Why Choose Us */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Why Choose Shri Satara Polytechnic?</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="admission-highlight-grid">
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
                    </div>
                    <h4>Approved by AICTE</h4>
                    <p>All programmes are approved by the All India Council for Technical Education (AICTE), New Delhi, ensuring national-level quality standards.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                    </div>
                    <h4>Modern Infrastructure</h4>
                    <p>Well-equipped laboratories, computer centres, workshops and a library with 15,000+ books and digital resources.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h4>Experienced Faculty</h4>
                    <p>Team of dedicated and qualified faculty members with industry experience committed to student success.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8l-4 4-4-4"/><path d="M16 16l-4-4-4 4"/></svg>
                    </div>
                    <h4>Placement Assistance</h4>
                    <p>Dedicated Training &amp; Placement Cell providing campus recruitment drives, soft skill training and career guidance.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <h4>Affiliated to MSBTE</h4>
                    <p>Fully affiliated to Maharashtra State Board of Technical Education (MSBTE), Mumbai with proven academic results.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <div className="highlight-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#243358" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h4>Scholarships Available</h4>
                    <p>Government and private scholarships for SC/ST/OBC/VJNT/Minority and EWS students making education affordable.</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Quick Navigation</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="admission-quick-grid">
                  <button className="admission-quick-card" onClick={() => setActive('courses')}>
                    <span className="quick-card-num">01</span>
                    <span className="quick-card-label">Courses Offered</span>
                    <span className="quick-card-desc">6 diploma engineering programmes</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                  <button className="admission-quick-card" onClick={() => setActive('eligibility')}>
                    <span className="quick-card-num">02</span>
                    <span className="quick-card-label">Eligibility</span>
                    <span className="quick-card-desc">Check admission criteria</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                  <button className="admission-quick-card" onClick={() => setActive('process')}>
                    <span className="quick-card-num">03</span>
                    <span className="quick-card-label">Admission Process</span>
                    <span className="quick-card-desc">Step-by-step CAP process</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                  <button className="admission-quick-card" onClick={() => setActive('fees')}>
                    <span className="quick-card-num">04</span>
                    <span className="quick-card-label">Fee Structure</span>
                    <span className="quick-card-desc">Category-wise fee details</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                  <button className="admission-quick-card" onClick={() => setActive('scholarships')}>
                    <span className="quick-card-num">05</span>
                    <span className="quick-card-label">Scholarships</span>
                    <span className="quick-card-desc">Government scholarship schemes</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                  <button className="admission-quick-card" onClick={() => setActive('brochure')}>
                    <span className="quick-card-num">06</span>
                    <span className="quick-card-label">College Brochure</span>
                    <span className="quick-card-desc">Download prospectus PDF</span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Key Dates / Important Info */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Important Information</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Academic Year</span>
                    <span className="info-value">2026-27</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Duration of Programme</span>
                    <span className="info-value">3 Years (6 Semesters)</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Admission Mode</span>
                    <span className="info-value">Central Admission Process (CAP) by DTE Maharashtra</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Institute Level Seats</span>
                    <span className="info-value">Available for vacant seats after CAP rounds</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Direct Second Year</span>
                    <span className="info-value">Available for SSC / HSC (Science) / ITI pass candidates</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Contact for Admissions</span>
                    <span className="info-value">+91-2162 284 040 | satarapolyinfo@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Admission Routes */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Admission Routes</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px' }}>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', margin: '0 0 10px' }}>Central Admission Process (CAP)</h4>
                    <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                      Admission through online CAP rounds conducted by DTE Maharashtra. Students must
                      register on the DTE portal, fill preference forms, and confirm admission at the
                      institute after seat allocation. All categories (Open, SC, ST, OBC, VJNT, EWS)
                      are covered under this process.
                    </p>
                  </div>
                  <div style={{ background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px' }}>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', margin: '0 0 10px' }}>Institute Level / Management</h4>
                    <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                      Vacant seats after CAP rounds are filled under Institute Level / Management quota.
                      Interested candidates can contact the institute directly for availability and
                      admission procedure. Merit-based selection is followed.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Courses */}
          {active === 'courses' && (
            <>
              <h2 className="content-heading">{getSection('courses').title || 'Courses Offered'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('courses').content || STATIC_CONTENT.admissions.courses)}
              {renderSubSections(getSection('courses').subSections)}
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
              {renderSubSections(getSection('eligibility').subSections)}

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
              {renderSubSections(getSection('process').subSections)}
            </>
          )}

          {/* First Year */}
          {active === 'first-year' && (
            <>
              <h2 className="content-heading">{getSection('first-year').title || 'First Year Admission'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('first-year').content || STATIC_CONTENT.admissions['first-year'])}
              {renderDocuments(getSection('first-year').documents)}
              {renderSubSections(getSection('first-year').subSections)}
            </>
          )}

          {/* Direct Second Year */}
          {active === 'direct-second' && (
            <>
              <h2 className="content-heading">{getSection('direct-second').title || 'Direct Second Year Admission'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('direct-second').content || STATIC_CONTENT.admissions['direct-second'])}
              {renderDocuments(getSection('direct-second').documents)}
              {renderSubSections(getSection('direct-second').subSections)}
            </>
          )}

          {/* A-CAP */}
          {active === 'acap' && (
            <>
              <h2 className="content-heading">{getSection('acap').title || 'A-CAP'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('acap').content || STATIC_CONTENT.admissions.acap)}
              {renderDocuments(getSection('acap').documents)}
              {renderSubSections(getSection('acap').subSections)}
            </>
          )}

          {/* Fees */}
          {active === 'fees' && (
            <>
              <h2 className="content-heading">{getSection('fees').title || 'Fee Structure'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('fees').content || STATIC_CONTENT.admissions.fees)}

              {/* Helper: render a fee table */}
              {(() => {
                const renderFeeTable = (rows, yearLabel) => {
                  if (!rows || rows.length === 0) return null;
                  return (
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
                          {rows.map((row, i) => {
                            const isTotal = row.particular?.toLowerCase().includes('total');
                            return (
                              <tr key={i} className={isTotal ? 'fee-total-row' : ''}>
                                {i === 0 && <td rowSpan={rows.length} className="fee-year-cell">{yearLabel}</td>}
                                <td className="fee-particular">{row.particular}</td>
                                <td className={isTotal ? 'fee-total' : 'fee-amount'}>{row.open || '—'}</td>
                                <td className={isTotal ? 'fee-total' : 'fee-amount'}>{row.vjnt || '—'}</td>
                                <td className={isTotal ? 'fee-total' : 'fee-amount'}>{row.scst || '—'}</td>
                                <td className={isTotal ? 'fee-total' : 'fee-amount'}>{row.girls || '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                };

                const feeRows1 = getSection('fees').feeRows1 || [];
                const feeRows2 = getSection('fees').feeRows2 || [];

                return (
                  <>
                    {renderFeeTable(feeRows1, 'First Year')}
                    {renderFeeTable(feeRows2, 'Direct Second Year')}
                    {(feeRows1.length > 0 || feeRows2.length > 0) && (
                      <p className="fee-note" style={{ marginTop: '12px', fontSize: 12, color: '#888' }}>
                        Note: Above shown fee structure is applicable to candidate whose parent
                        income is up to ₹ 8,00,000/-
                      </p>
                    )}
                  </>
                );
              })()}
            </>
          )}

          {/* Scholarships */}
          {active === 'scholarships' && (
            <>
              <h2 className="content-heading">{getSection('scholarships').title || 'Scholarships'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('scholarships').content || STATIC_CONTENT.admissions.scholarships)}
              {renderSubSections(getSection('scholarships').subSections)}

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
              {renderSubSections(getSection('brochure').subSections)}

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
