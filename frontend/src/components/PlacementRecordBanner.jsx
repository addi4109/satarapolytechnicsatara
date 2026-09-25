import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../lib/api';
import './PlacementRecordBanner.css';

/**
 * Latest Placement Record banner (poster uploaded via Admin > Placements > Records).
 * Shown on the Home page; links to the Placement Records section.
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
    <section className="pr-banner-section" data-reveal="fade">
      <h2 className="pr-banner-heading" data-reveal="down">Latest Placement Record</h2>
      <div className="pr-banner-line" data-reveal="down" data-reveal-delay="100"></div>

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
    </section>
  );
}

export default PlacementRecordBanner;
