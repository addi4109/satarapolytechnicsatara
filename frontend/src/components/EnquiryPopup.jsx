import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './EnquiryPopup.css';

const DEPARTMENTS = [
  'Computer Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
  'Automobile Engineering',
];

function EnquiryPopup({ onClose }) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    department: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [partialSuccess, setPartialSuccess] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    console.log('EnquiryPopup - Template params:', templateParams);

    try {
      // STEP 1: Send college enquiry email (Template 1)
      console.log('EnquiryPopup - Sending college email...');
      const collegeResponse = await emailjs.send(
        serviceId,
        collegeTemplateId,
        templateParams,
        { publicKey }
      );
      console.log('EnquiryPopup - College email SUCCESS:', collegeResponse.status);

      // STEP 2: Send student auto-reply email (Template 2)
      try {
        console.log('EnquiryPopup - Sending auto-reply email...');
        const autoReplyResponse = await emailjs.send(
          serviceId,
          autoReplyTemplateId,
          templateParams,
          { publicKey }
        );
        console.log('EnquiryPopup - Auto-reply SUCCESS:', autoReplyResponse.status);
        setSubmitted(true);
      } catch (autoReplyError) {
        console.error('EnquiryPopup - Auto-reply FAILED:', autoReplyError);
        setPartialSuccess(
          'Your enquiry was received, but we couldn\'t send the confirmation email. Our admission team will still contact you.'
        );
        setSubmitted(true);
      }
    } catch (error) {
      console.error('EnquiryPopup - College email FAILED:', error);
      setErrorMessage(
        'Sorry, we couldn\'t submit your enquiry right now. Please try again or contact the college directly.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`enquiry-overlay ${visible ? 'show' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`enquiry-panel ${visible ? 'show' : ''}`}>
        {/* Close button */}
        <button className="enquiry-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!submitted ? (
          <>
            {/* Left image panel */}
            <div className="enquiry-left">
              <img
                src="/enquiry-image.png"
                alt="Admissions Open"
                className="enquiry-left-img"
              />
            </div>

            {/* Right form */}
            <div className="enquiry-right">
              <div className="enquiry-form-wrap">
                <h3>Admission Enquiry</h3>
                <p className="enquiry-subtitle">We'd love to hear from you</p>

                {/* Error message */}
                {errorMessage && (
                  <div className="enquiry-error-msg">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="enquiry-form">
                  <div className="enquiry-field">
                    <label htmlFor="eq-name">Full Name</label>
                    <div className="enquiry-input-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input
                        id="eq-name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="eq-phone">Phone Number</label>
                    <div className="enquiry-input-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <input
                        id="eq-phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="eq-email">Email Address</label>
                    <div className="enquiry-input-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <input
                        id="eq-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="eq-dept">Interested Department</label>
                    <div className="enquiry-input-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      <select
                        id="eq-dept"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select department</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="eq-msg">Message (optional)</label>
                    <div className="enquiry-input-wrap enquiry-textarea-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <textarea
                        id="eq-msg"
                        name="message"
                        placeholder="Any specific question?"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="enquiry-submit" disabled={sending}>
                    {sending ? (
                      <>
                        <span className="enquiry-spinner" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Enquiry
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="enquiry-success">
            <div className="enquiry-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="enquiry-success-title">Thank You!</h3>
            <p className="enquiry-success-subtitle">Your admission enquiry has been received</p>

            {/* Submitted details card */}
            <div className="enquiry-success-card">
              <div className="enquiry-success-detail">
                <span className="enquiry-success-label">Name</span>
                <span className="enquiry-success-value">{formData.fullName}</span>
              </div>
              <div className="enquiry-success-detail">
                <span className="enquiry-success-label">Department</span>
                <span className="enquiry-success-value">{formData.department}</span>
              </div>
              {formData.email && (
                <div className="enquiry-success-detail">
                  <span className="enquiry-success-label">Email</span>
                  <span className="enquiry-success-value">{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="enquiry-success-detail">
                  <span className="enquiry-success-label">Phone</span>
                  <span className="enquiry-success-value">{formData.phone}</span>
                </div>
              )}
            </div>

            {partialSuccess ? (
              <p className="enquiry-success-warning">
                {partialSuccess}
              </p>
            ) : (
              <p className="enquiry-success-msg">
                Our admission team or concerned staff member will contact you soon.
              </p>
            )}

            <div className="enquiry-success-actions">
              <button className="enquiry-success-btn" onClick={handleClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnquiryPopup;
