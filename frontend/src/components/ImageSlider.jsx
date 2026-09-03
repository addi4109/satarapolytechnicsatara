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
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch((err) => console.error('Failed to fetch slides:', err));
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (slides.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 3500);
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

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, dragging: true };
    clearInterval(timerRef.current);
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.dragging) return;
    e.preventDefault();
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

  // Touch swipe handlers
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

  if (slides.length === 0) return null;

  return (
    <div className="slider-section">
      <div
        className="slider-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, idx) => (
          <div key={slide._id} className={`slider-slide ${idx === current ? 'active' : ''}`}>
            <a href={slide.link || '#'} onClick={(e) => e.preventDefault()}>
              <img src={slide.image} alt={slide.title || `Slide ${idx + 1}`} draggable={false} />
            </a>
            <div className="slider-text-overlay">
              {slide.title && <h2 className="slider-title">{slide.title}</h2>}
              {slide.subtitle && <p className="slider-subtitle">{slide.subtitle}</p>}
              {!slide.title && idx === 0 && (
                <>
                  <h2 className="slider-title">Satara Polytechnic, Satara</h2>
                  <p className="slider-subtitle">Excellence in Technical Education Since 1983</p>
                </>
              )}
              {!slide.title && idx === 1 && (
                <>
                  <h2 className="slider-title">Shape Your Future</h2>
                  <p className="slider-subtitle">6 Engineering Departments • 100% Placement Assistance</p>
                </>
              )}
              {!slide.title && idx === 2 && (
                <>
                  <h2 className="slider-title">Admissions Open 2025-26</h2>
                  <p className="slider-subtitle">Apply Now for Diploma Engineering Programs</p>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === current ? 'active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSlider;
