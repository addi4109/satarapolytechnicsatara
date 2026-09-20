import { useState, useEffect } from 'react';
import { SkeletonPage } from "../components/Skeleton";
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './AboutCollege.css';

const routeMap = {
  'college': 'institute',
  'overview': 'institute',
  'institute': 'institute',
  'vision-mission': 'vision',
  'affiliation': 'affiliation',
  'principal': 'principal',
  'chairman': 'chairman',
  'secretary': 'secretary',
  'disclosure': 'disclosure',
  'founder': 'founder',
  'society': 'society',
  'policy': 'policy',
  'governing-body': 'governing-body',
  'local-governing-body': 'local-governing-body',
  'organisational-chart': 'organisational-chart',
  'code-of-conduct': 'code-of-conduct',
};

const sidebarLinks = [
  { id: 'society', label: 'Satara Education Society' },
  { id: 'institute', label: 'Institute' },
  { id: 'disclosure', label: 'Mandatory Disclosure' },
  { id: 'affiliation', label: 'Affiliation & Approval' },
  { id: 'policy', label: 'Institute Policy' },
  { id: 'founder', label: 'Founder' },
  { id: 'chairman', label: 'Chairman' },
  { id: 'secretary', label: 'Secretary' },
  { id: 'principal', label: 'Principal' },
  { id: 'governing-body', label: 'Governing Body' },
  { id: 'local-governing-body', label: 'Local Governing Body' },
  { id: 'organisational-chart', label: 'Organisational Chart' },
  { id: 'code-of-conduct', label: 'Code of Conduct' },
];

import API_URL from '../lib/api';

// Organisational chart — top-down levels of the institute hierarchy.
const ORG_CHART_LEVELS = [
  {
    label: 'Society',
    nodes: [
      { title: 'Satara Education Society, Satara', subtitle: 'Parent Managing Body', featured: true },
    ],
  },
  {
    label: 'Governance',
    nodes: [
      { title: 'Chairman', subtitle: 'Satara Education Society' },
      { title: 'Governing Body', subtitle: 'Policy & Strategic Direction' },
    ],
  },
  {
    label: 'Institute Head',
    nodes: [
      { title: 'Principal', subtitle: 'Head of the Institute', featured: true },
    ],
  },
  {
    label: 'Administration & Cells',
    nodes: [
      { title: 'Vice Principal', subtitle: 'Academic Coordination' },
      { title: 'Office Superintendent', subtitle: 'Office & Accounts' },
      { title: 'Examination Cell', subtitle: 'MSBTE Coordination' },
      { title: 'Training & Placement Cell', subtitle: 'Placements & Industry Liaison' },
    ],
  },
  {
    label: 'Departments',
    nodes: [
      { title: 'Computer Engg.', subtitle: 'Department' },
      { title: 'Electronics & Telecom', subtitle: 'Department' },
      { title: 'Mechanical Engg.', subtitle: 'Department' },
      { title: 'Electrical Engg.', subtitle: 'Department' },
      { title: 'Chemical Engg.', subtitle: 'Department' },
      { title: 'Automobile Engg.', subtitle: 'Department' },
    ],
  },
  {
    label: 'Staff',
    nodes: [
      { title: 'Teaching Staff', subtitle: 'Lecturers' },
      { title: 'Non-Teaching Staff', subtitle: 'Lab Assistants' },
      { title: 'Support Staff', subtitle: 'Office & Maintenance' },
    ],
  },
];

// Code of conduct — intro and sections.
const CONDUCT_INTRO =
  'Satara Polytechnic, Satara is committed to maintaining the highest standards of professional ethics, discipline and mutual respect. The Code of Conduct given below applies to every member of the institute — students, faculty members and support staff — and is intended to create a safe, inclusive and academically productive environment.';

