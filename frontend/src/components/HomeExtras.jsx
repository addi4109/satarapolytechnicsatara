import { useEffect, useRef, useState } from 'react';
import './HomeExtras.css';

import API_URL from '../lib/api';

/* ------------------------------------------------------------
   Scroll-reveal hook
------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function Section({ eyebrow, title, accentWord, sub, children, className = '' }) {
  const ref = useReveal();
  return (
    <section className={`hs-section ${className}`} ref={ref}>
      <div className="hs-inner">
        <div className="hs-reveal">
          <div style={{ textAlign: 'center' }}>
            {eyebrow && <span className="hs-eyebrow">{eyebrow}</span>}
            <h2 className="hs-heading">
              {title} <span className="accent">{accentWord}</span>
            </h2>
            {sub ? <p className="hs-sub">{sub}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Inline SVG icon set (small, consistent stroke icons)
------------------------------------------------------------ */
const Icon = {
  cap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3.3 2 8.7 2 12 0v-5" />
      <path d="M22 10v6" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 13h20" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2" />
      <path d="M8 2h8" />
      <path d="M7 15h10" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5.5 5.5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r="1.5" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11" />
      <rect x="2" y="16" width="20" height="4" rx="1" />
      <circle cx="7" cy="20" r="1.6" />
      <circle cx="17" cy="20" r="1.6" />
      <path d="M4 11h16" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <path d="M6 2v2" />
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M6 22h12" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

/* ------------------------------------------------------------
   Static data — shown until admin adds real content
------------------------------------------------------------ */
const STATS = [
  { value: 41, suffix: '+', label: 'Years of Excellence', icon: Icon.award },
  { value: 2500, suffix: '+', label: 'Successful Alumni', icon: Icon.users },
  { value: 95, suffix: '%', label: 'Placement Rate', icon: Icon.briefcase },
  { value: 6, suffix: '', label: 'Engineering Branches', icon: Icon.cap },
];

const WHY_US = [
  {
    icon: Icon.award,
    color: 'c1',
    title: '40+ Years of Legacy',
    text: 'Established in 1983 under Satara Education Society, with four decades of shaping skilled diploma engineers.',
  },
  {
    icon: Icon.briefcase,
    color: 'c2',
    title: 'Excellent Placements',
    text: 'Dedicated Training & Placement Cell with a strong placement record and leading recruiters visiting every year.',
  },
  {
    icon: Icon.users,
    color: 'c3',
    title: 'Experienced Faculty',
    text: 'Highly qualified and dedicated faculty members committed to mentoring every student personally.',
  },
  {
    icon: Icon.flask,
    color: 'c4',
    title: 'Modern Laboratories',
    text: 'Well-equipped labs, workshops and smart classrooms that bridge theory with hands-on industry practice.',
  },
  {
    icon: Icon.heart,
    color: 'c5',
    title: 'Holistic Development',
    text: 'Sports, cultural events, technical competitions and clubs that build confidence beyond the classroom.',
  },
  {
    icon: Icon.shield,
    color: 'c6',
    title: 'Safe, Green Campus',
    text: 'A disciplined, ragging-free campus with bus facility, hygienic canteen and a supportive environment.',
  },
];

const FACILITIES = [
  { icon: Icon.book, color: 'f1', title: 'Digital Library', text: 'Rich collection of books, journals and e-resources with a spacious reading hall.' },
  { icon: Icon.flask, color: 'f2', title: 'Advanced Labs', text: 'Branch-wise laboratories with modern equipment for practical, hands-on learning.' },
  { icon: Icon.wifi, color: 'f3', title: 'Wi-Fi Campus', text: 'High-speed internet across the campus for learning anytime, anywhere.' },
  { icon: Icon.bus, color: 'f4', title: 'Bus Facility', text: 'Safe transportation on major routes across Satara city and nearby villages.' },
  { icon: Icon.cup, color: 'f5', title: 'Hygienic Canteen', text: 'Nutritious meals and snacks served at reasonable rates during college hours.' },
  { icon: Icon.monitor, color: 'f6', title: 'Smart Classrooms', text: 'Multimedia-enabled classrooms for interactive and engaging lectures.' },
  { icon: Icon.target, color: 'f1', title: 'Sports & Grounds', text: 'Well-maintained grounds and coaches for inter-collegiate and university sports.' },
  { icon: Icon.globe, color: 'f2', title: 'Industrial Visits', text: 'Regular industry exposure to bridge classroom learning with real-world practice.' },
];

const EVENTS = [
  {
    title: 'Annual Gathering',
    year: 'Cultural Fest',
    text: 'A grand celebration of talent with music, dance, drama and cultural performances by our students.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  },
  {
    title: 'Technical Symposium',
    year: 'Tech Fest',
    text: 'Paper presentations, project exhibitions, coding contests, robo-races and hands-on workshops.',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #22d3ee 100%)',
  },
  {
    title: 'Sports Meet',
    year: 'Annual',
    text: 'Inter-collegiate tournaments and annual sports events building fitness, teamwork and sportsmanship.',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #fb923c 100%)',
  },
];

const PRINCIPAL = {
  name: 'Dr. A. B. Patil',
  role: 'Principal, Satara Polytechnic, Satara',
  photo: '',
  text: 'At Satara Polytechnic, we believe every student carries a unique spark of potential. Our mission is to nurture that spark through quality technical education, disciplined training and personal mentorship — so that every graduate leaves this campus not just with a diploma, but with the confidence, character and skills to build a remarkable career and serve society.',
};

/* ------------------------------------------------------------
   Animated counter
------------------------------------------------------------ */
function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stat-number">
      {display.toLocaleString('en-IN')}
      {suffix ? <span className="plus">{suffix}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------
   Main component
------------------------------------------------------------ */
function HomeExtras() {
  const [welcome, setWelcome] = useState(null);
  const revealRef = useReveal();

  // Live welcome content from admin panel (replaces static text when available)
  useEffect(() => {
    fetch(`${API_URL}/settings/home_welcome`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.value) setWelcome(String(d.value));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ===== 1. STATS STRIP ===== */}
      <section className="stats-strip">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <Counter value={s.value} suffix={s.suffix} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 2. WHY CHOOSE US ===== */}
      <section className="hs-section why-section">
        <div className="hs-inner">
          <div className="hs-reveal" ref={revealRef}>
            <div style={{ textAlign: 'center' }}>
              <span className="hs-eyebrow">About SPS</span>
              <h2 className="hs-heading">
                Why Students <span className="accent">Choose Us</span>
              </h2>
              <p className="hs-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {welcome
                  ? welcome.slice(0, 320)
                  : 'With a legacy of over four decades, SPS Satara is one of the best diploma engineering colleges in Satara — with a meritorious track record in academics, placements and holistic growth.'}
              </p>
            </div>
            <div className="why-grid">
              {WHY_US.map((w) => (
                <div className="why-card" key={w.title}>
                  <div className={`why-icon ${w.color}`}>{w.icon}</div>
                  <h3 className="why-title">{w.title}</h3>
                  <p className="why-text">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. FACILITIES ===== */}
      <Section
        className="fac-section"
        eyebrow="Campus Life"
        title="World-Class"
        accentWord="Facilities"
        sub="Everything a student needs to learn, grow and thrive — all within a safe and vibrant campus."
      >
        <div className="fac-grid">
          {FACILITIES.map((f) => (
            <div className="fac-card" key={f.title}>
              <div className={`fac-icon ${f.color}`}>{f.icon}</div>
              <h3 className="fac-title">{f.title}</h3>
              <p className="fac-text">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 4. EVENTS ===== */}
      <Section
        className="events-section"
        eyebrow="Campus Buzz"
        title="Life Beyond"
        accentWord="Classrooms"
        sub="From cultural extravaganzas to technical symposiums — there is always something happening at SPS."
      >
        <div className="events-grid">
          {EVENTS.map((ev) => (
            <div className="event-card" key={ev.title}>
              <div className="event-banner" style={{ background: ev.gradient }}>
                <h3 className="event-title">{ev.title}</h3>
                <span className="event-year">{ev.year}</span>
              </div>
              <div className="event-body">
                <p className="event-text">{ev.text}</p>
                <a className="event-link" href="/activities">
                  Explore Activities {Icon.arrow}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 5. PRINCIPAL'S MESSAGE ===== */}
      <Section
        className="principal-section"
        eyebrow="Leadership"
        title="From the"
        accentWord="Principal's Desk"
        sub=""
      >
        <div className="principal-card">
          <div className="principal-photo-wrap">
            {PRINCIPAL.photo ? (
              <img className="principal-photo" src={PRINCIPAL.photo} alt={PRINCIPAL.name} />
            ) : (
              <div
                className="principal-photo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #243358, #4a7ab0)',
                }}
              >
                {PRINCIPAL.name.replace('Dr. ', '').charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="principal-quote-mark">&ldquo;</div>
            <p className="principal-text">{PRINCIPAL.text}</p>
            <p className="principal-name">{PRINCIPAL.name}</p>
            <p className="principal-role">{PRINCIPAL.role}</p>
          </div>
        </div>
      </Section>

      {/* ===== 6. CTA ===== */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2 className="cta-title">Admissions Open for 2026-27</h2>
          <p className="cta-text">
            Take the first step toward a rewarding engineering career. Join a legacy of achievers —
            world-class education, vibrant campus life and outstanding placements.
          </p>
          <div className="cta-actions">
            <a className="cta-btn primary" href="/admissions/apply">
              Apply Now {Icon.arrow}
            </a>
            <a className="cta-btn ghost" href="/admissions/overview">
              Admission Enquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeExtras;
