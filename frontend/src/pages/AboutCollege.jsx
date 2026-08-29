import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './AboutCollege.css';

const routeMap = {
  'college': 'overview',
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
};

const sidebarLinks = [
  { id: 'society', label: 'Satara Education Society' },
  { id: 'institute', label: 'Institute' },
  { id: 'disclosure', label: 'Mandatory Disclosure' },
  { id: 'vision', label: 'Vision & Mission' },
  { id: 'affiliation', label: 'Affiliation & Approval' },
  { id: 'policy', label: 'Institute Policy' },
  { id: 'founder', label: 'Founder' },
  { id: 'chairman', label: 'Chairman' },
  { id: 'secretary', label: 'Secretary' },
  { id: 'principal', label: 'Principal' },
  { id: 'governing-body', label: 'Governing Body' },
  { id: 'local-governing-body', label: 'Local Governing Body' },
];

const API_URL = '/api';

function AboutCollege() {
  const { page } = useParams();
  const [active, setActive] = useState('overview');
  const [management, setManagement] = useState({});
  const [about, setAbout] = useState({});
  const [gbMembers, setGbMembers] = useState([]);
  const [lgbMembers, setLgbMembers] = useState([]);
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
    ])
      .then(([mgmtData, aboutData, gbData, lgbData]) => {
        const mgmtMapped = {};
        mgmtData.forEach((entry) => { mgmtMapped[entry.role] = entry; });
        setManagement(mgmtMapped);

        const aboutMapped = {};
        aboutData.forEach((s) => { aboutMapped[s.section] = s; });
        setAbout(aboutMapped);

        setGbMembers(gbData);
        setLgbMembers(lgbData);
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
      <div className="officer-card">
        <div className="officer-left">
          {entry.photoUrl && (
            <div className="officer-photo">
              <img src={entry.photoUrl} alt={entry.name} />
            </div>
          )}
          <h4 className="officer-name">{entry.name}</h4>
          <p className="officer-designation">{entry.title || title}</p>
          {entry.qualification && (
            <p className="officer-qual">{entry.qualification}</p>
          )}
        </div>
        <div className="officer-msg">
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
    active === 'local-governing-body' ? 'Local Governing Body' : 'About College';

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
            {['society', 'institute', 'disclosure', 'vision', 'affiliation', 'policy'].includes(active) && (
              <>
                <h4 className="about-mobile-group-heading">About</h4>
                <ul className="about-mobile-tabs-list">
                  {sidebarLinks.filter((l) => ['society', 'institute', 'disclosure', 'vision', 'affiliation', 'policy'].includes(l.id)).map((link) => (
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
              <h2 className="content-heading">{getInstitute().title || 'Institute Overview'}</h2>
              <div className="content-line"></div>
              {renderContent(getInstitute().content || STATIC_CONTENT.about.institute)}
              {renderStats(getInstitute().stats)}

              {/* Leadership Photo Cards */}
              {Object.keys(management).length > 0 && (
                <div className="leadership-section">
                  <h2 className="leadership-heading">Our Leadership</h2>
                  <div className="leadership-line"></div>
                  {/* Row 1: 3 main leaders */}
                  <div className="leadership-grid leadership-grid-3">
                    {['founder', 'chairman', 'principal'].map((role) => {
                      const entry = management[role];
                      if (!entry || !entry.active) return null;
                      return (
                        <div key={role} className="leader-card">
                          <div className="leader-card-img-wrap">
                            {entry.photoUrl ? (
                              <img className="leader-card-img" src={entry.photoUrl} alt={entry.name} />
                            ) : (
                              <div className="leader-card-img-placeholder">No Photo</div>
                            )}
                          </div>
                          <div className="leader-card-body">
                            <h3 className="leader-card-name">{entry.name}</h3>
                            <p className="leader-card-title">{entry.title || role.charAt(0).toUpperCase() + role.slice(1)}</p>
                            <p className="leader-card-desc">{entry.shortDesc || entry.qualification || ''}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Row 2: Secretary + others centered */}
                  <div className="leadership-grid leadership-grid-4">
                    {['secretary'].map((role) => {
                      const entry = management[role];
                      if (!entry || !entry.active) return null;
                      return (
                        <div key={role} className="leader-card">
                          <div className="leader-card-img-wrap">
                            {entry.photoUrl ? (
                              <img className="leader-card-img" src={entry.photoUrl} alt={entry.name} />
                            ) : (
                              <div className="leader-card-img-placeholder">No Photo</div>
                            )}
                          </div>
                          <div className="leader-card-body">
                            <h3 className="leader-card-name">{entry.name}</h3>
                            <p className="leader-card-title">{entry.title || role.charAt(0).toUpperCase() + role.slice(1)}</p>
                            <p className="leader-card-desc">{entry.shortDesc || entry.qualification || ''}</p>
                          </div>
                        </div>
                      );
                    })}
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
        </main>
      </div>
    </>
  );
}

export default AboutCollege;