const CONDUCT_SECTIONS = [
  {
    title: 'For Students',
    items: [
      'Attend all lectures, practicals and examinations regularly; a minimum of 75% attendance is expected as per MSBTE norms.',
      'Wear the prescribed identity card on campus and decent, respectful attire in the institute premises.',
      'Maintain discipline in classrooms, laboratories, library and canteen; use institute property with care.',
      'Use mobile phones responsibly and only where permitted; they must be switched off in classrooms and examination halls.',
      'Refrain from any act of ragging, violence, substance abuse or harassment in any form — such acts invite strict disciplinary and legal action.',
      'Submit original work; any form of copying or malpractice in examinations is punishable as per MSBTE and institute rules.',
      'Treat fellow students, faculty and staff with courtesy irrespective of caste, religion, gender or background.',
    ],
  },
  {
    title: 'For Faculty Members',
    items: [
      'Be punctual and complete the prescribed syllabus within the academic schedule with quality teaching-learning practice.',
      'Prepare lesson plans, notes and assessments regularly and provide timely feedback to students.',
      'Maintain respectful, unbiased behaviour towards every student and colleague.',
      'Keep academic and personal records of students confidential and use them only for official purposes.',
      'Avoid any kind of discrimination, favouritism or victimisation of students.',
      'Participate in departmental, institute-level activities and faculty development programmes for continuous improvement.',
    ],
  },
  {
    title: 'For Non-Teaching & Administrative Staff',
    items: [
      'Discharge duties diligently, courteously and within the working hours of the institute.',
      'Handle student documents, fees and records accurately and maintain confidentiality.',
      'Keep the office, laboratories and campus clean, safe and well organised.',
      'Extend timely support to students and visitors and escalate genuine grievances to the competent authority.',
      'Refrain from any act of negligence that may affect the functioning of the institute.',
    ],
  },
  {
    title: 'Anti-Ragging & Grievance Redressal',
    items: [
      'Ragging in any form is strictly prohibited as per UGC/AICTE regulations and the Maharashtra Prohibition of Ragging Act, 1999.',
      'Complaints can be reported to the Anti-Ragging Committee / Grievance Redressal Committee through the complaint boxes or the office.',
      'All complaints are investigated confidentially and suitable action is taken within a reasonable time.',
      'Retaliation against any complainant or witness is treated as a serious offence.',
    ],
  },
  {
    title: 'General Conduct on Campus',
    items: [
      'Preserve the cleanliness of the campus; use dustbins and avoid defacing walls and property.',
      'Park vehicles only at designated places and follow campus safety rules.',
      'Any visitor on campus must report at the office and obtain permission before meeting students or staff.',
      'Matters not covered in this code will be decided by the Principal, whose decision shall be final and binding.',
    ],
  },
];

// Core values shown on the Institute overview.
const CORE_VALUES = [
  { name: 'Integrity & Ethics', desc: 'We uphold honesty, transparency and strong moral principles in every aspect of institute life.' },
  { name: 'Academic Excellence', desc: 'We strive for the highest standards in teaching, learning and student outcomes.' },
  { name: 'Discipline & Respect', desc: 'We nurture a disciplined, inclusive campus where every individual is treated with dignity.' },
  { name: 'Innovation', desc: 'We encourage creativity, curiosity and practical problem-solving among students and faculty.' },
  { name: 'Industry Readiness', desc: 'We align skills with industry needs through hands-on training, internships and placements.' },
  { name: 'Social Responsibility', desc: 'We instil awareness of community, environment and nation-building responsibilities.' },
];

// Fallback list of diploma programmes when the departments API has no data.
const FALLBACK_PROGRAMS = [
  { name: 'Computer Engineering' },
  { name: 'Electronics & Telecommunication Engineering' },
  { name: 'Mechanical Engineering' },
  { name: 'Electrical Engineering' },
  { name: 'Chemical Engineering' },
  { name: 'Automobile Engineering' },
];

