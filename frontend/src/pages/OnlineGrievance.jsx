import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';
import './Contact.css';
import './OnlineGrievance.css';

const GRIEVANCE_EMAIL = 'spsgrievance@gmail.com';

const BRANCHES = [
  'Computer Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
  'Automobile Engineering',
];

const COMMON_CATEGORIES = [
  'Academic Matters',
  'Examination Matters',
  'Fees, Scholarships & Concessions',
  'Infrastructure, Labs & Library',
  'Ragging, Harassment & Discrimination',
  'Hostel, Transport & Canteen',
  'Other Institutional Matter',
];

/* ---------- Avatars (inline SVG, styled after the dashboard mock-up) ---------- */

function StudentAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="og-avatar-svg" role="img" aria-label="Student">
      <circle cx="60" cy="60" r="60" fill="#1b4f7e" />
      <path d="M24 120c2-20 16-34 36-34s34 14 36 34z" fill="#ef8b3b" />
      <rect x="53" y="68" width="14" height="18" rx="6" fill="#f0c9a0" />
      <ellipse cx="60" cy="52" rx="21" ry="24" fill="#f7dcb8" />
      <circle cx="39" cy="55" r="4" fill="#f0c9a0" />
      <circle cx="81" cy="55" r="4" fill="#f0c9a0" />
      <path d="M38 50c0-15 10-26 22-26s22 11 22 26c-2-8-6-13-12-15-4 4-16 7-24 4-4 2-7 6-8 11z" fill="#1d2126" />
      <rect x="43" y="47" width="14" height="10" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <rect x="63" y="47" width="14" height="10" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <path d="M57 52h6" stroke="#20262e" strokeWidth="2.2" />
      <path d="M54 64c3 3 9 3 12 0" stroke="#c98b5e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="72" y="100" width="13" height="16" rx="2" fill="#fff" stroke="#d9d9d9" strokeWidth="1.5" />
      <rect x="74.5" y="103" width="8" height="6" fill="#4a90d9" />
    </svg>
  );
}

function FacultyAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="og-avatar-svg" role="img" aria-label="Faculty">
      <circle cx="60" cy="60" r="60" fill="#1b4f7e" />
      <path d="M24 120c2-20 16-34 36-34s34 14 36 34z" fill="#63c3d6" />
      <path d="M50 86l10 12 10-12-5-4h-10z" fill="#eaf7fb" />
      <path d="M60 94l6 7-6 19-6-19z" fill="#1f2d3d" />
      <rect x="53" y="68" width="14" height="18" rx="6" fill="#f0c9a0" />
      <ellipse cx="60" cy="52" rx="21" ry="24" fill="#f7dcb8" />
      <circle cx="39" cy="55" r="4" fill="#f0c9a0" />
      <circle cx="81" cy="55" r="4" fill="#f0c9a0" />
      <path d="M37 52c0-16 10-28 23-28s23 12 23 28c-1-9-5-15-10-17-6 5-21 8-29 4-4 3-6 7-7 13z" fill="#e8632a" />
      <rect x="43" y="47" width="14" height="10" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <rect x="63" y="47" width="14" height="10" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <path d="M57 52h6" stroke="#20262e" strokeWidth="2.2" />
      <path d="M54 64c3 3 9 3 12 0" stroke="#c98b5e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function StakeholderAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="og-avatar-svg" role="img" aria-label="Stakeholder">
      <circle cx="60" cy="60" r="60" fill="#1b4f7e" />
      <g>
        <path d="M14 20h20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H22l-5 5v-5h-3a3 3 0 0 1-3-3V23a3 3 0 0 1 3-3z" fill="#3fbf6a" />
        <path d="M84 14h20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H92l-5 5v-5h-3a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z" fill="#e74c3c" />
        <path d="M8 48h18a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H15l-5 5v-5H8a3 3 0 0 1-3-3V51a3 3 0 0 1 3-3z" fill="#f2c531" />
        <path d="M94 44h18a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-6l-5 5v-5h-7a3 3 0 0 1-3-3V47a3 3 0 0 1 3-3z" fill="#3fbf6a" />
        <rect x="20" y="74" width="16" height="12" rx="3" fill="#e74c3c" />
        <rect x="86" y="70" width="16" height="12" rx="3" fill="#f2c531" />
      </g>
      <path d="M26 120c3-19 15-32 34-32s31 13 34 32z" fill="#12293f" />
      <path d="M51 89l9 11 9-11-5-4h-8z" fill="#ffffff" />
      <path d="M60 96l5 6-4 17-4-17z" fill="#d0342c" />
      <rect x="54" y="70" width="12" height="16" rx="6" fill="#f0c9a0" />
      <ellipse cx="60" cy="54" rx="19" ry="22" fill="#f7dcb8" />
      <circle cx="42" cy="56" r="3.5" fill="#f0c9a0" />
      <circle cx="78" cy="56" r="3.5" fill="#f0c9a0" />
      <path d="M41 51c0-13 8-23 19-23s19 10 19 23c-2-8-5-12-10-14-5 4-16 6-22 3-3 2-5 5-6 11z" fill="#20262e" />
      <path d="M47 48h11" stroke="#20262e" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="62" y="45" width="12" height="9" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <rect x="46" y="45" width="12" height="9" rx="3" fill="rgba(255,255,255,.25)" stroke="#20262e" strokeWidth="2.2" />
      <path d="M58 49h4" stroke="#20262e" strokeWidth="2.2" />
      <path d="M55 63c3 3 8 3 11 0" stroke="#c98b5e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Card / form configuration ---------- */

