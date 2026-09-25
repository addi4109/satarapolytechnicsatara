import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../lib/api';
import './PlacementRecordBanner.css';

/* Line-style SVG icons (stroke uses currentColor), matching the
   Facilities section icon language. */
const SideIcons = {
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
};

const SIDE_CARDS = {
  left: [
    {
      icon: SideIcons.briefcase,
      title: 'Placement Assistance',
      desc: 'Dedicated T&P cell supporting every student until placement.',
    },
    {
      icon: SideIcons.target,
      title: 'Career Training',
      desc: 'Aptitude, soft skills and interview preparation sessions.',
    },
  ],
  right: [
    {
      icon: SideIcons.building,
      title: 'Top Recruiters',
      desc: 'Leading companies visit the campus every year.',
    },
    {
      icon: SideIcons.trophy,
      title: 'Rising Records',
      desc: 'Placement records grow stronger year after year.',
    },
  ],
};

function SideCard({ icon, title, desc }) {
  return (
    <div className="pr-side-card">
      <div className="pr-side-icon">{icon}</div>
      <h3 className="pr-side-title">{title}</h3>
      <p className="pr-side-desc">{desc}</p>
    </div>
  );
}

/**
 * Latest Placement Record banner (poster uploaded via Admin > Placements > Records).
 * Shown on the Home page; links to the Placement Records section.
 * Flanked by highlight cards on large screens.
 */
function PlacementRecordBanner() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'missing'
  const [banner, setBanner] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/placements-admin/records`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Section not found'))))
      .then((data) => {
        setBanner(data.recordBanner || '');
        setStatus('ready');
      })
      .catch(() => setStatus('missing'));
  }, []);

  // Section missing (deleted) or still loading — don't render anything.
  if (status !== 'ready') return null;

  return (
    <section className="pr-banner-section">
      <h2 className="pr-banner-heading">Latest Placement Record</h2>
      <div className="pr-banner-line"></div>

      <div className="pr-banner-row">
        <div className="pr-banner-side pr-banner-side-left">
          {SIDE_CARDS.left.map((c) => (
            <SideCard key={c.title} {...c} />
          ))}
        </div>

        <Link to="/placements/records" className="pr-banner-link" title="View Placement Records">
          {banner ? (
            <img src={banner} alt="Latest Placement Record" className="pr-banner-img" />
          ) : (
            <div className="pr-banner-placeholder">
              <span className="pr-banner-icon">🏆</span>
              <p className="pr-banner-title">Latest Placement Record</p>
              <span className="pr-banner-hint">Banner will be updated soon</span>
            </div>
          )}
        </Link>

        <div className="pr-banner-side pr-banner-side-right">
          {SIDE_CARDS.right.map((c) => (
            <SideCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlacementRecordBanner;
