import { useState, useEffect } from 'react';
import './Departments.css';

import API_URL from '../lib/api';

const WHY_DATA = [
  { id: 1, title: 'Quality Education', body: 'Industry-oriented curriculum with modern infrastructure and skilled faculty.', color: '#4a90d9', icon: '🎓' },
  { id: 2, title: 'Since 1983', body: 'Over 4 decades of excellence in technical education.', color: '#e8833a', icon: '📅' },
  { id: 3, title: 'Multiple Departments', body: 'Engineering streams in various disciplines to match your interests and career goals.', color: '#3ea85a', icon: '⚙️' },
  { id: 4, title: 'Modern Facilities', body: 'Well-equipped laboratories, workshops, library and smart classrooms.', color: '#e056a0', icon: '📚' },
  { id: 5, title: 'Student Support', body: 'Guidance, counseling and placement support for a better future.', color: '#7c5cbf', icon: '👥' },
  { id: 6, title: 'Placement Opportunities', body: 'Strong industry connections and training for promising career paths.', color: '#d9534a', icon: '🏃' },
  { id: 7, title: 'Skill Development', body: 'Practical learning, workshops and hands-on experience.', color: '#e8a838', icon: '💡' },
  { id: 8, title: 'Co-curricular & Extracurricular', body: 'Sports, cultural, technical and social activities for all-round growth.', color: '#4a90d9', icon: '🎯' },
  { id: 9, title: 'Holistic Growth', body: 'Building skills, confidence and values for a successful future.', color: '#3ea85a', icon: '🤝' },
  { id: 10, title: 'Approved & Affiliated', body: 'Approved by AICTE, New Delhi, DTE Maharashtra and Affiliated to MSBTE, Mumbai.', color: '#7c5cbf', icon: '🏛️' },
];

function WhyChooseUs() {
  const radius = 185;
  const center = 160;
  const angles = WHY_DATA.map((_, i) => (i * (360 / WHY_DATA.length) - 90));

  const getPos = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      top: `${center + radius * Math.cos(rad) - 10}px`,
      left: `${center + radius * Math.sin(rad) - 100}px`,
      transform: `rotate(${deg + 90}deg)`,
    };
  };

  const getDotLinePos = (deg) => {
    const rad = (deg * Math.PI) / 180;
    const dotR = 72;
    const lineEndR = 118;
    return {
      dotTop: `${center + dotR * Math.cos(rad) - 5}px`,
      dotLeft: `${center + dotR * Math.sin(rad) - 5}px`,
      lineTop: `${center + 72 * Math.cos(rad)}px`,
      lineLeft: `${center + 72 * Math.sin(rad)}px`,
      lineWidth: `${Math.sqrt(Math.pow(118 * Math.cos(rad) - 72 * Math.cos(rad), 2) + Math.pow(118 * Math.sin(rad) - 72 * Math.sin(rad), 2))}px`,
      lineTransform: `rotate(${deg}deg)`,
    };
  };

  return (
    <section className="why-section">
      <div className="why-inner">
        <h2 className="why-heading">Why Choose Satara Polytechnic, Satara?</h2>
        <div className="why-line"></div>

        {/* Desktop wheel */}
        <div className="why-wheel">
          {/* Center seal */}
          <div className="why-wheel-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10"
              alt="College Seal"
              className="why-wheel-seal-image"
            />
            <span className="why-wheel-center-text">SATARA POLYTECHNIC SATARA</span>
          </div>

          {WHY_DATA.map((item, i) => {
            const pos = getPos(angles[i]);
            const dot = getDotLinePos(angles[i]);
            return (
              <div
                key={item.id}
                className="why-card"
                style={{ top: pos.top, left: pos.left, transform: `rotate(${angles[i]}deg)` }}
              >
                <div className="why-card-dot" style={{ background: item.color, top: dot.dotTop, left: dot.dotLeft }} />
                <div
                  className="why-card-line"
                  style={{ background: item.color, top: dot.lineTop, left: dot.lineLeft, width: dot.lineWidth, transform: `rotate(${angles[i]}deg)` }}
                />
                <div className="why-card-icon" style={{ background: item.color }}>
                  {item.icon}
                </div>
                <h4 className="why-card-title">{item.title}</h4>
                <p className="why-card-body">{item.body}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile fallback */}
        <div className="why-cards-grid">
          {WHY_DATA.map((item) => (
            <div key={item.id} className="why-card-mobile">
              <div className="why-card-icon" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div>
                <h4 className="why-card-title">{item.title}</h4>
                <p className="why-card-body">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setDepartments(data.filter((d) => !d.hideFromHome && d.slug !== 'general-science' && !d.name.toLowerCase().includes('general science')));
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
            <div className="dept-card" key={dept.slug || idx}>
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

        <WhyChooseUs />
      </div>
    </section>
  );
}

export default Departments;
