import { useState, useEffect, useRef, useCallback } from 'react';
import './LatestNews.css';

import API_URL from '../lib/api';

const AUTO_SWIPE_MS = 4500;
const GAP_PX = 24;

// Article image zoom limits (lightbox)
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 1.5;
const CLICK_ZOOM = 2;
const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);   // _id of expanded card
  const [lightbox, setLightbox] = useState(null);   // news item to show full image

  // Zoom state for the lightbox article image
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);

  // Carousel state
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef({ x: 0, y: 0 });
  const swipeLock = useRef(false);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then((r) => r.json())
      .then((data) => setNews(data))
      .catch((err) => console.error('Failed to fetch news:', err))
      .finally(() => setLoading(false));
  }, []);

  const count = news.length;

  // Cards visible at once: 3 on desktop (one line), 2 on tablet, 1 on mobile.
  const [perView, setPerView] = useState(() => {
    if (typeof window === 'undefined') return 3;
    const w = window.innerWidth;
    return w <= 680 ? 1 : w <= 1024 ? 2 : 3;
  });

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w <= 680 ? 1 : w <= 1024 ? 2 : 3);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Highest reachable index (last page shows the final `perView` cards).
  const maxIndex = Math.max(0, count - perView);
  const hasCarousel = count > perView;

  // Clamp the index if the news list or the viewport shrinks.
  const index = Math.min(slide, maxIndex);

  const goNext = useCallback(
    () => setSlide((s) => (s >= maxIndex ? 0 : s + 1)),
    [maxIndex]
  );
  const goPrev = useCallback(
    () => setSlide((s) => (s <= 0 ? maxIndex : s - 1)),
    [maxIndex]
  );

  // Auto-scroll the carousel after a short delay; pauses while the cursor is
  // over it and while the lightbox is open or a card is expanded.
  useEffect(() => {
    if (!hasCarousel || paused || lightbox || expanded) return undefined;
    const t = setInterval(goNext, AUTO_SWIPE_MS);
    return () => clearInterval(t);
  }, [hasCarousel, paused, lightbox, expanded, goNext]);

  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipeLock.current = false;
  };

  const onTouchMove = (e) => {
    if (swipeLock.current) return;
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = e.touches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swipeLock.current = true;
      if (dx < 0) goNext(); else goPrev();
    }
  };

  const renderCard = (item) => (
    <article
      className={`news-card ${expanded === item._id ? 'news-card-expanded' : ''}`}
    >
      {/* Image */}
      <div className="news-card-img">
        {item.image ? (
          <img src={item.image} alt={item.title} />
        ) : (
          <div className="news-card-img-placeholder">
            <span>📰</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-date">{item.date}</span>
          {item.source && (
            <span className="news-card-source">{item.source}</span>
          )}
        </div>

        <h3 className="news-card-title">{item.title}</h3>

        {/* Summary — clamped when collapsed, full when expanded */}
        <div className="news-card-summary-wrap">
          <p className={`news-card-summary ${expanded === item._id ? 'expanded' : ''}`}>
            {item.summary}
          </p>
        </div>

        {/* Expanded shows the article image below the full text */}
        {expanded === item._id && item.image && (
          <div className="news-card-full-img">
            <img src={item.image} alt={item.title} />
          </div>
        )}

        {/* Footer with buttons */}
        <div className="news-card-footer">
          <button
            className="news-btn news-btn-readmore"
            onClick={() => toggleExpand(item._id)}
          >
            {expanded === item._id ? 'Read Less' : 'Read More'}
          </button>
          <button
            className="news-btn news-btn-article"
            onClick={() => openArticle(item)}
            disabled={!item.image}
          >
            Article
          </button>
        </div>
      </div>
    </article>
  );

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const openArticle = (item) => {
    if (item.image) {
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
      setLightbox(item);
    }
  };

  const closeLightbox = () => {
    setLightbox(null);
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const resetZoom = () => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  // Zoom by a factor, keeping the point under (clientX, clientY) still.
  const zoomAt = useCallback(
    (nextZoom, clientX, clientY) => {
      const img = imgRef.current;
      if (!img) return;
      const z = clampZoom(nextZoom);
      if (z === zoom) return;
      const rect = img.getBoundingClientRect();
      // Centre of the image in its untransformed position on screen.
      const ux = rect.left + rect.width / 2 - pan.x;
      const uy = rect.top + rect.height / 2 - pan.y;
      const dx = clientX - ux;
      const dy = clientY - uy;
      setPan({ x: pan.x + (zoom - z) * dx, y: pan.y + (zoom - z) * dy });
      setZoom(z);
    },
    [zoom, pan]
  );

  // Mouse wheel zooms the article image at the pointer position.
  useEffect(() => {
    const img = imgRef.current;
    if (!lightbox || !img) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      zoomAt(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
    };
    img.addEventListener('wheel', onWheel, { passive: false });
    return () => img.removeEventListener('wheel', onWheel);
  }, [lightbox, zoom, zoomAt]);

  // Click the article image: zoom in, click again (or drag-less click) to reset.
  const onImageClick = (e) => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    if (zoom > MIN_ZOOM) resetZoom();
    else zoomAt(CLICK_ZOOM, e.clientX, e.clientY);
  };

  // Drag to pan while zoomed in.
  const onImagePointerDown = (e) => {
    movedRef.current = false;
    if (zoom <= MIN_ZOOM) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    setDragging(true);
  };

  const onImagePointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    setPan({ x: d.px + dx, y: d.py + dy });
  };

  const onImagePointerUp = (e) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section className="latest-news-section" data-reveal="fade">
      <div className="latest-news-inner">
        <div className="latest-news-header">
          <span className="latest-news-badge">LATEST</span>
          <h2 className="latest-news-heading">Latest News</h2>
          <div className="latest-news-line" />
          <p className="latest-news-sub">
            Stay updated with the latest happenings, events, and achievements at Satara Polytechnic, Satara.
          </p>
        </div>

        {loading ? (
          <div className="latest-news-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="news-card-skeleton" key={i}>
                <div className="news-card-skel-img" />
                <div className="news-card-skel-line short" />
                <div className="news-card-skel-line" />
                <div className="news-card-skel-line short" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="latest-news-empty">
            <p>No news added yet.</p>
          </div>
        ) : (
          <div
            className="news-carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="news-carousel-viewport">
              {hasCarousel && (
                <button className="news-carousel-arrow prev" onClick={goPrev} aria-label="Previous news">
                  <svg viewBox="0 0 24 24"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                </button>
              )}

              <div className="news-carousel-track-wrap">
                <div
                  className="news-carousel-track"
                  style={{
                    transform: `translateX(calc(${index === 0 ? 0 : -index} * (100% + ${GAP_PX}px) / ${perView}))`,
                  }}
                >
                  {news.map((item) => (
                    <div
                      className="news-carousel-slide"
                      key={item._id}
                      style={{ width: `calc((100% - ${(perView - 1) * GAP_PX}px) / ${perView})` }}
                    >
                      {renderCard(item)}
                    </div>
                  ))}
                </div>
              </div>

              {hasCarousel && (
                <button className="news-carousel-arrow next" onClick={goNext} aria-label="Next news">
                  <svg viewBox="0 0 24 24"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
                </button>
              )}
            </div>

            {hasCarousel && (
              <div className="news-carousel-dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={`news-carousel-dot ${i === index ? 'active' : ''}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to news ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Article lightbox */}
      {lightbox && (
        <div className="news-lightbox-overlay" onClick={closeLightbox}>
          <div
            className="news-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="news-lightbox-close"
              onClick={closeLightbox}
            >
              ✕
            </button>
            <div className={`news-lightbox-img-wrap ${zoom > MIN_ZOOM ? 'zoomed' : ''}`}>
              <img
                ref={imgRef}
                src={lightbox.image}
                alt={lightbox.title}
                className={`news-lightbox-img ${dragging ? 'dragging' : ''}`}
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                onClick={onImageClick}
                onPointerDown={onImagePointerDown}
                onPointerMove={onImagePointerMove}
                onPointerUp={onImagePointerUp}
                onPointerCancel={onImagePointerUp}
                draggable={false}
              />

              <div className="news-lightbox-zoom-controls">
                <button
                  className="news-lightbox-zoom-btn"
                  onClick={() => setZoom((z) => clampZoom(z * ZOOM_STEP))}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  className="news-lightbox-zoom-btn"
                  onClick={() => setZoom((z) => clampZoom(z / ZOOM_STEP))}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <button
                  className="news-lightbox-zoom-btn reset"
                  onClick={resetZoom}
                  disabled={zoom === MIN_ZOOM}
                  aria-label="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
              </div>

              <span className="news-lightbox-zoom-hint">
                {zoom > MIN_ZOOM ? 'Drag to pan · click image to reset' : 'Click image or use + to zoom'}
              </span>
            </div>
            <div className="news-lightbox-info">
              <div className="news-lightbox-meta">
                <span className="news-card-date">{lightbox.date}</span>
                {lightbox.source && (
                  <span className="news-card-source">{lightbox.source}</span>
                )}
              </div>
              <h3>{lightbox.title}</h3>
              {lightbox.summary && (
                <p className="news-lightbox-summary">{lightbox.summary}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default LatestNews;