const TYPES = [
  {
    key: 'student',
    title: 'Student Grievances',
    formTitle: 'Student Grievance Form',
    desc: 'Academics, exams, fees, hostel, ragging or any other concern — report it here.',
    intro: 'Raise a complaint as a student of the institute. Mention your branch and year for a faster response.',
    icon: <StudentAvatar />,
    categories: COMMON_CATEGORIES,
    extraFields: [
      { name: 'branch', label: 'Branch / Department', type: 'select', options: BRANCHES, required: true },
      { name: 'year', label: 'Year of Study', type: 'select', options: ['First Year', 'Second Year', 'Third Year'], required: true },
      { name: 'rollNo', label: 'Roll No. / PRN', type: 'text', placeholder: 'e.g. 2024-EX-1234' },
    ],
    messagePlaceholder: 'Describe what happened, when and where. Your identity is kept confidential.',
  },
  {
    key: 'faculty',
    title: 'Faculty Grievances',
    formTitle: 'Faculty Grievance Form',
    desc: 'Service, workload, infrastructure or administrative concerns raised by staff.',
    intro: 'Raise a complaint as a teaching or non-teaching member of the staff. The cell treats every report confidentially.',
    icon: <FacultyAvatar />,
    categories: COMMON_CATEGORIES,
    extraFields: [
      { name: 'department', label: 'Department', type: 'select', options: BRANCHES, required: true },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g. Lecturer / Assistant Professor' },
      { name: 'staffId', label: 'Employee ID', type: 'text', placeholder: 'Optional' },
    ],
    messagePlaceholder: 'Describe the concern clearly, with dates and involved parties if any.',
  },
  {
    key: 'stakeholder',
    title: 'Stakeholder Grievances',
    formTitle: 'Stakeholder Grievance Form',
    desc: 'Parents, alumni, visitors and partners — share your concern with the cell.',
    intro: 'Raise a complaint as a parent, alumnus, visitor or partner of the institute.',
    icon: <StakeholderAvatar />,
    categories: COMMON_CATEGORIES,
    extraFields: [
      {
        name: 'relationship',
        label: 'Your Relationship with the Institute',
        type: 'select',
        options: ['Parent / Guardian', 'Alumni', 'Student of another institute', 'Supplier / Vendor', 'Recruiter / Industry Partner', 'Other'],
        required: true,
      },
      { name: 'organisation', label: 'Organisation (if any)', type: 'text', placeholder: 'Optional' },
    ],
    messagePlaceholder: 'Describe your concern and how the institute can reach you.',
  },
];

const BLANK_FORM = {
  name: '',
  email: '',
  phone: '',
  message: '',
  branch: '',
  year: '',
  rollNo: '',
  department: '',
  designation: '',
  staffId: '',
  relationship: '',
  organisation: '',
};

