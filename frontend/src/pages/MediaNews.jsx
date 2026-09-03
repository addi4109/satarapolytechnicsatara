import { useState, useEffect, useCallback } from 'react';
import { SkeletonCards } from "../components/Skeleton";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Gallery.css';

import API_URL from '../lib/api';

function MediaNews() {
  const [newsItems, setNewsItems] = useState([]);
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
    Promise.all([
      fetch(`${API_URL}/news`).then((r) => r.json()),
      fetch(`${API_URL}/photos`).then((r) => r.json()),
    ])
      .then(([nData, pData]) => {
        setNewsItems(nData);
        setPhotos(pData);
      })
      .catch((err) => console.error('Failed to fetch media data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Media & News | Press Coverage & Highlights"
        description="Read latest news, press coverage, and media mentions of Satara Polytechnic's achievements, events, and activities from various publications."
        keywords="college news, press coverage, Satara Polytechnic news, media mentions, polytechnic press"
        url="/gallery/media"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Gallery', url: '/gallery/photos' },
          { name: 'Media News' },
        ])}
      />
      <PageBanner
        title="Media News"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            <a href="/gallery/media">Gallery</a>
            <span className="sep">|</span>
            Media News
          </>
        }
      />

      <div className="gallery-page-wrap">
        {/* News Section */}
        <h2 className="gallery-main-heading">Latest News</h2>
        <div className="gallery-main-line"></div>
        <p className="gallery-intro">
          News coverage and media mentions of Satara Polytechnic's achievements,
          events, and activities from various newspapers and publications.
        </p>

        {loading ? (
          <SkeletonCards count={6} />
        ) : newsItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No news available yet.</p>
        ) : (
          <>
            {/* News WITH image - 3 per row grid cards */}
            {newsItems.filter(item => item.image).length > 0 && (
              <div className="news-image-grid">
                {newsItems.filter(item => item.image).map((item) => (
                  <div className="news-image-card" key={item._id}>
                    <div className="news-image-card-img">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="news-image-card-body">
                      <div className="news-meta">
                        <span className="news-date">{item.date}</span>
                        {item.source && <span className="news-source">{item.source}</span>}
                      </div>
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-summary">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* News WITHOUT image - full width cards */}
            {newsItems.filter(item => !item.image).length > 0 && (
              <div className="news-list" style={{ marginTop: newsItems.filter(item => item.image).length > 0 ? '32px' : '0' }}>
                {newsItems.filter(item => !item.image).map((item) => (
                  <div className="news-card news-card-full" key={item._id}>
                    <div className="news-meta">
                      <span className="news-date">{item.date}</span>
                      {item.source && <span className="news-source">{item.source}</span>}
                    </div>
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-summary">{item.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Photo Coverage Section */}
        {photos.length > 0 && (
          <div className="media-photo-section">
            <h2 className="gallery-main-heading">Photo Coverage</h2>
            <div className="gallery-main-line"></div>
            <p className="gallery-intro">
              Visual highlights from campus events, activities, and facilities.
            </p>

            <div className="media-photo-grid">
              {photos.map((photo) => (
              <div className="media-photo-card" key={photo._id} onClick={() => photo.image && setLightbox(photo)} style={{ cursor: photo.image ? 'pointer' : 'default' }}>
                <div className="media-photo-img">
                  {photo.image ? (
                    <img src={photo.image} alt={photo.title} />
                  ) : (
                      <div style={{ width: '100%', height: '100%', background: '#DDD7CA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>📷</div>
                    )}
                  </div>
                  <p className="media-photo-desc">{photo.description || photo.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.image} alt={lightbox.title || ''} className="lightbox-img" />
            <div className="lightbox-info">
              <h3>{lightbox.title || ''}</h3>
              {lightbox.description && <p>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MediaNews;
