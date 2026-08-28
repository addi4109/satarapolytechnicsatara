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
        const homeFeedbacks = allData.filter((f) => f.showOnHome);
        setFeedbacks(homeFeedbacks.length > 0 ? homeFeedbacks : allData);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const maxIndex = Math.max(0, feedbacks.length - 3);

  // Auto-scroll
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

  // Mouse drag
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

  // Touch swipe
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

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="feedback-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`feedback-star ${star <= rating ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="feedback-carousel-section">
        <h2 className="feedback-section-title">What Our Students Say</h2>
        <div className="feedback-loading">Loading feedbacks...</div>
      </div>
    );
  }

  if (feedbacks.length === 0) return null;

  // Get the 3 visible cards (with wrapping)
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % feedbacks.length;
      cards.push({ ...feedbacks[idx], _key: `${currentIndex}-${i}` });
    }
    return cards;
  };

  return (
    <div className="feedback-carousel-section">
      <h2 className="feedback-section-title">What Our Students Say</h2>

      <div className="feedback-carousel-wrapper">
        {/* Arrow Left */}
        {feedbacks.length > 3 && (
          <button className="feedback-arrow feedback-arrow-left" onClick={goToPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Cards Container */}
        <div
          className="feedback-carousel-content"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="feedback-cards-row">
            {getVisibleCards().map((fb, idx) => (
              <div className="feedback-card" key={fb._key}>
                <div className="feedback-card-quote">
                  <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.15" width="36" height="36">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                {fb.rating ? renderStars(fb.rating) : <div className="feedback-stars">{[1,2,3,4,5].map(s => <span key={s} className="feedback-star">★</span>)}</div>}
                <p className="feedback-card-message">"{fb.message}"</p>
                <div className="feedback-card-author">
                  <div className="feedback-card-avatar">
                    {(fb.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="feedback-card-info">
                    <h4 className="feedback-card-name">{fb.name}</h4>
                    {fb.subject && <p className="feedback-card-subject">{fb.subject}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Right */}
        {feedbacks.length > 3 && (
          <button className="feedback-arrow feedback-arrow-right" onClick={goToNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Dots */}
      {feedbacks.length > 3 && (
        <div className="feedback-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`feedback-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => { setCurrentIndex(idx); resetAutoScroll(); }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackCarousel;
