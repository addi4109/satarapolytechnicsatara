import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './GrievancePortal.css';

const COLLEGE_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10';

const GRIEVANCE_EMAIL = 'spsgrievance@gmail.com';
const OFFICE_PHONE = '+91-94233 42843';

// Portal quick actions — the coloured buttons of the portal home page.
const portalActions = [
  {
    label: 'Lodge a Grievance',
    desc: 'Students, parents & staff — submit a complaint online',
    to: '/student/grievance-redressal#lodge',
    variant: 'gp-btn-navy',
  },
  {
    label: 'About the Cell',
    desc: 'Objectives, grievances handled & redressal process',
    to: '/student/grievance-redressal',
    variant: 'gp-btn-gold',
  },
  {
    label: 'Grievance Committee',
    desc: 'View committee members and contact details',
    to: '/cells/grievance',
    variant: 'gp-btn-maroon',
  },
  {
    label: 'Women Grievance Cell',
    desc: 'Secure channel for women students & staff',
    to: '/cells/womens-grievance',
    variant: 'gp-btn-teal',
  },
];

// Small quick-info strip under the portal box.
const quickInfo = [
  { label: 'Acknowledgement', value: 'Within 3 working days' },
  { label: 'Resolution', value: 'Within 15 working days' },
  { label: 'Confidentiality', value: '100% — no victimisation' },
];

function GrievancePortal() {
  return (
    <>
      <SEO
        title="Grievance Redressal Portal | Satara Polytechnic, Satara"
        description="Online Grievance Redressal Portal of Satara Polytechnic, Satara — lodge a student, parent or staff grievance, know the redressal process and contact the Grievance Redressal Cell."
        keywords="grievance portal, grievance redressal portal, student grievance Satara Polytechnic, complaint cell, AICTE grievance"
        url="/student/grievance-portal"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Student Section' },
          { name: 'Grievance Portal' },
        ])}
      />

      <div className="gp-page">
        {/* ===== Portal header — college identity block (as in the ERP portal) ===== */}
        <div className="gp-header">
          <div className="gp-header-left">
            <div className="gp-logo-circle">
              <img src={COLLEGE_LOGO} alt="Satara Polytechnic, Satara Logo" width="84" height="84" />
            </div>
            <div className="gp-header-text">
              <p className="gp-society">Satara Education Society's</p>
              <h1 className="gp-college">Satara Polytechnic, Satara</h1>
              <p className="gp-address">
                At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra, India.
              </p>
            </div>
          </div>
          <div className="gp-header-right">
            <p className="gp-portal-title">
              Grievance <strong>Redressal</strong> Portal
            </p>
            <p className="gp-portal-sub">AICTE Grievance Redressal Cell</p>
          </div>
        </div>

        {/* ===== Divider bar ===== */}
        <div className="gp-divider" />

        {/* ===== Portal action box ===== */}
        <div className="gp-box">
          <div className="gp-box-header">Grievance Redressal Portal</div>
          <div className="gp-box-body">
            {portalActions.map((action) => (
              <Link to={action.to} className={`gp-action ${action.variant}`} key={action.label}>
                <span className="gp-action-label">{action.label}</span>
                <span className="gp-action-desc">{action.desc}</span>
              </Link>
            ))}

            <div className="gp-box-contact">
              <a href={`mailto:${GRIEVANCE_EMAIL}`} className="gp-contact-item">
                <span aria-hidden="true">✉</span> {GRIEVANCE_EMAIL}
              </a>
              <a href={`tel:${OFFICE_PHONE.replace(/[^+0-9]/g, '')}`} className="gp-contact-item">
                <span aria-hidden="true">📞</span> {OFFICE_PHONE}
              </a>
            </div>
          </div>
        </div>

        {/* ===== Quick info strip ===== */}
        <div className="gp-quick">
          {quickInfo.map((item) => (
            <div className="gp-quick-item" key={item.label}>
              <span className="gp-quick-label">{item.label}</span>
              <span className="gp-quick-value">{item.value}</span>
            </div>
          ))}
        </div>

        {/* ===== Portal footer links ===== */}
        <div className="gp-footer-links">
          <Link to="/">Go to home page</Link>
          <span className="gp-sep">|</span>
          <a href={`mailto:${GRIEVANCE_EMAIL}`}>Need Help?</a>
        </div>
        <p className="gp-copyright">
          All rights reserved. Satara Education Society's Satara Polytechnic, Satara. &copy;{new Date().getFullYear()}.
        </p>
      </div>
    </>
  );
}

export default GrievancePortal;
