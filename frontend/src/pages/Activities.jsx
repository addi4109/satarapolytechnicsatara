import { useState, useEffect, useCallback } from 'react';
import { SkeletonPage } from "../components/Skeleton";
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';
import './Gallery.css';

import API_URL from '../lib/api';

const routeMap = {
  sports: 'sports',
  cultural: 'cultural',
  technical: 'technical',
  'academic-events': 'academic-events',
};

const sidebarLinks = [
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'technical', label: 'Technical Events' },
  { id: 'academic-events', label: 'Academic Events & Activities' },
];

const staticContent = {
  sports: {
    title: 'Sports',
    description: 'The institute encourages students to participate in sports at inter-collegiate, university and state level. Annual sports events, qualified coaches and well-maintained grounds help students build fitness, team spirit and sportsmanship. Students have represented the college in cricket, volleyball, kabaddi, athletics and many other sports at various levels.',
  },
  cultural: {
    title: 'Cultural',
    description: 'Cultural activities give students a platform to showcase their talent in music, dance, drama and fine arts. Events are organised throughout the year, including the annual gathering and youth festival competitions. The college celebrates cultural diversity and encourages students to express their creativity through various performing and visual arts.',
  },
  technical: {
    title: 'Technical Events',
    description: 'Technical events such as paper presentations, project exhibitions, coding contests, robo-races and workshops help students apply classroom knowledge to real-world problems and sharpen their innovation skills. These events provide a competitive platform for students to demonstrate their technical abilities and learn from peers.',
  },
  'academic-events': {
    title: 'Academic Events & Activities',
    description: 'Academic events and activities including seminars, workshops, guest lectures, and technical talks are organised to supplement classroom teaching and provide exposure to industry trends and emerging technologies. These events bridge the gap between academic learning and industry requirements.',
  },
};

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

  const getSection = (key) => sections[key] || {};
  const staticInfo = staticContent[active] || {};

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
        title={`${staticInfo.title || active} | Activities`}
        description={`${staticInfo.title} at Satara Polytechnic, Satara.`}
        keywords={`Satara Polytechnic ${active}, college activities, polytechnic sports, cultural events, technical events`}
        url={`/activities/${page || 'sports'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Activities', url: '/activities' },
          { name: staticInfo.title || active },
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
          {/* Section with static heading + sub-sections from admin */}
          <h2 className="content-heading">{staticInfo.title}</h2>
          <div className="content-line"></div>
          <p>{staticInfo.description}</p>

          {/* Sub-sections from admin */}
          {getSection(active).subSections && getSection(active).subSections.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              {getSection(active).subSections.map((sub, i) => (
                <div key={i} style={{ marginBottom: '32px' }}>
                  <h3 className="content-sub-heading">{sub.title}</h3>
                  <div style={{ width: '35px', height: '2px', background: '#d4a54a', marginBottom: '16px', borderRadius: '2px' }}></div>
                  {sub.description && <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '16px' }}>{sub.description}</p>}
                  {sub.images && sub.images.length > 0 && (
                    <div className="photo-grid">
                      {sub.images.map((img, j) => (
                        <div className="photo-card" key={j} onClick={() => setLightbox(img)} style={{ cursor: 'pointer' }}>
                          <div className="photo-thumb">
                            <img src={img.url} alt={img.caption || `Image ${j + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          {img.caption && (
                            <div className="photo-info">
                              <h4 className="photo-title">{img.caption}</h4>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Fallback: if no sub-sections */}
          {(!getSection(active).subSections || getSection(active).subSections.length === 0) && (
            <p style={{ color: '#888', fontStyle: 'italic', marginTop: '20px' }}>Details will be updated soon.</p>
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
