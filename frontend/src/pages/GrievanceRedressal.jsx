import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import API_URL from '../lib/api';
import './Academics.css';
import './Contact.css';
import './GrievanceRedressal.css';

const GRIEVANCE_EMAIL = 'spsgrievance@gmail.com';
const OFFICE_PHONE = '+91-94233 42843';

// In-page navigation shown in the sidebar.
const sections = [
  { id: 'about', label: 'About the Cell' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'types', label: 'Grievances Handled' },
  { id: 'process', label: 'Redressal Process' },
  { id: 'committee', label: 'Committee' },
  { id: 'lodge', label: 'Lodge a Grievance' },
];

const objectives = [
  'Give students, parents and staff a safe platform to report grievances without fear of victimisation.',
  'Ensure every complaint is examined quickly, fairly and within a definite time limit.',
  'Resolve grievances related to academics, administration, infrastructure or harassment promptly.',
  'Keep the identity of the complainant confidential throughout the process.',
  'Create awareness about the grievance mechanism and the rights of students.',
  'Escalate unresolved matters to the Principal / competent authority.',
];

const grievanceTypes = [
  {
    title: 'Academic Matters',
    desc: 'Teaching, attendance, internal marks, laboratory sessions, timetable and project guidance.',
  },
  {
    title: 'Examination Matters',
    desc: 'Hall tickets, seating arrangements, result issues, revaluation and MSBTE formalities.',
  },
  {
    title: 'Fees, Scholarships & Concessions',
    desc: 'Fee receipts, refund requests, scholarship disbursement and documentation delays.',
  },
  {
    title: 'Infrastructure & Library',
    desc: 'Classrooms, laboratories, computers, drinking water, cleanliness, safety and library services.',
  },
  {
    title: 'Ragging, Harassment & Discrimination',
    desc: 'Any incident of ragging, eve-teasing, caste or gender discrimination — handled with utmost seriousness.',
  },
  {
    title: 'Hostel, Transport & Canteen',
    desc: 'Bus routes and timings, hostel facilities, mess and canteen related concerns.',
  },
];

const processSteps = [
  {
    title: 'Submit the grievance',
    desc: 'Write to spsgrievance@gmail.com, drop a written complaint in the grievance box near the office, or hand it over in person to the Grievance Redressal Cell. Mention your name, branch, year and contact details.',
  },
  {
    title: 'Acknowledgement',
    desc: 'The cell acknowledges the complaint and registers it in the grievance register within 3 working days.',
  },
  {
    title: 'Examination of the complaint',
    desc: 'The committee hears the complainant and the concerned person / department, and examines the facts and records.',
  },
  {
    title: 'Redressal',
    desc: 'Suitable action is taken and the complainant is informed of the outcome, ordinarily within 15 working days (21 working days for matters needing external consultation).',
  },
  {
    title: 'Appeal, if required',
    desc: 'If the complainant is not satisfied, an appeal can be made to the Principal within 15 days of the decision, who constitutes a review for final disposal.',
  },
];

const channels = [
  {
    title: 'Email',
    desc: 'Write to the cell directly. Mention your name, branch and year for a faster response.',
    link: `mailto:${GRIEVANCE_EMAIL}`,
    linkLabel: GRIEVANCE_EMAIL,
  },
  {
    title: 'Grievance Box',
    desc: 'Drop a written complaint in the grievance box kept near the college office. It is opened by the cell chairman.',
    link: '',
    linkLabel: '',
  },
  {
    title: 'Office',
    desc: `Visit the college office during working hours (Monday – Saturday, 10:30 AM – 5:00 PM) and meet the cell in person.`,
    link: `tel:${OFFICE_PHONE.replace(/[^0-9+]/g, '')}`,
    linkLabel: OFFICE_PHONE,
  },
];

const categories = [
  'Academic Matters',
  'Examination Matters',
  'Fees, Scholarships & Concessions',
  'Infrastructure, Labs & Library',
  'Ragging, Harassment & Discrimination',
  'Hostel, Transport & Canteen',
  'Other Institutional Matter',
];

