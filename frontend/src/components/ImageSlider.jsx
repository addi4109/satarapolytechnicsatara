import { useState, useEffect, useRef, useCallback } from 'react';
import './ImageSlider.css';

import API_URL from '../lib/api';

function ImageSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const dragRef = useRef({ startX: 0, dragging: false });

  useEffect(() => {
    fetch(`${API_URL}/slides`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setSlides(data);
      })
      .catch((err) => console.error('Failed to fetch slides:', err));
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = (idx) => {
    setCurrent(idx);
    startTimer();
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  };

  /* ----- mouse drag ----- */
  const handleMouseDown = (e) => {
    dragRef.current = { startX: e.clientX, dragging: true };
    clearInterval(timerRef.current);
  };

  const handleMouseUp = (e) => {
    if (!dragRef.current.dragging) return;
    const diff = e.clientX - dragRef.current.startX;
    dragRef.current.dragging = false;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    } else {
      startTimer();
    }
  };

  /* ----- touch swipe ----- */
  const handleTouchStart = (e) => {
    dragRef.current = { startX: e.touches[0].clientX, dragging: true };
    clearInterval(timerRef.current);
  };

  const handleTouchEnd = (e) => {
    if (!dragRef.current.dragging) return;
    const diff = e.changedTouches[0].clientX - dragRef.current.startX;
    dragRef.current.dragging = false;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    } else {
      startTimer();
    }
  };

  if (slides.length === 0) {
    return (
      <div className="slider-section">
        <div className="slider-empty">No slider images added yet.</div>
      </div>
    );
  }

  return (
    <div className="slider-section">
      <div
        className="slider-container"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slider-track">
          {slides.map((slide, idx) => (
            <div
              key={slide._id}
              className={`slider-slide ${idx === current ? 'active' : ''}`}
            >
              <a
                href={slide.link || '#'}
                onClick={(e) => {
                  if (!slide.link) e.preventDefault();
                }}
              >
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide ${idx + 1}`}
                    draggable={false}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#1a2030',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: '14px',
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    No image
                  </div>
                )}
              </a>

              {(slide.title || slide.subtitle) && (
                <div className="slider-content">
                  <div className="slider-content-inner">
                    {slide.tag && <span className="slider-tag">{slide.tag}</span>}
                    {slide.title && (
                      <h2 className="slider-title">{slide.title}</h2>
                    )}
                    {slide.subtitle && (
                      <p className="slider-subtitle">{slide.subtitle}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {slides.length > 1 && (
          <>
            <button
              className="slider-arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
              </svg>
            </button>
            <button
              className="slider-arrow next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === current ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSlider;
