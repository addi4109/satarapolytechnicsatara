import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './FeedbackCarousel.css';

function FeedbackCarousel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'feedbacks'));
        const allData = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          });
        const homeFeedbacks = allData.filter((f) => f.showOnHome === true);
        setFeedbacks(homeFeedbacks);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const maxIndex = Math.max(0, feedbacks.length - 3);

  useEffect(() => {
    if (feedbacks.length <= 3) return;
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [feedbacks.length, maxIndex]);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (feedbacks.length > 3) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 4000);
    }
  }, [feedbacks.length, maxIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    resetAutoScroll();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    resetAutoScroll();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX);
  };

  const handleTouchEnd = (e) => {
    const diff = startX - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  const renderStars = (rating) => (
    <div className="fb-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`fb-star ${s <= rating ? 'on' : ''}`}>★</span>
      ))}
    </div>
  );

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="fb-section">
        <h2 className="fb-heading">What Our Students Say</h2>
        <div className="fb-loading">Loading feedbacks...</div>
      </div>
    );
  }

  if (feedbacks.length === 0) return null;

  const getVisibleCards = () => {
    const cards = [];
    const count = Math.min(3, feedbacks.length);
    for (let i = 0; i < count; i++) {
      const idx = (currentIndex + i) % feedbacks.length;
      cards.push({ ...feedbacks[idx], _key: `${currentIndex}-${i}` });
    }
    return cards;
  };

  return (
    <div className="fb-section">
      <div className="fb-header">
        <span className="fb-badge">TESTIMONIALS</span>
        <h2 className="fb-heading">What Our Students Say</h2>
        <p className="fb-subheading">Hear from our students about their experience at Satara Polytechnic</p>
      </div>

      <div className="fb-carousel">
        {feedbacks.length > 3 && (
          <button className="fb-arrow fb-arrow-l" onClick={goToPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}

        <div
          className="fb-track"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="fb-grid">
            {getVisibleCards().map((fb) => (
              <div className="fb-card" key={fb._key}>
                <div className="fb-card-top">
                  <div className="fb-card-accent" />
                  <svg className="fb-quote-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {fb.rating ? renderStars(fb.rating) : renderStars(0)}

                <p className="fb-card-text">{fb.message}</p>

                <div className="fb-card-footer">
                  <div className="fb-avatar">
                    {(fb.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="fb-author">
                    <span className="fb-author-name">{fb.name}</span>
                    {fb.subject && <span className="fb-author-role">{fb.subject}</span>}
                  </div>
                  {fb.createdAt && <span className="fb-date">{formatDate(fb.createdAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {feedbacks.length > 3 && (
          <button className="fb-arrow fb-arrow-r" onClick={goToNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>

      {feedbacks.length > 3 && (
        <div className="fb-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`fb-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => { setCurrentIndex(idx); resetAutoScroll(); }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackCarousel;
