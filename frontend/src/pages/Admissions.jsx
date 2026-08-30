import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';
import { getAcademicYearFull } from '../lib/siteConfig';

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

  // Helper: render note
  const renderNote = (section) => {
    if (!section || !section.note || !section.note.trim()) return null;
    return (
      <div style={{ marginTop: '24px', padding: '16px 20px', background: '#fffbe6', borderLeft: '4px solid #d4a54a', borderRadius: '0 6px 6px 0' }}>
        <strong style={{ color: '#2a5a8a', fontSize: '13px' }}>📝 Note:</strong>
        <p style={{ margin: '6px 0 0', color: '#555', fontSize: '13px', lineHeight: '1.7' }}>{section.note}</p>
      </div>
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
            <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '16px', borderRadius: '2px' }}></div>
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
        title={`${active === 'fees' ? 'Fee Structure' : active === 'eligibility' ? 'Eligibility Criteria' : active === 'process' ? 'Admission Process' : active === 'first-year' ? 'First Year Admission' : active === 'direct-second' ? 'Direct Second Year' : active === 'acap' ? 'A-CAP Admission' : active === 'scholarships' ? 'Scholarships' : active === 'brochure' ? 'College Brochure' : active === 'courses' ? 'Courses Offered' : 'Admission Overview'} | Admissions ${getAcademicYearFull()}`}
        description={`${active === 'fees' ? 'Complete fee structure for First Year and Direct Second Year diploma programs at Satara Polytechnic.' : active === 'eligibility' ? 'Eligibility criteria for FY and Direct Second Year admission at Satara Polytechnic.' : active === 'process' ? 'Step-by-step admission process for diploma programs.' : active === 'first-year' ? 'First year diploma admission details and required documents.' : active === 'direct-second' ? 'Direct second year admission for SSC passed students.' : active === 'acap' ? 'A-CAP admission process for Maharashtra students.' : active === 'scholarships' ? 'Government and private scholarships for SC/ST/OBC/Minority students.' : active === 'brochure' ? 'Download the official college brochure for Satara Polytechnic.' : active === 'courses' ? '6 diploma engineering courses offered at Satara Polytechnic.' : 'Admission information for diploma engineering programs at Satara Polytechnic, Satara.'}`}
        keywords={`polytechnic admission ${getAcademicYearFull()}, ${active} admission, fee structure, eligibility, Satara Polytechnic admission, diploma admission`}
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
                Welcome to the Admissions section of Satara Polytechnic, Satara — one of the
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
                <h3 className="content-sub-heading">Why Choose Satara Polytechnic, Satara?</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="admission-highlight-grid">
                  <div className="admission-highlight-card">
                    <span className="highlight-num">01</span>
                    <h4>Approved by AICTE</h4>
                    <p>All programmes are approved by the All India Council for Technical Education (AICTE), New Delhi, ensuring national-level quality standards.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <span className="highlight-num">02</span>
                    <h4>Modern Infrastructure</h4>
                    <p>Well-equipped laboratories, computer centres, workshops and a library with 15,000+ books and digital resources.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <span className="highlight-num">03</span>
                    <h4>Experienced Faculty</h4>
                    <p>Team of dedicated and qualified faculty members with industry experience committed to student success.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <span className="highlight-num">04</span>
                    <h4>Placement Assistance</h4>
                    <p>Dedicated Training &amp; Placement Cell providing campus recruitment drives, soft skill training and career guidance.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <span className="highlight-num">05</span>
                    <h4>Affiliated to MSBTE</h4>
                    <p>Fully affiliated to Maharashtra State Board of Technical Education (MSBTE), Mumbai with proven academic results.</p>
                  </div>
                  <div className="admission-highlight-card">
                    <span className="highlight-num">06</span>
                    <h4>Scholarships Available</h4>
                    <p>Government and private scholarships for SC/ST/OBC/VJNT/Minority and EWS students making education affordable.</p>
                  </div>
                </div>
              </div>

              {/* Key Dates / Important Info */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Important Information</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                {(() => {
                  const infoRows = getSection('overview').infoRows;
                  if (infoRows && infoRows.length > 0) {
                    return (
                      <div className="info-table">
                        {infoRows.map((row, i) => (
                          <div className="info-row" key={i}>
                            <span className="info-label">{row.label}</span>
                            <span className="info-value">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div className="info-table">
                      <div className="info-row">
                        <span className="info-label">Academic Year</span>
                        <span className="info-value">{getAcademicYearFull()}</span>
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
                        <span className="info-value">+91-94233 42843 | satarapolyinfo@gmail.com</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Admission Routes */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Admission Routes</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#f0f4f8', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px' }}>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#2a5a8a', margin: '0 0 10px' }}>Central Admission Process (CAP)</h4>
                    <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                      Admission through online CAP rounds conducted by DTE Maharashtra. Students must
                      register on the DTE portal, fill preference forms, and confirm admission at the
                      institute after seat allocation. All categories (Open, SC, ST, OBC, VJNT, EWS)
                      are covered under this process.
                    </p>
                  </div>
                  <div style={{ background: '#f0f4f8', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px' }}>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#2a5a8a', margin: '0 0 10px' }}>Institute Level / Management</h4>
                    <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                      Vacant seats after CAP rounds are filled under Institute Level / Management quota.
                      Interested candidates can contact the institute directly for availability and
                      admission procedure. Merit-based selection is followed.
                    </p>
                  </div>
                </div>
              </div>
              {renderNote(getSection('overview'))}
            </>
          )}

          {/* Courses - Static Professional Layout */}
          {active === 'courses' && (
            <>
              <h2 className="content-heading">Courses Offered</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara offers six full-time diploma programmes in
                various branches of engineering and technology. All programmes are approved by
                AICTE, New Delhi and affiliated to MSBTE, Mumbai. The courses are designed to
                provide a strong foundation in engineering principles along with hands-on practical
                training to prepare students for successful careers in the industry.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">06</span>
                  <span className="stat-txt">Diploma Programs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">360</span>
                  <span className="stat-txt">Total Intake</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">03</span>
                  <span className="stat-txt">Years Duration</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">06</span>
                  <span className="stat-txt">Semesters</span>
                </div>
              </div>



              {/* Course Table from Admin */}
              {getSection('courses').courseTable && getSection('courses').courseTable.length > 0 && (
                <div style={{ marginTop: '36px' }}>
                  <h3 className="content-sub-heading">Course Details</h3>
                  <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                  <div className="fee-table-wrap">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}>Sr.</th>
                          <th style={{ textAlign: 'left' }}>Course Name</th>
                          <th style={{ width: 70 }}>Duration</th>
                          <th style={{ width: 60 }}>Intake</th>
                          <th style={{ width: 90 }}>Direct 2nd Yr</th>
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
                </div>
              )}

              {/* Key Features */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Key Features</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Curriculum</span>
                    <span className="info-value">Prescribed by MSBTE, Mumbai — regularly updated to meet industry standards</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Approval</span>
                    <span className="info-value">AICTE, New Delhi — all programmes are nationally approved</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Direct Second Year</span>
                    <span className="info-value">Available in all 6 branches for eligible HSC / ITI candidates</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Practical Training</span>
                    <span className="info-value">Hands-on labs, workshops, industrial visits and project work</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Placement Support</span>
                    <span className="info-value">Campus recruitment drives by top companies across all branches</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Scholarships</span>
                    <span className="info-value">Government scholarships available for SC/ST/OBC/VJNT/Minority/EWS students</span>
                  </div>
                </div>
              </div>
              {renderNote(getSection('courses'))}
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
              {renderNote(getSection('eligibility'))}
            </>
          )}

          {/* Process - Static Professional Layout */}
          {active === 'process' && (
            <>
              <h2 className="content-heading">Admission Process</h2>
              <div className="content-line"></div>
              <p>
                Admission to diploma engineering programmes at Satara Polytechnic, Satara is
                conducted through the Central Admission Process (CAP) as per the guidelines of the
                Directorate of Technical Education (DTE), Maharashtra. The entire process is
                conducted online and is transparent, merit-based, and accessible to all eligible
                candidates across the state.
              </p>
              <p>
                The admission process involves online registration, document verification, preference
                filling, seat allocation through merit rounds, and final confirmation at the institute.
                Candidates are advised to keep all original documents ready and visit the institute for
                physical verification once a seat is allotted.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">04</span>
                  <span className="stat-txt">CAP Rounds</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">100%</span>
                  <span className="stat-txt">Online Process</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">03</span>
                  <span className="stat-txt">Document Verification</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">24/7</span>
                  <span className="stat-txt">Helpline Support</span>
                </div>
              </div>

              {renderSteps(getSection('process').steps)}

              {/* Important Notes */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Important Guidelines</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Registration</span>
                    <span className="info-value">Register on the DTE Maharashtra CAP portal using a valid email and mobile number. Keep login credentials safe for all rounds.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Document Verification</span>
                    <span className="info-value">Visit the nearest Facilitation Centre (FC) with original documents and attested photocopies for physical verification.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Preference Filling</span>
                    <span className="info-value">Fill institute and course preferences in order of priority. You may fill multiple choices across institutes and branches.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Seat Allotment</span>
                    <span className="info-value">Seats are allocated based on merit rank, preferences filled, and available seats. Check allotment on the CAP portal.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Confirm Admission</span>
                    <span className="info-value">Report to the allotted institute within the given timeline with fee receipt and all original documents for confirmation.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Cap Rounds</span>
                    <span className="info-value">Multiple CAP rounds are conducted. If not satisfied, candidates canfloat to the next round. Spot rounds may follow.</span>
                  </div>
                </div>
              </div>

              {renderSubSections(getSection('process').subSections)}
              {renderNote(getSection('process'))}
            </>
          )}

          {/* First Year - Static Professional Layout */}
          {active === 'first-year' && (
            <>
              <h2 className="content-heading">First Year Admission</h2>
              <div className="content-line"></div>
              <p>
                First year diploma admission at Satara Polytechnic, Satara is open to candidates
                who have passed the SSC (Class X) or equivalent examination conducted by a recognized
                board with Mathematics and Science as compulsory subjects. Admission is carried out
                through the Central Admission Process (CAP) conducted by DTE Maharashtra.
              </p>
              <p>
                Candidates belonging to various categories (Open, SC, ST, OBC, VJNT, SBC, EWS, and
                Minority) are eligible for reservation benefits as per the Government of Maharashtra
                norms. The institute also offers supernumerary seats for candidates from economically
                weaker sections and orphan candidates.
              </p>

              {/* Eligibility Quick Info */}
              <div className="info-table" style={{ marginTop: '20px' }}>
                <div className="info-row">
                  <span className="info-label">Eligibility</span>
                  <span className="info-value">SSC (Class X) or equivalent with Mathematics and Science</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Admission Mode</span>
                  <span className="info-value">Central Admission Process (CAP) by DTE Maharashtra</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Duration</span>
                  <span className="info-value">3 Years (6 Semesters)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Intake</span>
                  <span className="info-value">360 seats across 6 engineering branches</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Age Limit</span>
                  <span className="info-value">Minimum 15 years as on the date prescribed by DTE</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nationality</span>
                  <span className="info-value">Indian nationals domiciled in Maharashtra are eligible</span>
                </div>
              </div>

              {renderDocuments(getSection('first-year').documents)}

              {/* Fee Payment Info */}
              <div style={{ marginTop: '32px' }}>
                <h3 className="content-sub-heading">Fee Payment Guidelines</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Payment Mode</span>
                    <span className="info-value">Online payment through CAP portal or Demand Draft in favour of "Satara Polytechnic, Satara"</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fee Deadline</span>
                    <span className="info-value">Fees must be paid within the timeline specified in the CAP allotment letter</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Refund Policy</span>
                    <span className="info-value">Fee refund as per DTE norms if admission is cancelled before the prescribed date</span>
                  </div>
                </div>
              </div>

              {renderSubSections(getSection('first-year').subSections)}
              {renderNote(getSection('first-year'))}
            </>
          )}

          {/* Direct Second Year - Static Professional Layout */}
          {active === 'direct-second' && (
            <>
              <h2 className="content-heading">Direct Second Year Admission</h2>
              <div className="content-line"></div>
              <p>
                Direct second year admission at Satara Polytechnic, Satara allows eligible
                candidates to directly enter the second year (third semester) of the diploma programme.
                This pathway is available for candidates who have completed HSC (Science stream), or
                hold an ITI certificate or 12th Technical qualification as prescribed by DTE Maharashtra.
              </p>
              <p>
                This route saves one year of study and is ideal for students who wish to transition from
                science or technical backgrounds into diploma engineering. The admission is conducted
                through CAP rounds and also through Institute Level / Management quota for vacant seats.
              </p>

              {/* Eligibility Quick Info */}
              <div className="info-table" style={{ marginTop: '20px' }}>
                <div className="info-row">
                  <span className="info-label">Eligibility</span>
                  <span className="info-value">HSC (Science) / ITI / 12th Technical from a recognized board</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Admission Mode</span>
                  <span className="info-value">CAP Rounds + Institute Level / Management Quota</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Duration</span>
                  <span className="info-value">2 Years (4 Semesters) — direct entry into Second Year</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Branches Available</span>
                  <span className="info-value">All 6 engineering branches with separate intake</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lateral Entry</span>
                  <span className="info-value">Eligible candidates skip the first year and begin from Semester 3</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Required Subjects</span>
                  <span className="info-value">Physics, Chemistry, Mathematics in HSC or relevant ITI trade</span>
                </div>
              </div>

              {renderDocuments(getSection('direct-second').documents)}

              {/* Key Benefits */}
              <div style={{ marginTop: '32px' }}>
                <h3 className="content-sub-heading">Benefits of Direct Second Year</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Time Saving</span>
                    <span className="info-value">Complete diploma in 2 years instead of 3 years, entering directly into the second year</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Career Advantage</span>
                    <span className="info-value">Early entry into the workforce with a full diploma qualification</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Same Degree</span>
                    <span className="info-value">Receive the same diploma certificate as regular 3-year students</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Placement Eligibility</span>
                    <span className="info-value">Fully eligible for campus placements and recruitment drives</span>
                  </div>
                </div>
              </div>

              {renderSubSections(getSection('direct-second').subSections)}
              {renderNote(getSection('direct-second'))}
            </>
          )}

          {/* A-CAP - Static Professional Layout */}
          {active === 'acap' && (
            <>
              <h2 className="content-heading">A-CAP Admission</h2>
              <div className="content-line"></div>
              <p>
                The A-CAP (All India Admission Process) is conducted by the Central Government for
                admission to diploma programmes inpolytechnic institutes across India. This process
                is separate from the state CAP and is applicable for candidates from other states
                or those who wish to seek admission through the all-India quota.
              </p>
              <p>
                A-CAP seats are available in select institutes and branches. The counselling and seat
                allocation is managed through the official A-CAP portal. Candidates must register,
                fill preferences, and confirm admission as per the published schedule.
              </p>

              {/* Quick Info */}
              <div className="info-table" style={{ marginTop: '20px' }}>
                <div className="info-row">
                  <span className="info-label">Conducting Body</span>
                  <span className="info-value">Central Government — All India Council for Technical Education (AICTE)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Eligibility</span>
                  <span className="info-value">SSC (Class X) or equivalent from any recognized board in India</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Admission Mode</span>
                  <span className="info-value">Online counselling through the A-CAP portal</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Applicable Candidates</span>
                  <span className="info-value">Students from any state seeking admission in Maharashtra polytechnics</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Seat Availability</span>
                  <span className="info-value">Limited seats — varies by institute and branch</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Website</span>
                  <span className="info-value">Visit the official A-CAP portal for registration and schedule</span>
                </div>
              </div>

              {renderDocuments(getSection('acap').documents)}

              {/* Process Steps */}
              <div style={{ marginTop: '32px' }}>
                <h3 className="content-sub-heading">A-CAP Admission Steps</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Online Registration</h4>
                      <p>Register on the A-CAP portal using a valid email ID and mobile number. Complete the profile with personal and academic details.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Document Upload</h4>
                      <p>Upload scanned copies of required documents including SSC marksheet, caste certificate (if applicable), and photographs.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Choice Filling</h4>
                      <p>Fill institute and branch preferences in order of priority. Multiple choices can be filled across different institutes.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Seat Allotment & Confirmation</h4>
                      <p>Check allotment result on the portal. If allotted, confirm the seat by paying the admission fee and reporting to the institute.</p>
                    </div>
                  </div>
                </div>
              </div>

              {renderSubSections(getSection('acap').subSections)}
              {renderNote(getSection('acap'))}
            </>
          )}

          {/* Fees - Static Professional Layout */}
          {active === 'fees' && (
            <>
              <h2 className="content-heading">Fee Structure</h2>
              <div className="content-line"></div>
              <p>
                The fee structure for diploma programmes at Satara Polytechnic, Satara is approved
                by the Shikshan Shulka Samiti (Fees Regulating Authority), Government of Maharashtra.
                The fees mentioned below are as sanctioned for the current academic year and are subject
                to revision as per government directives.
              </p>
              <p>
                Fee concessions and waivers are available for students belonging to reserved categories
                (SC, ST, VJNT, SBC, EWS) as per the Government of Maharashtra norms. Scholarships are
                also available through various state and central government schemes.
              </p>

              {/* Fee Info */}
              <div className="info-table" style={{ marginTop: '20px' }}>
                <div className="info-row">
                  <span className="info-label">Fee Approval</span>
                  <span className="info-value">Approved by Shikshan Shulka Samiti, Government of Maharashtra</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Mode</span>
                  <span className="info-value">Online through CAP portal or Demand Draft at institute office</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fee Concession</span>
                  <span className="info-value">Available for SC/ST/VJNT/SBC/EWS candidates as per government norms</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Parent Income Limit</span>
                  <span className="info-value">Fee structure applicable for parent income up to ₹8,00,000/-</span>
                </div>
              </div>

              {/* Fee Structure PDF */}
              {(() => {
                const feePdfUrl = getSection('fees').feePdfUrl;
                if (feePdfUrl) {
                  return (
                    <div style={{ marginTop: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #e4e8ed', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#444', fontWeight: 600 }}>📄 Fee Structure</p>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={`/api/pdf-proxy?url=${encodeURIComponent(feePdfUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#2a5a8a', color: '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '6px', textDecoration: 'none' }}>
                          View PDF
                        </a>
                        <a href={`/api/pdf-proxy?url=${encodeURIComponent(feePdfUrl)}`} download style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#fff', color: '#2a5a8a', fontSize: '14px', fontWeight: 600, borderRadius: '6px', textDecoration: 'none', border: '1.5px solid #2a5a8a' }}>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {renderNote(getSection('fees'))}
            </>
          )}

          {/* Scholarships - Static Professional Layout */}
          {active === 'scholarships' && (
            <>
              <h2 className="content-heading">Scholarships</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara provides access to various government and private
                scholarship schemes for eligible students. These scholarships are designed to make
                quality technical education affordable and accessible to students from all economic
                backgrounds. Students from reserved categories, economically weaker sections, and
                meritorious backgrounds can avail these benefits.
              </p>
              <p>
                Scholarship applications are processed through the Government of Maharashtra's
                scholarship portal. Students are advised to apply within the prescribed deadline
                and ensure all required documents are uploaded correctly. The institute's scholarship
                cell assists students throughout the application process.
              </p>

              {/* Scholarship Info */}
              <div className="info-table" style={{ marginTop: '20px' }}>
                <div className="info-row">
                  <span className="info-label">Application Portal</span>
                  <span className="info-value">Government of Maharashtra Scholarship Portal (mahaDBT)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Eligible Categories</span>
                  <span className="info-value">SC, ST, VJNT, SBC, OBC, EBC, Minority, EWS and Meritorious students</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Documents Required</span>
                  <span className="info-value">Caste certificate, income certificate, Aadhaar, bank passbook, marksheet</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Application Deadline</span>
                  <span className="info-value">As announced by the scholarship authority — typically within 3 months of admission</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Assistance</span>
                  <span className="info-value">Institute scholarship cell provides guidance for application and document preparation</span>
                </div>
              </div>

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
              {renderNote(getSection('scholarships'))}
            </>
          )}

          {/* Brochure - Static Professional Layout */}
          {active === 'brochure' && (
            <>
              <h2 className="content-heading">College Brochure</h2>
              <div className="content-line"></div>
              <p>
                Download the official college brochure of Satara Polytechnic, Satara for
                comprehensive information about the institute. The brochure covers details about
                all six diploma engineering programmes, admission procedures, fee structure,
                campus infrastructure, laboratory facilities, library resources, placement records,
                scholarship opportunities, and campus life.
              </p>
              <p>
                The brochure is published annually and contains the latest information about the
                institute for the current academic year. Students and parents are encouraged to
                read the brochure carefully before applying for admission.
              </p>

              {getSection('brochure').pdfUrl ? (
                <div className="brochure-btn-row">
                  <a
                    href={`/api/pdf-proxy?url=${encodeURIComponent(getSection('brochure').pdfUrl)}`}
                    target="_blank"
                    className="brochure-btn brochure-btn-view"
                  >
                    View Brochure
                  </a>
                  <a
                    href={`/api/pdf-proxy?url=${encodeURIComponent(getSection('brochure').pdfUrl)}`}
                    download
                    className="brochure-btn brochure-btn-download"
                  >
                    Download Brochure
                  </a>
                </div>
              ) : (
                <p style={{ marginTop: '16px', color: '#888' }}>No brochure uploaded yet.</p>
              )}

              {/* Brochure Contents */}
              <div style={{ marginTop: '24px' }}>
                <h3 className="content-sub-heading">What's Inside the Brochure</h3>
                <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Institute Overview</span>
                    <span className="info-value">History, vision, mission, and achievements of the institute</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Programmes Offered</span>
                    <span className="info-value">Details of all 6 diploma engineering branches with intake capacity</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Admission Information</span>
                    <span className="info-value">Step-by-step admission process, eligibility, and important dates</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fee Structure</span>
                    <span className="info-value">Category-wise fee details for First Year and Direct Second Year</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Campus Facilities</span>
                    <span className="info-value">Labs, library, workshops, canteen, transport, and sports facilities</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Placement Records</span>
                    <span className="info-value">Year-wise placement statistics and top recruiting companies</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Scholarships</span>
                    <span className="info-value">Available scholarship schemes and application procedures</span>
                  </div>
                </div>
              </div>

              {renderSubSections(getSection('brochure').subSections)}
              {renderNote(getSection('brochure'))}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Admissions;
