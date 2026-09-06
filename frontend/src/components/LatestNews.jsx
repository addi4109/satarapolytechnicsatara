import { useState, useEffect } from 'react';
import './LatestNews.css';

import API_URL from '../lib/api';

function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);   // _id of expanded card
  const [lightbox, setLightbox] = useState(null);   // news item to show full image

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then((r) => r.json())
      .then((data) => setNews(data))
      .catch((err) => console.error('Failed to fetch news:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const openArticle = (item) => {
    if (item.image) setLightbox(item);
  };

  const closeLightbox = () => setLightbox(null);

  return (
    <section className="latest-news-section">
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
          <div className="latest-news-grid">
            {news.map((item) => (
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

                  {/* Fixed-height footer with buttons */}
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
            ))}
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
