import './HomeExtras.css';

/* ------------------------------------------------------------
   Small inline SVG icons (thin outline, single colour)
------------------------------------------------------------ */
const Icon = {
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
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

/* ------------------------------------------------------------
   Static content — kept in step with the site's existing pages
------------------------------------------------------------ */
const STATS = [
  { value: '1983', label: 'Established' },
  { value: '6', label: 'Engineering Branches' },
  { value: '43', label: 'Years of Service', suffix: '+' },
  { value: 'AICTE', label: 'Approved & MSBTE Affiliated' },
];

const WHY_US = [
  {
    title: 'Established Legacy',
    text: 'Founded in 1983 under Satara Education Society with the guidance of Hon. Shri K. S. Patil (Ex. MLA), the institute has over four decades of experience in technical education.',
  },
  {
    title: 'Experienced Faculty',
    text: 'Qualified and dedicated faculty members who mentor students closely through lectures, practicals and project guidance across all six branches.',
  },
  {
    title: 'Modern Laboratories',
    text: 'Well-equipped branch-wise laboratories and workshops that let students apply classroom concepts through regular hands-on practical sessions.',
  },
  {
    title: 'Placement Support',
    text: 'The Training & Placement Cell provides career guidance and soft-skill training, with reputed companies from manufacturing, IT and service sectors recruiting every year.',
  },
  {
    title: 'Activities & Events',
    text: 'Sports, annual gathering, technical events and industrial visits give students a platform to build confidence and team spirit beyond the classroom.',
  },
  {
    title: 'Student Facilities',
    text: 'Library with reading hall, bus facility on major routes, hygienic canteen and a disciplined campus environment that supports focused study.',
  },
];

const FACILITIES = [
  { icon: Icon.book, title: 'Library', text: 'Textbooks, reference books, journals and e-resources with a spacious reading hall.' },
  { icon: Icon.flask, title: 'Laboratories', text: 'Branch-wise labs with modern equipment for practical, hands-on learning.' },
  { icon: Icon.monitor, title: 'Computer Centre', text: 'Computing facilities with internet access for students and academic work.' },
  { icon: Icon.wifi, title: 'Internet', text: 'Internet connectivity available across the campus for academic use.' },
  { icon: Icon.bus, title: 'Bus Facility', text: 'Institute buses on major routes across Satara city and nearby villages.' },
  { icon: Icon.cup, title: 'Canteen', text: 'Clean, hygienic canteen serving breakfast, meals and snacks at reasonable rates.' },
  { icon: Icon.target, title: 'Sports Grounds', text: 'Well-maintained grounds with coaches for inter-collegiate and university sports.' },
  { icon: Icon.globe, title: 'Industrial Visits', text: 'Regular visits to industries for first-hand exposure to processes and practices.' },
];

const EVENTS = [
  {
    title: 'Annual Gathering',
    tag: 'Cultural',
    text: 'Music, dance, drama and fine arts events organised through the year, including the annual social gathering and youth festival competitions.',
  },
  {
    title: 'Technical Events',
    tag: 'Technical',
    text: 'Paper presentations, project exhibitions, coding contests, robo-races and workshops that sharpen innovation and problem-solving skills.',
  },
  {
    title: 'Sports Events',
    tag: 'Sports',
    text: 'Annual sports events with qualified coaches and well-maintained grounds, with participation at inter-collegiate, university and state level.',
  },
];

const PRINCIPAL = {
  name: 'Dr. K. R. Patil',
  role: 'Principal, Satara Polytechnic, Satara',
  photo: '',
  text: 'Our aim is simple — every student who joins Satara Polytechnic should leave as a confident, skilled and disciplined diploma engineer. Along with classroom teaching, we focus on practical training, punctuality and personal attention, so that our graduates are ready for both higher education and employment. I welcome students and parents to visit our campus and see this for themselves.',
};

/* ------------------------------------------------------------
   Section header (kept consistent across the page)
------------------------------------------------------------ */
function SectionHead({ title, sub }) {
  return (
    <>
      <h2 className="hs-heading">{title}</h2>
      <div className="hs-line"></div>
      {sub ? <p className="hs-sub">{sub}</p> : null}
    </>
  );
}

function HomeExtras() {
  return (
    <>
      {/* ===== 1. QUICK FACTS ===== */}
      <section className="stats-strip">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-number">
                {s.value}
                {s.suffix ? <span className="plus">{s.suffix}</span> : null}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 2. WHY CHOOSE US ===== */}
      <section className="hs-section why-section">
        <div className="hs-inner">
          <SectionHead title="Why Choose Satara Polytechnic" />
          <div className="why-grid">
            {WHY_US.map((w) => (
              <div className="why-card" key={w.title}>
                <h3 className="why-title">{w.title}</h3>
                <p className="why-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. FACILITIES ===== */}
      <section className="hs-section fac-section">
        <div className="hs-inner">
          <SectionHead title="Campus Facilities" sub="Facilities available to students across the campus." />
          <div className="fac-grid">
            {FACILITIES.map((f) => (
              <div className="fac-card" key={f.title}>
                <div className="fac-icon">{f.icon}</div>
                <h3 className="fac-title">{f.title}</h3>
                <p className="fac-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. EVENTS ===== */}
      <section className="hs-section events-section">
        <div className="hs-inner">
          <SectionHead title="Student Activities" sub="Activities organised for students throughout the academic year." />
          <div className="events-grid">
            {EVENTS.map((ev) => (
              <div className="event-card" key={ev.title}>
                <div className="event-banner">
                  <h3 className="event-title">{ev.title}</h3>
                  <span className="event-year">{ev.tag}</span>
                </div>
                <div className="event-body">
                  <p className="event-text">{ev.text}</p>
                  <a className="event-link" href="/activities">View activities →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. PRINCIPAL'S MESSAGE ===== */}
      <section className="hs-section principal-section">
        <div className="hs-inner">
          <SectionHead title="Principal's Message" />
          <div className="principal-card">
            <div className="principal-photo-wrap">
              {PRINCIPAL.photo ? (
                <img className="principal-photo" src={PRINCIPAL.photo} alt={PRINCIPAL.name} />
              ) : (
                <div className="principal-initial">{PRINCIPAL.name.replace('Dr. ', '').charAt(0)}</div>
              )}
            </div>
            <div>
              <p className="principal-text">“{PRINCIPAL.text}”</p>
              <p className="principal-name">{PRINCIPAL.name}</p>
              <p className="principal-role">{PRINCIPAL.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. ADMISSIONS CALL-OUT ===== */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2 className="cta-title">Admissions Open 2025-26</h2>
          <p className="cta-text">
            Admission to all diploma programmes is conducted through the Central Admission Process (CAP) as per
            Directorate of Technical Education (DTE), Maharashtra rules.
          </p>
          <div className="cta-actions">
            <a className="cta-btn primary" href="/admissions/apply">Apply Now</a>
            <a className="cta-btn ghost" href="/admissions/overview">Admission Details</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeExtras;