function chunkPairs(list) {
  const rows = [];
  for (let i = 0; i < list.length; i += 2) rows.push(list.slice(i, i + 2));
  return rows;
}

function OnlineGrievance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  // 'emailjs' = delivered automatically, 'mail' = handed to the visitor's mail app.
  const [delivery, setDelivery] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const activeType = TYPES.find((t) => t.key === activeKey) || null;

  const openForm = (key, { updateUrl = true } = {}) => {
    const type = TYPES.find((t) => t.key === key);
    if (!type) return;
    setActiveKey(key);
    setForm(BLANK_FORM);
    setCategory(type.categories[0]);
    setSent(false);
    setDelivery(null);
    setErrorMessage('');
    if (updateUrl) setSearchParams({ form: key }, { replace: true });
  };

  const closeForm = () => {
    setActiveKey(null);
    setSent(false);
    setDelivery(null);
    setErrorMessage('');
    if (searchParams.get('form')) setSearchParams({}, { replace: true });
  };

  // Deep links from the navbar dropdown: /online-grievance?form=student
  useEffect(() => {
    const key = searchParams.get('form');
    if (key && TYPES.some((t) => t.key === key)) {
      openForm(key, { updateUrl: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Lock body scroll + close on Escape while the form modal is open.
  useEffect(() => {
    if (!activeKey) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeForm();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const composeMailto = (type, subject, body) =>
    `mailto:${GRIEVANCE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending || !activeType) return;
    setSending(true);
    setErrorMessage('');

    const type = activeType;
    const subject = `Online Grievance — ${type.title} — ${form.name}`;
    const detailLines = type.extraFields.map((f) => `${f.label}: ${form[f.name] || '-'}`);
    const body = [
      'Grievance Redressal Cell,',
      'Satara Polytechnic, Satara',
      '',
      `Grievance Type: ${type.title}`,
      `Name: ${form.name}`,
      `Email: ${form.email || '-'}`,
      `Phone: ${form.phone || '-'}`,
      ...detailLines,
      `Category: ${category}`,
      '',
      'Details of the grievance:',
      form.message,
    ].join('\n');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_GRIEVANCE_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Preferred: send it straight to the grievance mailbox through EmailJS.
    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: GRIEVANCE_EMAIL,
            reply_to: form.email,
            email: form.email,
            fullName: form.name,
            name: form.name,
            phone: form.phone || '-',
            subject,
            title: subject,
            grievance_type: type.title,
            category,
            department: form.branch || form.department || '-',
            message: body,
            details: form.message,
          },
          { publicKey },
        );
        setDelivery('emailjs');
        setSent(true);
        setSending(false);
        return;
      } catch (error) {
        console.error('EmailJS grievance send failed:', error?.status, error?.text || error?.message || error);
        // Fall through to the mail-app hand-off below so nothing is lost.
      }
    }

    // Fallback (also used when no grievance template is configured yet):
    // open the visitor's own mail app, pre-filled and addressed to the cell.
    window.location.href = composeMailto(type, subject, body);
    setDelivery('mail');
    setSent(true);
    setSending(false);
  };

  const fieldRows = activeType
    ? chunkPairs([
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
        ...activeType.extraFields,
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@example.com' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
        { name: '__category', label: 'Category of Grievance', type: 'select', options: activeType.categories },
      ])
    : [];

  const renderField = (f) => {
    if (f.type === 'select') {
      const value = f.name === '__category' ? category : form[f.name];
      return (
        <div className="form-field" key={f.name}>
          <label htmlFor={`og-${f.name}`}>
            {f.label}
            {f.required ? ' *' : ''}
          </label>
          <select
            id={`og-${f.name}`}
            name={f.name === '__category' ? 'category' : f.name}
            value={value}
            onChange={f.name === '__category' ? (e) => setCategory(e.target.value) : handleChange}
            required={f.required}
          >
            {(f.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <div className="form-field" key={f.name}>
        <label htmlFor={`og-${f.name}`}>
          {f.label}
          {f.required ? ' *' : ''}
        </label>
        <input
          id={`og-${f.name}`}
          type={f.type}
          name={f.name}
          value={form[f.name]}
          onChange={handleChange}
          placeholder={f.placeholder}
          required={f.required}
        />
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Online Grievance | Grievances Redressal Dashboard — Satara Polytechnic"
        description="Lodge an online grievance at Satara Polytechnic, Satara. Choose Student, Faculty or Stakeholder grievance form and submit your complaint to the Grievance Redressal Cell."
        keywords="online grievance, student grievance form, faculty grievance, stakeholder grievance, Satara Polytechnic complaint, grievance redressal dashboard"
        url="/online-grievance"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Online Grievance' },
        ])}
      />
      <PageBanner
        title="Online Grievance"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Online Grievance
          </>
        }
      />

      <div className="og-page">
        <h2 className="og-title">Grievances Redressal Dashboard</h2>
        <p className="og-sub">
          Select the category that matches you and fill in the form — your grievance reaches the
          Grievance Redressal Cell directly at{' '}
          <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>. Every complaint is treated
          confidentially.
        </p>

        <div className="og-cards">
          {TYPES.map((t) => (
            <button type="button" className="og-card" key={t.key} onClick={() => openForm(t.key)}>
              <span className="og-avatar">{t.icon}</span>
              <span className="og-card-label">{t.title}</span>
              <span className="og-card-desc">{t.desc}</span>
            </button>
          ))}
        </div>

        <div className="og-foot">
          <div className="og-foot-col">
            <h4>What happens next?</h4>
            <p>
              Your complaint is registered within 3 working days, examined by the committee and
              resolved ordinarily within 15 working days. You may also appeal to the Principal if
              you are not satisfied with the outcome.
            </p>
          </div>
          <div className="og-foot-col">
            <h4>Other channels</h4>
            <p>
              Write to <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>, drop a written
              complaint in the grievance box near the office, or read the full process on the{' '}
              <a href="/student/grievance-redressal">Grievance Redressal page</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Form modal ---------- */}
      {activeType && (
        <div
          className="og-overlay"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
          role="dialog"
          aria-modal="true"
          aria-label={activeType.formTitle}
        >
          <div className="og-modal">
            <button type="button" className="og-modal-close" onClick={closeForm} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!sent ? (
              <>
                <div className="og-modal-head">
                  <span className="og-modal-avatar">{activeType.icon}</span>
                  <div>
                    <h3>{activeType.formTitle}</h3>
                    <p>{activeType.intro}</p>
                  </div>
                </div>

                {errorMessage && <div className="og-error">{errorMessage}</div>}

                <form className="contact-form og-form" onSubmit={handleSubmit}>
                  {fieldRows.map((row, i) => (
                    <div className="form-row-2" key={i}>{row.map(renderField)}</div>
                  ))}

                  <div className="form-field">
                    <label htmlFor="og-message">Details of the Grievance *</label>
                    <textarea
                      id="og-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={activeType.messagePlaceholder}
                      required
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={sending}>
                    {sending ? 'Submitting…' : 'Submit Grievance'}
                  </button>

                  <p className="og-form-note">
                    Sent to <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>. Your
                    identity is kept confidential and you will not be victimised for raising a
                    complaint in good faith.
                  </p>
                </form>
              </>
            ) : (
              <div className="contact-success-box og-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>
                  {delivery === 'emailjs'
                    ? 'Your grievance has been submitted'
                    : 'Your mail app should now be open'}
                </h3>
                <p>
                  {delivery === 'emailjs' ? (
                    <>
                      It has been sent to the Grievance Redressal Cell at{' '}
                      <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a> and will be
                      acknowledged within 3 working days.
                    </>
                  ) : (
                    <>
                      Press send in your mail app to deliver it to{' '}
                      <a href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>. If it did not
                      open, write to us directly at that address.
                    </>
                  )}
                </p>
                <div className="og-success-actions">
                  <button type="button" className="og-btn-secondary" onClick={() => openForm(activeKey, { updateUrl: false })}>
                    Submit another
                  </button>
                  <button type="button" className="contact-submit-btn" onClick={closeForm}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default OnlineGrievance;