function AboutCollege() {
  const { page } = useParams();
  const [active, setActive] = useState('overview');
  const [management, setManagement] = useState({});
  const [about, setAbout] = useState({});
  const [gbMembers, setGbMembers] = useState([]);
  const [lgbMembers, setLgbMembers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/management`).then((r) => r.json()),
      fetch(`${API_URL}/about`).then((r) => r.json()),
      fetch(`${API_URL}/governing-body`).then((r) => r.json()),
      fetch(`${API_URL}/local-governing-body`).then((r) => r.json()),
      fetch(`${API_URL}/departments`).then((r) => r.json()),
    ])
      .then(([mgmtData, aboutData, gbData, lgbData, deptData]) => {
        const mgmtMapped = {};
        mgmtData.forEach((entry) => { mgmtMapped[entry.role] = entry; });
        setManagement(mgmtMapped);

        const aboutMapped = {};
        aboutData.forEach((s) => { aboutMapped[s.section] = s; });
        setAbout(aboutMapped);

        setGbMembers(gbData);
        setLgbMembers(lgbData);
        setPrograms(Array.isArray(deptData) ? deptData.filter((d) => !d.hideFromHome) : []);
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

  // Helper: render leadership message (for founder, chairman, secretary, principal)
  const renderLeadership = (role) => {
    const entry = management[role];
    const title = role.charAt(0).toUpperCase() + role.slice(1);

    if (!entry) {
      return <p style={{ color: '#888' }}>No details available yet.</p>;
    }

    return (
      <div className="leader-profile">
        <div className="leader-profile-photo">
          {entry.photoUrl ? (
            <img src={entry.photoUrl} alt={entry.name} />
          ) : (
            <div className="leader-profile-photo-placeholder">
              <span>{entry.name ? entry.name.charAt(0) : '?'}</span>
            </div>
          )}
        </div>
        <h3 className="leader-profile-name">{entry.name}</h3>
        <p className="leader-profile-designation">{entry.title || title}</p>
        {entry.qualification && (
          <p className="leader-profile-qual">{entry.qualification}</p>
        )}
        <div className="leader-profile-msg">
          {entry.message ? (
            entry.message.split('\n').filter(p => p.trim()).map((para, i) => (
              <p key={i}>{para}</p>
            ))
          ) : (
            <p>No message available.</p>
          )}
        </div>
      </div>
    );
  };

  // Helper: render a single leadership photo card (name, role, description).
  const renderLeaderCard = (role) => {
    const entry = management[role];
    if (!entry || !entry.active) return null;
    return (
      <div key={role} className="leader-card">
        <div className="leader-card-img-wrap">
          {entry.photoUrl ? (
            <img className="leader-card-img" src={entry.photoUrl} alt={entry.name} />
          ) : (
            <div className="leader-card-img-placeholder">
              <span>{entry.name ? entry.name.charAt(0) : '?'}</span>
            </div>
          )}
        </div>
        <div className="leader-card-body">
          <h3 className="leader-card-name">{entry.name}</h3>
          <p className="leader-card-title">{entry.title || role.charAt(0).toUpperCase() + role.slice(1)}</p>
          {(entry.shortDesc || entry.qualification) && (
            <p className="leader-card-desc">{entry.shortDesc || entry.qualification}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <SEO title="About College | Satara Polytechnic" description="Learn about Satara Polytechnic, Satara - its history, vision, mission, and leadership." keywords="about Satara Polytechnic, college history" url="/about/college" />
        <SkeletonPage />
      </>
    );
  }

  const getSociety = () => about.society || {};
  const getInstitute = () => about.institute || {};
  const getDisclosure = () => about.disclosure || {};
  const getVision = () => about.vision || {};
  const getAffiliation = () => about.affiliation || {};
  const getPolicy = () => about.policy || {};
  const getPrograms = () => {
    if (Array.isArray(programs) && programs.length > 0) return programs;
    return FALLBACK_PROGRAMS;
  };
  // Admin-managed sections: fall back to the built-in defaults when empty.
  const getOrgLevels = () => {
    const db = about['organisational-chart'];
    if (db && Array.isArray(db.orgLevels) && db.orgLevels.length > 0) return db.orgLevels;
    return ORG_CHART_LEVELS;
  };
  const getConductSections = () => {
    const db = about['code-of-conduct'];
    const sections = db && Array.isArray(db.conductSections) ? db.conductSections.filter((s) => s && s.title && (s.items || []).length > 0) : [];
    if (sections.length > 0) return sections;
    return CONDUCT_SECTIONS;
  };

  const seoTitle = active === 'society' ? 'Satara Education Society' :
    active === 'institute' ? 'Institute Overview' :
    active === 'disclosure' ? 'Mandatory Disclosure' :
    active === 'vision' ? 'Vision & Mission' :
    active === 'affiliation' ? 'Affiliation & Approval' :
    active === 'policy' ? 'Institute Policy' :
    active === 'founder' ? 'Founder' :
    active === 'chairman' ? "Chairman's Message" :
    active === 'secretary' ? "Secretary's Message" :
    active === 'principal' ? "Principal's Message" :
    active === 'governing-body' ? 'Governing Body' :
    active === 'local-governing-body' ? 'Local Governing Body' :
    active === 'organisational-chart' ? 'Organisational Chart' :
    active === 'code-of-conduct' ? 'Code of Conduct' : 'About College';

  return (
    <>
      <SEO
        title={`${seoTitle} | Satara Polytechnic`}
        description={`Learn about ${seoTitle} at Satara Polytechnic, Satara. ${active === 'vision' ? 'Our vision to provide quality technical education and mission to produce skilled engineers.' : active === 'affiliation' ? 'Affiliated to MSBTE, Mumbai and approved by AICTE, New Delhi.' : 'A premier diploma engineering institute affiliated to MSBTE.'}`}
        keywords={`Satara Polytechnic, ${seoTitle}, Satara polytechnic about, MSBTE affiliated college, Satara education society`}
        url={`/about/${page || 'college'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about/college' },
          { name: seoTitle },
        ])}
      />
      <PageBanner
        title="About College"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            About College
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">About</h3>
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

          {/* Mobile top bar tabs */}
          <div className="about-mobile-tabs">
            {['society', 'institute', 'disclosure', 'affiliation', 'policy', 'organisational-chart', 'code-of-conduct'].includes(active) && (
              <>
                <h4 className="about-mobile-group-heading">About</h4>
                <ul className="about-mobile-tabs-list">
                  {sidebarLinks.filter((l) => ['society', 'institute', 'disclosure', 'affiliation', 'policy', 'organisational-chart', 'code-of-conduct'].includes(l.id)).map((link) => (
                    <li key={link.id}>
                      <button
                        className={`about-mobile-tab ${active === link.id ? 'active' : ''}`}
                        onClick={() => setActive(link.id)}
                      >
                        <span className="arrow">→</span>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {['founder', 'chairman', 'secretary', 'principal', 'governing-body', 'local-governing-body'].includes(active) && (
              <>
                <h4 className="about-mobile-group-heading">Management</h4>
                <ul className="about-mobile-tabs-list">
                  {sidebarLinks.filter((l) => ['founder', 'chairman', 'secretary', 'principal', 'governing-body', 'local-governing-body'].includes(l.id)).map((link) => (
                    <li key={link.id}>
                      <button
                        className={`about-mobile-tab ${active === link.id ? 'active' : ''}`}
                        onClick={() => setActive(link.id)}
                      >
                        <span className="arrow">→</span>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </aside>

        <main className="about-content">
          {/* Society */}
          {active === 'society' && (
            <>
              <h2 className="content-heading">{getSociety().title || 'Satara Education Society'}</h2>
              <div className="content-line"></div>
              {renderContent(getSociety().content || STATIC_CONTENT.about.society)}
            </>
          )}

          {/* Institute */}
          {active === 'institute' && (
            <>
              {/* Box 1: Campus image + About description */}
              <div className="about-box">
                <h2 className="about-box-title">{getInstitute().title || 'Institute Overview'}</h2>
                <div className="about-box-line"></div>
                <div className="about-intro">
                  <div className="about-intro-img">
                    <img
                      src="https://res.cloudinary.com/yjiggwb7/image/upload/v1787713256/mpj9o4ecbtz6t90t68vx.png"
                      alt="Satara Polytechnic, Satara Campus"
                      loading="lazy"
                    />
                  </div>
                  <div className="about-intro-text">
                    {renderContent(getInstitute().content || STATIC_CONTENT.about.institute)}
                  </div>
                </div>
              </div>

              {/* Box 2: Core Values */}
              <div className="about-box">
                <h2 className="about-box-title">Core Values</h2>
                <div className="about-box-line"></div>
                <div className="values-grid">
                  {CORE_VALUES.map((value, i) => (
                    <div className="value-item" key={i}>
                      <h3 className="value-name">{value.name}</h3>
                      <p className="value-desc">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Programs / Courses Offered */}
              <div className="about-box">
                <h2 className="about-box-title">Programs / Courses Offered</h2>
                <div className="about-box-line"></div>
                <div className="programs-table-wrap">
                  <table className="programs-table">
                    <thead>
                      <tr>
                        <th className="num-col">Sr. No.</th>
                        <th>Program / Course</th>
                        <th>Duration</th>
                        <th>Intake</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPrograms().map((program, i) => (
                        <tr key={program.slug || i}>
                          <td className="num-col">{i + 1}</td>
                          <td className="program-cell">{program.name}</td>
                          <td>3 Years</td>
                          <td>{program.intake ?? '—'}</td>
                          <td>
                            {program.slug ? (
                              <a className="program-link" href={`/departments/${program.slug}`}>
                                Learn More →
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box 4: Vision & Mission */}
              <div className="about-box">
                <h2 className="about-box-title">{getVision().title || 'Vision & Mission'}</h2>
                <div className="about-box-line"></div>
                <div className="about-intro-text">
                  {renderContent(getVision().content || STATIC_CONTENT.about.vision)}
                </div>
                {getVision().mission && getVision().mission.length > 0 && (
                  <div className="vm-block about-vm-block">
                    <h3 className="vm-title">Mission</h3>
                    <ul className="vm-list">
                      {getVision().mission.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {renderStats(getInstitute().stats)}

              {/* Leadership Photo Cards */}
              {Object.keys(management).length > 0 && (
                <div className="leadership-section">
                  <h2 className="leadership-heading">Our Leadership</h2>
                  <div className="leadership-line"></div>
                  <div className="leadership-grid">
                    {['founder', 'chairman', 'principal', 'secretary'].map((role) => renderLeaderCard(role))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Disclosure */}
          {active === 'disclosure' && (
            <>
              <h2 className="content-heading">{getDisclosure().title || 'Mandatory Disclosure'}</h2>
              <div className="content-line"></div>
              {renderContent(getDisclosure().content || STATIC_CONTENT.about.disclosure)}
              <div className="disclosure-info">
                {renderInfoRows(getDisclosure().infoRows)}
              </div>
            </>
          )}

          {/* Vision & Mission */}
          {active === 'vision' && (
            <>
              <h2 className="content-heading">{getVision().title || 'Vision & Mission'}</h2>
              <div className="content-line"></div>
              {renderContent(getVision().content || STATIC_CONTENT.about.vision)}
              {getVision().mission && getVision().mission.length > 0 && (
                <div className="vm-block">
                  <h3 className="vm-title">Mission</h3>
                  <ul className="vm-list">
                    {getVision().mission.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Affiliation */}
          {active === 'affiliation' && (
            <>
              <h2 className="content-heading">{getAffiliation().title || 'Affiliation & Approval'}</h2>
              <div className="content-line"></div>
              {renderContent(getAffiliation().content || STATIC_CONTENT.about.affiliation)}
              {renderInfoRows(getAffiliation().infoRows)}
            </>
          )}

          {/* Institute Policy */}
          {active === 'policy' && (
            <>
              <h2 className="content-heading">{getPolicy().title || 'Institute Policy'}</h2>
              <div className="content-line"></div>
              {renderContent(getPolicy().content || 'Institute policy details will be updated soon. Please check back later.')}
              {renderInfoRows(getPolicy().infoRows)}
            </>
          )}

          {/* Founder */}
          {active === 'founder' && (
            <>
              <h2 className="content-heading">Founder</h2>
              <div className="content-line"></div>
              {renderLeadership('founder')}
            </>
          )}

          {/* Chairman */}
          {active === 'chairman' && (
            <>
              <h2 className="content-heading">Chairman's Message</h2>
              <div className="content-line"></div>
              {renderLeadership('chairman')}
            </>
          )}

          {/* Secretary */}
          {active === 'secretary' && (
            <>
              <h2 className="content-heading">Secretary's Message</h2>
              <div className="content-line"></div>
              {renderLeadership('secretary')}
            </>
          )}

          {/* Principal */}
          {active === 'principal' && (
            <>
              <h2 className="content-heading">Principal's Message</h2>
              <div className="content-line"></div>
              {renderLeadership('principal')}
            </>
          )}

          {/* Governing Body */}
          {active === 'governing-body' && (
            <>
              <h2 className="content-heading">Governing Body</h2>
              <div className="content-line"></div>
              <p style={{ marginBottom: '24px', color: '#555', lineHeight: '1.7' }}>
                The Governing Body of Satara Polytechnic, Satara is responsible for the overall
                governance, policy-making, and strategic direction of the institute. The members
                bring diverse expertise and are committed to academic excellence and institutional growth.
              </p>

              {gbMembers.length === 0 ? (
                <p style={{ color: '#888' }}>No governing body members added yet.</p>
              ) : (
                <div className="staff-cards-grid">
                  {gbMembers.map((member) => (
                    <div key={member._id} className="staff-card">
                      {member.photoUrl ? (
                        <img
                          className="staff-card-photo"
                          src={member.photoUrl}
                          alt={member.name}
                        />
                      ) : (
                        <div className="staff-card-photo-placeholder">
                          No Photo
                        </div>
                      )}
                      <h3 className="staff-card-name">{member.name}</h3>
                      <p className="staff-card-designation">{member.designation}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Local Governing Body */}
          {active === 'local-governing-body' && (
            <>
              <h2 className="content-heading">Local Governing Body</h2>
              <div className="content-line"></div>
              <p style={{ marginBottom: '24px', color: '#555', lineHeight: '1.7' }}>
                The Local Governing Body of Satara Polytechnic, Satara provides local governance,
                community engagement, and support for the overall development of the institute.
                The members bring local expertise and are committed to strengthening the institute's
                connection with the community.
              </p>

              {lgbMembers.length === 0 ? (
                <p style={{ color: '#888' }}>No local governing body members added yet.</p>
              ) : (
                <div className="staff-cards-grid">
                  {lgbMembers.map((member) => (
                    <div key={member._id} className="staff-card">
                      {member.photoUrl ? (
                        <img
                          className="staff-card-photo"
                          src={member.photoUrl}
                          alt={member.name}
                        />
                      ) : (
                        <div className="staff-card-photo-placeholder">
                          No Photo
                        </div>
                      )}
                      <h3 className="staff-card-name">{member.name}</h3>
                      <p className="staff-card-designation">{member.designation}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* Organisational Chart */}
          {active === 'organisational-chart' && (
            <>
              <h2 className="content-heading">Organisational Chart</h2>
              <div className="content-line"></div>
              <p>
                The organisational structure of Satara Polytechnic, Satara defines the reporting
                relationships and responsibilities at every level — from the management society to
                the teaching and support staff — ensuring smooth and efficient functioning of the institute.
              </p>
              <div className="org-chart">
                {getOrgLevels().map((level, i) => (
                  <div className="org-level" key={i}>
                    <span className="org-level-label">{level.label}</span>
                    <div className="org-level-nodes">
                      {level.nodes.map((node, j) => (
                        <div className={`org-node ${node.featured ? 'org-node-featured' : ''}`} key={j}>
                          <span className="org-node-title">{node.title}</span>
                          <span className="org-node-sub">{node.subtitle}</span>
                        </div>
                      ))}
                    </div>
                    {i < getOrgLevels().length - 1 && (
                      <span className="org-connector" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Code of Conduct */}
          {active === 'code-of-conduct' && (
            <>
              <h2 className="content-heading">Code of Conduct</h2>
              <div className="content-line"></div>
              <p>{about['code-of-conduct']?.content || CONDUCT_INTRO}</p>
              <div className="coc-grid">
                {getConductSections().map((section, i) => (
                  <div className="coc-card" key={i}>
                    <h3 className="coc-card-title">{section.title}</h3>
                    <ul className="coc-list">
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default AboutCollege;
