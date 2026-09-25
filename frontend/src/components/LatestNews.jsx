import { useState, useEffect, useRef, useCallback } from 'react';
import './LatestNews.css';

import API_URL from '../lib/api';

const AUTO_SWIPE_MS = 4500;

function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);   // _id of expanded card
  const [lightbox, setLightbox] = useState(null);   // news item to show full image

  // Mobile carousel state
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
  const goNext = useCallback(() => setSlide((s) => (s + 1) % count), [count]);
  const goPrev = useCallback(() => setSlide((s) => (s - 1 + count) % count), [count]);

  // Auto-advance the mobile carousel; pauses on hover/touch and while the
  // lightbox is open or a card is expanded.
  useEffect(() => {
    if (count < 2 || paused || lightbox || expanded) return undefined;
    const t = setInterval(goNext, AUTO_SWIPE_MS);
    return () => clearInterval(t);
  }, [count, paused, lightbox, expanded, goNext]);

  // Wrap index if the news list shrinks.
  useEffect(() => {
    if (slide >= count) setSlide(0);
  }, [count, slide]);

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
      key={item._id}
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

        {/* Summary — collapsed by default */}
        <div className="news-card-summary-wrap">
          <p className="news-card-summary">{item.summary}</p>
        </div>

        {/* Expandable extra content (shows when expanded) */}
        {expanded === item._id && (
          <div className="news-card-extra">
            <p className="news-card-extra-text">
              {item.summary || 'No further details available.'}
            </p>
            {item.image && (
              <div className="news-card-full-img">
                <img src={item.image} alt={item.title} />
              </div>
            )}
          </div>
        )}

        {/* Footer with buttons */}
        <div className="news-card-footer">
          <button
            className="news-btn news-btn-readmore"
            onClick={() => toggleExpand(item._id)}
          >
            {expanded === item._id ? 'Show Less' : 'Read More'}
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
    if (item.image) setLightbox(item);
  };

  const closeLightbox = () => setLightbox(null);

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
          <>
            {/* Desktop / tablet: static grid (unchanged) */}
            <div className="latest-news-grid">
              {news.map((item) => renderCard(item, false))}
            </div>

            {/* Mobile: auto-swiping carousel with arrows + dots */}
            <div
              className="news-carousel"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <button className="news-carousel-arrow prev" onClick={goPrev} aria-label="Previous news">
                <svg viewBox="0 0 24 24"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
              </button>

              <div className="news-carousel-track-wrap">
                <div
                  className="news-carousel-track"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {news.map((item) => (
                    <div className="news-carousel-slide" key={item._id}>
                      {renderCard(item, true)}
                    </div>
                  ))}
                </div>
              </div>

              <button className="news-carousel-arrow next" onClick={goNext} aria-label="Next news">
                <svg viewBox="0 0 24 24"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
              </button>

              <div className="news-carousel-dots">
                {news.map((item, i) => (
                  <button
                    key={item._id}
                    className={`news-carousel-dot ${i === slide ? 'active' : ''}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to news ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
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
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="news-lightbox-img"
            />
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
