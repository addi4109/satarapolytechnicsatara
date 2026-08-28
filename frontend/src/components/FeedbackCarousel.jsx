import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import './FeedbackCarousel.css';

function FeedbackCarousel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, 'feedbacks'),
          where('showOnHome', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFeedbacks(data);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        // Fallback: try fetching all feedbacks without showOnHome filter
        try {
          const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const data = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((f) => f.showOnHome);
          setFeedbacks(data);
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (feedbacks.length <= 1) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 4000);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [feedbacks.length]);

  // Reset auto-scroll when manually navigating
  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (feedbacks.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
      }, 4000);
    }
  }, [feedbacks.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    resetAutoScroll();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    resetAutoScroll();
  };

  // Mouse drag/swipe handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.pageX - carouselRef.current.offsetLeft;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    carouselRef.current.scrollLeft = 0;
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX);
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].pageX;
    const diff = startX - endX;
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
          <span key={star} className={`feedback-star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
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

  if (feedbacks.length === 0) {
    return null;
  }

  const currentFeedback = feedbacks[currentIndex];

  return (
    <div className="feedback-carousel-section">
      <h2 className="feedback-section-title">What Our Students Say</h2>

      <div className="feedback-carousel-wrapper">
        {/* Previous Arrow */}
        <button
          className="feedback-arrow feedback-arrow-left"
          onClick={goToPrev}
          aria-label="Previous feedback"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className={`feedback-carousel-content ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="feedback-card">
            <div className="feedback-card-quote">
              <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.15" width="40" height="40">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {currentFeedback.rating && renderStars(currentFeedback.rating)}

            <p className="feedback-card-message">"{currentFeedback.message}"</p>

            <div className="feedback-card-author">
              <div className="feedback-card-avatar">
                {(currentFeedback.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="feedback-card-info">
                <h4 className="feedback-card-name">{currentFeedback.name}</h4>
                {currentFeedback.subject && (
                  <p className="feedback-card-subject">{currentFeedback.subject}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Arrow */}
        <button
          className="feedback-arrow feedback-arrow-right"
          onClick={goToNext}
          aria-label="Next feedback"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      {feedbacks.length > 1 && (
        <div className="feedback-dots">
          {feedbacks.map((_, idx) => (
            <button
              key={idx}
              className={`feedback-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                resetAutoScroll();
              }}
              aria-label={`Go to feedback ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackCarousel;
