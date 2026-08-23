import { useState, useEffect } from 'react';
import './ImageSlider.css';

const API_URL = '/api';

function ImageSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/slides`)
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch((err) => console.error('Failed to fetch slides:', err));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="slider-section">
      <div className="slider-container">
        {slides.map((slide, idx) => (
          <div key={slide._id} className={`slider-slide ${idx === current ? 'active' : ''}`}>
            <a href={slide.link || '#'}>
              <img src={slide.image} alt={slide.title || `Slide ${idx + 1}`} />
            </a>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === current ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSlider;
