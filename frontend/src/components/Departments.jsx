import { useState, useEffect } from 'react';
import './Departments.css';

const API_URL = '/api';

// Static department data — shown immediately while API data loads
const STATIC_DEPARTMENTS = [
  {
    slug: 'computer-engineering',
    name: 'Computer Engineering',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    about: 'Learn programming, software development, networking, and database management with hands-on lab experience and industry-relevant curriculum.',
    intake: 60,
    directSecond: true,
  },
  {
    slug: 'electronics-telecommunication',
    name: 'Electronics & Telecommunication',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    about: 'Explore electronics circuits, communication systems, embedded systems, and IoT with modern laboratories and practical training.',
    intake: 60,
    directSecond: true,
  },
  {
    slug: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600&h=400&fit=crop',
    about: 'Master mechanical design, manufacturing processes, thermodynamics, and CAD/CAM with well-equipped workshops and labs.',
    intake: 60,
    directSecond: true,
  },
  {
    slug: 'chemical-engineering',
    name: 'Chemical Engineering',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
    about: 'Study chemical processes, petroleum refining, polymer technology, and environmental engineering with specialized chemical labs.',
    intake: 60,
    directSecond: true,
  },
  {
    slug: 'electrical-engineering',
    name: 'Electrical Engineering',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop',
    about: 'Learn power systems, electrical machines, control systems, and renewable energy with hands-on electrical lab training.',
    intake: 60,
    directSecond: true,
  },
  {
    slug: 'automobile-engineering',
    name: 'Automobile Engineering',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
    about: 'Explore automotive systems, engine technology, vehicle electronics, and EV technology with modern automobile workshops.',
    intake: 60,
    directSecond: true,
  },
];

function Departments() {
  const [departments, setDepartments] = useState(STATIC_DEPARTMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setDepartments(data);
        }
      })
      .catch((err) => console.error('Failed to fetch departments:', err))
      .finally(() => setLoading(false));
  }, []);

  if (departments.length === 0) return null;

  return (
    <section className="dept-section">
      <div className="dept-inner">
        <h2 className="dept-heading">Our Departments</h2>
        <div className="dept-line"></div>

        <div className="dept-grid">
          {departments.map((dept, idx) => (
            <div className="dept-card" key={dept.slug || idx} style={{ animationDelay: `${idx * 0.12}s` }}>
              <div className="dept-img-wrap">
                <img src={dept.image} alt={dept.name} />
              </div>
              <div className="dept-body">
                <h3 className="dept-name">{dept.name}</h3>
                <p className="dept-desc">
                  {dept.about
                    ? dept.about.length > 130
                      ? `${dept.about.substring(0, 130).trim()}...`
                      : dept.about
                    : 'Explore this department to learn more about its programmes, labs and faculty.'}
                </p>
                <div className="dept-meta">
                  <span>Intake: {dept.intake}</span>
                  {dept.directSecond && <span>Direct 2nd Year: Yes</span>}
                </div>
                <div className="dept-btns">
                  <a href="/admissions/apply" className="dept-btn primary">Apply Now</a>
                  <a href={`/departments/${dept.slug}`} className="dept-btn secondary">Learn More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Departments;
