import { useState, useEffect } from 'react';
import './ImageSlider.css';

const API_URL = '/api';

// Static fallback slides — shown immediately while API data loads
const STATIC_SLIDES = [
  {
    _id: 'static-1',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&h=500&fit=crop',
    title: 'Welcome to Satara Polytechnic',
    link: '/about/college',
  },
  {
    _id: 'static-2',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=1400&h=500&fit=crop',
    title: 'Admissions Open 2026-27',
    link: '/admissions/overview',
  },
  {
    _id: 'static-3',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&h=500&fit=crop',
    title: 'Excellence in Technical Education',
    link: '/academics/overview',
  },
  {
    _id: 'static-4',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&h=500&fit=crop',
    title: '6 Engineering Departments',
    link: '/departments/computer',
  },
  {
    _id: 'static-5',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&h=500&fit=crop',
    title: 'Campus Placements & Training',
    link: '/placements',
  },
];

function ImageSlider() {
  const [slides, setSlides] = useState(STATIC_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isUsingApi, setIsUsingApi] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/slides`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
          setIsUsingApi(true);
        }
      })
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
          <div
            key={slide._id || idx}
            className={`slider-slide ${idx === current ? 'active' : ''} ${!isUsingApi && idx < STATIC_SLIDES.length ? 'static-slide' : ''}`}
          >
            <a href={slide.link || '#'}>
              <img src={slide.image} alt={slide.title || `Slide ${idx + 1}`} />
              {slide.title && (
                <div className="slider-overlay">
                  <h2 className="slider-title">{slide.title}</h2>
                </div>
              )}
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