function GrievanceRedressal() {
  const [active, setActive] = useState('about');
  const [cell, setCell] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: categories[0],
    message: '',
  });
  const [sent, setSent] = useState(false);

  // Committee members are managed from the admin panel (Cells & Committees).
  useEffect(() => {
    fetch(`${API_URL}/cells/grievance`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setCell(data))
      .catch(() => {});
  }, []);

  const goTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Opens the visitor's own mail app, pre-filled — no data is stored.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Grievance — ${form.category} — ${form.name}`;
    const body = [
      'Grievance Redressal Cell,',
      'Satara Polytechnic, Satara',
      '',
      `Name: ${form.name}`,
      `Email: ${form.email || '-'}`,
      `Phone: ${form.phone || '-'}`,
      `Category: ${form.category}`,
      '',
      'Details of the grievance:',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${GRIEVANCE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const members = cell?.members || [];

  return (
    <>
      <SEO
        title="Grievance Redressal | Satara Polytechnic"
        description="Grievance Redressal Cell of Satara Polytechnic, Satara — objectives, types of grievances handled, redressal process, committee members and a form to lodge a student grievance."
        keywords="grievance redressal cell, student grievance, complaint cell, Satara Polytechnic grievance, AICTE grievance redressal"
        url="/student/grievance-redressal"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Student Section' },
          { name: 'Grievance Redressal' },
        ])}
      />
      <PageBanner
        title="Grievance Redressal"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Student Section
            <span className="sep">|</span>
            Grievance Redressal
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Student Section</h3>
          <ul className="sidebar-list">
            {sections.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className={`sidebar-link ${active === link.id ? 'active' : ''}`}
                  onClick={() => goTo(link.id)}
                >
                  <span className="arrow">→</span>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="about-content">
          {/* About */}
          <h2 className="content-heading" id="about">Grievance Redressal Cell</h2>
          <div className="content-line" />
          <p>
            Satara Polytechnic, Satara has constituted a Grievance Redressal Cell to give
            students, parents, staff and every other stakeholder a fair, transparent and
            time-bound channel to report a grievance. Constituted as per the mandatory
            requirement of AICTE, the cell receives complaints, examines them and ensures
            suitable redressal — while keeping the identity of the complainant confidential
            and protecting them from any victimisation.
          </p>

          <div className="gr-chips">
            <div className="gr-chip">
              <div className="gr-chip-label">Write to us</div>
              <div className="gr-chip-value">
                <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>
              </div>
            </div>
            <div className="gr-chip">
              <div className="gr-chip-label">Office</div>
              <div className="gr-chip-value">
                <a href={`tel:${OFFICE_PHONE.replace(/[^0-9+]/g, '')}`}>{OFFICE_PHONE}</a>
              </div>
            </div>
            <div className="gr-chip">
              <div className="gr-chip-label">Acknowledgement</div>
              <div className="gr-chip-value">Within 3 working days</div>
            </div>
            <div className="gr-chip">
              <div className="gr-chip-label">Resolution</div>
              <div className="gr-chip-value">Within 15 working days</div>
            </div>
          </div>

          {/* Objectives */}
          <h3 className="cell-heading" id="objectives">Objectives of the Cell</h3>
          <ul className="vm-list">
            {objectives.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* Grievances handled */}
          <h3 className="cell-heading" id="types">Grievances Handled</h3>
          <div className="gr-types">
            {grievanceTypes.map((item) => (
              <div className="gr-type" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Process */}
          <h3 className="cell-heading" id="process">Redressal Process</h3>
          <ol className="gr-steps">
            {processSteps.map((step, i) => (
              <li className="gr-step" key={i}>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>

          {/* Committee */}
          <h3 className="cell-heading" id="committee">Grievance Redressal Committee</h3>
          {members.length > 0 ? (
            <div className="gr-table-wrap">
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name of Member</th>
                    <th>Designation</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{member.name}</td>
                      <td>{member.designation || member.position || '-'}</td>
                      <td>{member.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="gr-fallback">
              Committee members are listed on the{' '}
              <a href="/cells/grievance">Grievance Redressal Cell page</a>.
            </p>
          )}

          <div className="gr-links">
            <a className="gr-link" href="/cells/grievance">Grievance Redressal Cell →</a>
            <a className="gr-link" href="/cells/womens-grievance">Women Grievance Cell →</a>
            <a className="gr-link" href="/cells/anti-ragging">Anti-Ragging Cell →</a>
          </div>

          {/* Lodge a grievance */}
          <h3 className="cell-heading" id="lodge">Lodge a Grievance</h3>
          <p>
            Fill in the form below — it opens your own mail app with the details pre-filled
            and addressed to the cell. Nothing is stored on this website. You can also use
            any of the other channels listed under the form.
          </p>

          {sent ? (
            <div className="contact-success-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3>Your mail app should now be open</h3>
              <p>
                Press send in your mail app to reach the cell. If it did not open, write
                directly to{' '}
                <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>.
              </p>
              <button type="button" className="gr-edit-btn" onClick={() => setSent(false)}>
                Edit my details
              </button>
            </div>
          ) : (
            <form className="contact-form gr-form" onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-field">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Details of the Grievance *</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe what happened, when, and where. Mention your branch and year."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Compose Grievance Email
              </button>
            </form>
          )}

          <div className="gr-channels">
            {channels.map((c) => (
              <div className="gr-channel" key={c.title}>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                {c.link && <a className="gr-channel-link" href={c.link}>{c.linkLabel}</a>}
              </div>
            ))}
          </div>

          <p className="gr-confidential">
            All grievances are treated confidentially. No student will be victimised for
            raising a complaint in good faith.
          </p>
        </main>
      </div>
    </>
  );
}

export default GrievanceRedressal;
