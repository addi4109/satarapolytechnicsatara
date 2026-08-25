import { useState, useEffect } from 'react';
import './Departments.css';

const API_URL = '/api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setDepartments(data.filter((d) => !d.hideFromHome && d.slug !== 'general-science'));
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
