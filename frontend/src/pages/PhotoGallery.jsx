import { useState, useEffect, useCallback } from 'react';
import PageBanner from '../components/PageBanner';
import './Gallery.css';

const API_URL = '/api';

function PhotoGallery() {
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
    fetch(`${API_URL}/photos`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error('Failed to fetch photos:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageBanner
        title="Photo Gallery"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            <a href="/gallery/photos">Gallery</a>
            <span className="sep">|</span>
            Photo Gallery
          </>
        }
      />

      <div className="gallery-page-wrap">
        <h2 className="gallery-main-heading">Photo Gallery</h2>
        <div className="gallery-main-line"></div>
        <p className="gallery-intro">
          Explore our campus life through photographs — events, celebrations,
          infrastructure, and everyday moments that make our college vibrant.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>Loading photos...</p>
        ) : photos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No photos available yet.</p>
        ) : (
          <div className="photo-grid">
            {photos.map((photo) => (
              <div className="photo-card" key={photo._id} onClick={() => photo.image && setLightbox(photo)} style={{ cursor: photo.image ? 'pointer' : 'default' }}>
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
                  <span className="photo-category">{photo.category}</span>
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

export default PhotoGallery;
