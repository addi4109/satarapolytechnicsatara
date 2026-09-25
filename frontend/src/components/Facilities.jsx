import './Facilities.css';

/* Line-style SVG icons (stroke uses currentColor) */
const Icons = {
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <circle cx="8.5" cy="20" r="1.4" />
      <circle cx="15.5" cy="20" r="1.4" />
    </svg>
  ),
  canteen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <path d="M6 2v2" />
      <path d="M10 2v2" />
      <path d="M14 2v2" />
    </svg>
  ),
  equal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  excellence: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2v7.5a2 2 0 0 1-.21.9L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14.21 10.4a2 2 0 0 1-.21-.9V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  seminar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </svg>
  ),
};

const FACILITIES = [
  {
    icon: Icons.library,
    title: 'Library',
    desc: '15,000+ books, journals, e-resources and a digital library with an automated barcode issuing system.',
    link: '/campus/library',
    tone: 'amber',
  },
  {
    icon: Icons.bus,
    title: 'Bus Facility',
    desc: 'Safe and convenient bus transport connecting Satara and nearby towns for students and staff.',
    link: '/campus/bus-facility',
    tone: 'blue',
  },
  {
    icon: Icons.canteen,
    title: 'Canteen',
    desc: 'Hygienic, nutritious food and snacks served at affordable prices throughout the college day.',
    link: '/campus/canteen',
    tone: 'orange',
  },
  {
    icon: Icons.equal,
    title: 'Equal Opportunity Center',
    desc: 'Support, scholarships and mentoring so every student gets an equal chance to succeed.',
    link: '/campus/equal-opportunity-center',
    tone: 'teal',
  },
  {
    icon: Icons.excellence,
    title: 'Center of Excellence',
    desc: 'Advanced labs and industry-aligned training that go beyond the regular diploma curriculum.',
    link: '/campus/center-of-excellence',
    tone: 'maroon',
  },
  {
    icon: Icons.lab,
    title: 'Modern Laboratories',
    desc: 'Well-equipped departmental labs with modern instruments for hands-on practical learning.',
    tone: 'violet',
  },
  {
    icon: Icons.sports,
    title: 'Sports & Playground',
    desc: 'Outdoor and indoor sports facilities that build fitness, teamwork and sportsmanship.',
    tone: 'green',
  },
  {
    icon: Icons.seminar,
    title: 'Seminar Hall',
    desc: 'Spacious halls for guest lectures, seminars, workshops and cultural activities.',
    tone: 'navy',
  },
  {
    icon: Icons.wifi,
    title: 'Wi-Fi Campus',
    desc: 'High-speed internet connectivity available across the campus for students and faculty.',
    tone: 'sky',
  },
];

/* Satellite positions on the chart ellipse (percent of the chart box).
   Evenly spaced starting at the top, going clockwise. */
const POSITIONS = [
  { x: 50, y: 9 },
  { x: 76.5, y: 18.5 },
  { x: 90, y: 43 },
  { x: 84, y: 70 },
  { x: 62, y: 85.5 },
  { x: 38, y: 85.5 },
  { x: 16, y: 70 },
  { x: 10, y: 43 },
  { x: 23.5, y: 18.5 },
];

function Facilities() {
  return (
    <section className="facilities-section" data-reveal="fade">
      <div className="facilities-inner">
        <h2 className="facilities-heading" data-reveal="down">Campus Facilities</h2>
        <div className="facilities-line" data-reveal="down" data-reveal-delay="100"></div>

        <div className="facilities-chart" data-reveal="fade">
          {/* Spokes connecting the hub to each facility circle */}
          <svg className="facilities-chart-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {POSITIONS.map((p, i) => (
              <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>

          {/* Hub circle */}
          <div className="facilities-center" data-reveal="zoom">
            <span className="facilities-center-sub">Explore Our</span>
            <span className="facilities-center-text">Campus Facilities</span>
          </div>

          {/* Facility circles arranged around the hub */}
          <div className="facilities-ring">
            {FACILITIES.map((f, i) => {
              const pos = POSITIONS[i];
              const tipAlign = pos.x < 25 ? 'tip-right-align' : pos.x > 75 ? 'tip-left-align' : '';
              const nodeClass = `facility-node tone-${f.tone} pos-${i + 1}`;
              const nodeBody = (
                <>
                  <span className="facility-node-icon">{f.icon}</span>
                  <span className="facility-node-name">{f.title}</span>
                  <span className={`facility-node-tip ${tipAlign}`}>
                    {f.desc}
                    {f.link && <span className="facility-node-more">Click to view details →</span>}
                  </span>
                </>
              );
              return f.link ? (
                <a key={f.title} href={f.link} className={nodeClass} data-reveal-child aria-label={f.title}>
                  {nodeBody}
                </a>
              ) : (
                <div key={f.title} className={nodeClass} data-reveal-child>
                  {nodeBody}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Facilities;
