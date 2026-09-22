import './Facilities.css';

const FACILITIES = [
  {
    icon: '📚',
    title: 'Library',
    desc: '15,000+ books, journals, e-resources and a digital library with an automated barcode issuing system.',
    link: '/campus/library',
  },
  {
    icon: '🚌',
    title: 'Bus Facility',
    desc: 'Safe and convenient bus transport connecting Satara and nearby towns for students and staff.',
    link: '/campus/bus-facility',
  },
  {
    icon: '🍛',
    title: 'Canteen',
    desc: 'Hygienic, nutritious food and snacks served at affordable prices throughout the college day.',
    link: '/campus/canteen',
  },
  {
    icon: '🤝',
    title: 'Equal Opportunity Center',
    desc: 'Support, scholarships and mentoring so every student gets an equal chance to succeed.',
    link: '/campus/equal-opportunity-center',
  },
  {
    icon: '🔬',
    title: 'Center of Excellence',
    desc: 'Advanced labs and industry-aligned training that go beyond the regular diploma curriculum.',
    link: '/campus/center-of-excellence',
  },
  {
    icon: '🧪',
    title: 'Modern Laboratories',
    desc: 'Well-equipped departmental labs with modern instruments for hands-on practical learning.',
  },
  {
    icon: '🏏',
    title: 'Sports & Playground',
    desc: 'Outdoor and indoor sports facilities that build fitness, teamwork and sportsmanship.',
  },
  {
    icon: '🏛️',
    title: 'Seminar Hall',
    desc: 'Spacious halls for guest lectures, seminars, workshops and cultural activities.',
  },
  {
    icon: '📶',
    title: 'Wi-Fi Campus',
    desc: 'High-speed internet connectivity available across the campus for students and faculty.',
  },
];

function Facilities() {
  return (
    <section className="facilities-section">
      <div className="facilities-inner">
        <h2 className="facilities-heading">Campus Facilities</h2>
        <div className="facilities-line"></div>

        <div className="facilities-grid">
          {FACILITIES.map((f) => (
            <div className="facility-card" key={f.title}>
              <div className="facility-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="facility-name">{f.title}</h3>
              <p className="facility-desc">{f.desc}</p>
              {f.link && (
                <a href={f.link} className="facility-link">
                  View Details <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Facilities;
