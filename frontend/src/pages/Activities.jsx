import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { STATIC_CONTENT } from '../data/staticContent';
import './Academics.css';
import './Gallery.css';

const API_URL = '/api';

const routeMap = {
  sports: 'sports',
  cultural: 'cultural',
  technical: 'technical',
  'industrial-visits': 'industrial-visits',
  competitions: 'competitions',
  'academic-events': 'academic-events',
};

const sidebarLinks = [
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'technical', label: 'Technical Events' },
  { id: 'academic-events', label: 'Academic Events & Activities' },
  { id: 'industrial-visits', label: 'Industrial Visits' },
  { id: 'competitions', label: 'Competitions' },
];

function Activities() {
  const { page } = useParams();
  const [active, setActive] = useState('sports');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
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
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    fetch(`${API_URL}/activities`)
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

  const renderImages = (key) => {
    const images = getSection(key).images || [];
    if (images.length === 0) return null;
    return (
      <div className="photo-grid" style={{ marginTop: '24px' }}>
        {images.map((img, i) => (
          <div className="photo-card" key={i} onClick={() => setLightbox(img)} style={{ cursor: 'pointer' }}>
            <div className="photo-thumb">
              <img src={img.url} alt={img.caption || `Image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {img.caption && (
              <div className="photo-info">
                <h4 className="photo-title">{img.caption}</h4>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <SEO title="Activities | Satara Polytechnic" description="Student activities at Satara Polytechnic." keywords="college activities, sports, cultural events" url="/activities" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} | Activities`}
        description={`${active === 'sports' ? 'Sports activities and achievements at Satara Polytechnic.' : active === 'cultural' ? 'Cultural events and celebrations at Satara Polytechnic.' : active === 'technical' ? 'Technical events, workshops, and seminars at Satara Polytechnic.' : active === 'industrial-visits' ? 'Industrial visits for practical exposure at Satara Polytechnic.' : 'Competitions and contests organized at Satara Polytechnic.'}`}
        keywords={`Satara Polytechnic ${active}, college activities, polytechnic sports, cultural events, technical events, industrial visits`}
        url={`/activities/${page || 'sports'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Activities', url: '/activities' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
      <PageBanner
        title="Activities"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Activities
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Activities</h3>
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
          {/* Sports */}
          {active === 'sports' && (
            <>
              <h2 className="content-heading">{getSection('sports').title || 'Sports'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('sports').content || STATIC_CONTENT.activities.sports)}
              {renderStats(getSection('sports').stats)}
              {renderInfoRows(getSection('sports').infoRows)}
              {renderImages('sports')}
            </>
          )}

          {/* Cultural */}
          {active === 'cultural' && (
            <>
              <h2 className="content-heading">{getSection('cultural').title || 'Cultural'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('cultural').content || STATIC_CONTENT.activities.cultural)}
              {renderStats(getSection('cultural').stats)}
              {renderInfoRows(getSection('cultural').infoRows)}
              {renderImages('cultural')}
            </>
          )}

          {/* Technical Events */}
          {active === 'technical' && (
            <>
              <h2 className="content-heading">{getSection('technical').title || 'Technical Events'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('technical').content || STATIC_CONTENT.activities.technical)}
              {renderStats(getSection('technical').stats)}
              {renderInfoRows(getSection('technical').infoRows)}
              {renderImages('technical')}
            </>
          )}

          {/* Industrial Visits */}
          {active === 'industrial-visits' && (
            <>
              <h2 className="content-heading">{getSection('industrial-visits').title || 'Industrial Visits'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('industrial-visits').content || STATIC_CONTENT.activities['industrial-visits'])}
              {renderStats(getSection('industrial-visits').stats)}
              {renderInfoRows(getSection('industrial-visits').infoRows)}
              {renderImages('industrial-visits')}
            </>
          )}

          {/* Academic Events */}
          {active === 'academic-events' && (
            <>
              <h2 className="content-heading">{getSection('academic-events').title || 'Academic Events & Activities'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('academic-events').content)}
              {renderStats(getSection('academic-events').stats)}
              {renderInfoRows(getSection('academic-events').infoRows)}
              {renderImages('academic-events')}
            </>
          )}

          {/* Competitions */}
          {active === 'competitions' && (
            <>
              <h2 className="content-heading">{getSection('competitions').title || 'Competitions'}</h2>
              <div className="content-line"></div>
              {renderContent(getSection('competitions').content || STATIC_CONTENT.activities.competitions)}
              {renderStats(getSection('competitions').stats)}
              {renderInfoRows(getSection('competitions').infoRows)}
              {renderImages('competitions')}
            </>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.url} alt={lightbox.caption || 'Image'} className="lightbox-img" />
            {lightbox.caption && (
              <div className="lightbox-info">
                <h3>{lightbox.caption}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Activities;
