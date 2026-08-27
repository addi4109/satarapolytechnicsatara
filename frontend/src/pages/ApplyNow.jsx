import { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';
import './ApplyNow.css';

// Initialize EmailJS with public key on module load
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
if (emailjsPublicKey) {
  emailjs.init(emailjsPublicKey);
}

const branchOptions = [
  'Computer Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
  'Automobile Engineering',
  'General Science',
];

function ApplyNow() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [partialSuccess, setPartialSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);
    setErrorMessage('');
    setPartialSuccess('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const collegeTemplateId = import.meta.env.VITE_EMAILJS_COLLEGE_TEMPLATE_ID;
    const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !collegeTemplateId || !autoReplyTemplateId || !publicKey) {
      console.error('Missing EmailJS environment variables!');
      setErrorMessage(
        'Email configuration is missing. Please contact the college directly.'
      );
      setSending(false);
      return;
    }

    emailjs.init(publicKey);

    const templateParams = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      department: formData.department,
      message: formData.message || '',
    };

    try {
      // STEP 1: Send college enquiry email (Template 1)
      await emailjs.send(
        serviceId,
        collegeTemplateId,
        templateParams,
        { publicKey }
      );

      // STEP 2: Send student auto-reply email (Template 2)
      try {
        await emailjs.send(
          serviceId,
          autoReplyTemplateId,
          templateParams,
          { publicKey }
        );
        setSubmitted(true);
      } catch (autoReplyError) {
        console.error('Auto-reply email failed:', autoReplyError);
        setPartialSuccess(
          'Your enquiry was received, but we couldn\'t send the confirmation email. Our admission team will still contact you.'
        );
        setSubmitted(true);
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setErrorMessage(
        'Sorry, we couldn\'t submit your enquiry right now. Please try again or contact the college directly.'
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageBanner
          title="Apply Now"
          breadcrumb={
            <>
              <a href="/">Home</a>
              <span className="sep">|</span>
              <a href="/admissions/overview">Admissions</a>
              <span className="sep">|</span>
              Apply Now
            </>
          }
        />
        <div className="apply-page-wrap">
          <div className="apply-success">
            <div className="success-icon">✓</div>
            <h2>Application Submitted Successfully!</h2>
            {partialSuccess ? (
              <p style={{ color: '#e67e22', fontWeight: 600 }}>
                {partialSuccess}
              </p>
            ) : (
              <p>
                Thank you! Your admission enquiry has been submitted successfully.
                Our admission team or concerned staff member will contact you soon.
              </p>
            )}
            <div className="success-details">
              <div className="success-row">
                <span className="success-label">Name</span>
                <span className="success-value">{formData.fullName}</span>
              </div>
              <div className="success-row">
                <span className="success-label">Department</span>
                <span className="success-value">{formData.department}</span>
              </div>
            </div>
            <Link to="/admissions/overview" className="apply-btn back">
              Back to Admissions
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Apply Now | Online Admission Enquiry Form"
        description="Submit your online admission enquiry form for Satara Polytechnic, Satara. Choose from 6 engineering branches - Computer, ETC, Mechanical, Chemical, Electrical, and Automobile."
        keywords="apply polytechnic, online admission form, polytechnic application, Satara Polytechnic apply now"
        url="/admissions/apply"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Admissions', url: '/admissions/overview' },
          { name: 'Apply Now' },
        ])}
      />
      <PageBanner
        title="Apply Now"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            <a href="/admissions/overview">Admissions</a>
            <span className="sep">|</span>
            Apply Now
          </>
        }
      />

      <div className="apply-page-wrap">
        <div className="apply-layout">
          {/* Sidebar */}
          <aside className="about-sidebar">
            <h3 className="sidebar-heading">Admissions</h3>
            <ul className="sidebar-list">
              <li><Link to="/admissions/overview" className="sidebar-link"><span className="arrow">→</span>Admission Overview</Link></li>
              <li><Link to="/admissions/courses" className="sidebar-link"><span className="arrow">→</span>Courses Offered</Link></li>
              <li><Link to="/admissions/eligibility" className="sidebar-link"><span className="arrow">→</span>Eligibility</Link></li>
              <li><Link to="/admissions/process" className="sidebar-link"><span className="arrow">→</span>Admission Process</Link></li>
              <li><Link to="/admissions/first-year" className="sidebar-link"><span className="arrow">→</span>First Year Admission</Link></li>
              <li><Link to="/admissions/direct-second" className="sidebar-link"><span className="arrow">→</span>Direct Second Year</Link></li>
              <li><Link to="/admissions/acap" className="sidebar-link"><span className="arrow">→</span>A-CAP</Link></li>
              <li><Link to="/admissions/fees" className="sidebar-link"><span className="arrow">→</span>Fee Structure</Link></li>
              <li><Link to="/admissions/scholarships" className="sidebar-link"><span className="arrow">→</span>Scholarships</Link></li>
              <li><Link to="/admissions/brochure" className="sidebar-link"><span className="arrow">→</span>College Brochure</Link></li>
              <li><Link to="/admissions/apply" className="sidebar-link active"><span className="arrow">→</span>Apply Now</Link></li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="apply-main">
            <div className="apply-header">
              <h2 className="content-heading">Admission Enquiry Form</h2>
              <div className="content-line"></div>
              <p className="apply-intro">
                Fill in the form below to apply for admission or to enquire about
                our diploma programmes. Our admission team will get back to you
                within 24 hours.
              </p>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="apply-error-msg">
                {errorMessage}
              </div>
            )}

            <form className="apply-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Contact Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-XXXXXXXXXX"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {branchOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your query or message here..."
                rows="4"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="submit"
              className="apply-btn submit"
              disabled={sending}
            >
              {sending ? 'Submitting...' : 'Submit Enquiry'}
            </button>
            <button
              type="reset"
              className="apply-btn reset"
              disabled={sending}
              onClick={() => {
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  department: '',
                  message: '',
                });
                setErrorMessage('');
                setPartialSuccess('');
              }}
            >
              Reset Form
            </button>
          </div>
        </form>
          </main>
        </div>

        {/* Contact Info */}
        <div className="apply-contact-bar">
          <div className="contact-item">
            <span className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <span className="contact-text">+91-9309919088</span>
          </div>
          <div className="contact-divider"></div>
          <div className="contact-item">
            <span className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <span className="contact-text">info@sfrppolytechnic.ac.in</span>
          </div>
          <div className="contact-divider"></div>
          <div className="contact-item">
            <span className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <span className="contact-text">Satara Polytechnic, Satara</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyNow;
