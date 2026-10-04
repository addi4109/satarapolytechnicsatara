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
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </svg>
  ),
};

/*
  Each card shows a photo on top. Drop the file into frontend/public/ and
  set its path below — until then the card falls back to a tinted
  placeholder with the facility's icon, so nothing looks broken.
*/
const FACILITIES = [
  {
    icon: Icons.library,
    title: 'Library',
    desc: '15,000+ books, journals, e-resources and a digital library with an automated barcode issuing system.',
    image: '/facilities/library.jpg',
    link: '/campus/library',
    tone: 'blue',
  },
  {
    icon: Icons.bus,
    title: 'Bus Facility',
    desc: 'Safe and convenient bus transport connecting Satara and nearby towns for students and staff.',
    image: '/facilities/bus.jpg',
    link: '/campus/bus-facility',
    tone: 'amber',
  },
  {
    icon: Icons.canteen,
    title: 'Canteen',
    desc: 'Hygienic, nutritious food and snacks served at affordable prices throughout the college day.',
    image: '/facilities/canteen.jpg',
    link: '/campus/canteen',
    tone: 'green',
  },
  {
    icon: Icons.equal,
    title: 'Equal Opportunity Center',
    desc: 'Support, scholarships and mentoring so every student gets an equal chance to succeed.',
    image: '/facilities/equal-opportunity.jpg',
    link: '/campus/equal-opportunity-center',
    tone: 'purple',
  },
  {
    icon: Icons.excellence,
    title: 'Center of Excellence',
    desc: 'Advanced labs and industry-aligned training that go beyond the regular diploma curriculum.',
    image: '/facilities/center-of-excellence.jpg',
    link: '/campus/center-of-excellence',
    tone: 'teal',
  },
  {
    icon: Icons.wifi,
    title: 'Wi-Fi Campus',
    desc: 'High-speed internet connectivity available across the campus for students and faculty.',
    image: '/facilities/wifi.jpg',
    link: '',
    tone: 'indigo',
  },
];

/* Hide a photo that hasn't been uploaded yet — the tinted placeholder stays. */
function hideMissingImage(event) {
  event.currentTarget.style.display = 'none';
}

function Facilities() {
  return (
    <section className="facilities-section" data-reveal="fade">
      <div className="facilities-inner">
        <p className="facilities-eyebrow" data-reveal="down">
          <span className="facilities-eyebrow-rule" aria-hidden="true"></span>
          Campus Facilities
          <span className="facilities-eyebrow-rule" aria-hidden="true"></span>
        </p>
        <h2 className="facilities-heading" data-reveal="down" data-reveal-delay="100">
          Facilities for a Better Learning Experience
        </h2>
        <p className="facilities-sub" data-reveal="down" data-reveal-delay="150">
          Modern infrastructure and essential amenities to support your academic journey
          <br className="facilities-sub-break" /> and overall well-being.
        </p>

        <div className="facilities-grid">
          {FACILITIES.map((f) => {
            const body = (
              <>
                <div className="facilities-media">
                  <span className="facilities-watermark" aria-hidden="true">{f.icon}</span>
                  {f.image && (
                    <img src={f.image} alt={f.title} loading="lazy" onError={hideMissingImage} />
                  )}
                </div>
                <div className="facilities-body">
                  <div className="facilities-card-head">
                    <span className={`facilities-icon tone-${f.tone}`}>{f.icon}</span>
                    <h3 className="facilities-card-title">{f.title}</h3>
                  </div>
                  <p className="facilities-card-desc">{f.desc}</p>
                </div>
              </>
            );
            return f.link ? (
              <a href={f.link} className="facilities-card" key={f.title} data-reveal-child aria-label={f.title}>
                {body}
              </a>
            ) : (
              <div className="facilities-card" key={f.title} data-reveal-child>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Facilities;
