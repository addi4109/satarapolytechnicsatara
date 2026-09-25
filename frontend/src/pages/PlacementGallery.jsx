import { useState, useEffect, useCallback } from 'react';
import { SkeletonCards } from "../components/Skeleton";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Gallery.css';

import API_URL from '../lib/api';

function PlacementGallery() {
  const [photos, setPhotos] = useState([]);
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
    fetch(`${API_URL}/placement-gallery`)
      .then((res) => res.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to fetch placement gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Placement Gallery | Placement Moments & Achievements"
        description="Browse photos of placement drives, recruiters' visits, selection moments and training activities at Satara Polytechnic, Satara."
        keywords="placement gallery, placement photos, campus placement drives, recruiter visits, Satara Polytechnic placements"
        url="/placements/gallery"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Placements', url: '/placements/about' },
          { name: 'Placement Gallery' },
        ])}
      />
      <PageBanner
        title="Placement Gallery"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            <a href="/placements/about">Placements</a>
            <span className="sep">|</span>
            Placement Gallery
          </>
        }
      />

      <div className="gallery-page-wrap">
        <h2 className="gallery-main-heading">Placement Gallery</h2>
        <div className="gallery-main-line"></div>
        <p className="gallery-intro">
          Glimpses of our placement journey — recruitment drives, company visits,
          selection moments and training sessions that shape our students' careers.
        </p>

        {loading ? (
          <SkeletonCards count={8} />
        ) : photos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No photos available yet.</p>
        ) : (
          <div className="photo-grid">
            {photos.map((photo) => (
              <div
                className="photo-card"
                key={photo._id}
                onClick={() => photo.image && setLightbox(photo)}
                style={{ cursor: photo.image ? 'pointer' : 'default' }}
              >
                <div className="photo-thumb">
                  {photo.image ? (
                    <img src={photo.image} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="photo-placeholder">
                      <span className="photo-placeholder-icon">📷</span>
                      <span className="photo-placeholder-text">{photo.title}</span>
                    </div>
                  )}
                </div>
                <div className="photo-info">
                  <h4 className="photo-title">{photo.title}</h4>
                  {photo.description && <p className="photo-desc">{photo.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.image} alt={lightbox.title} className="lightbox-img" />
            <div className="lightbox-info">
              <h3>{lightbox.title}</h3>
              {lightbox.description && <p>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlacementGallery;
