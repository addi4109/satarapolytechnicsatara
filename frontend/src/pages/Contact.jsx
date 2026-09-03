import { useState, useEffect } from 'react';
import { SkeletonPage } from "../components/Skeleton";
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import FeedbackCarousel from '../components/FeedbackCarousel';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Academics.css';
import './Contact.css';
import './DepartmentsPage.css';

const routeMap = {
  '': 'contact',
  'contact': 'contact',
  'admission-enquiry': 'enquiry',
  'departments': 'departments',
  'office': 'office',
  'location': 'location',
  'feedback': 'feedback',
};

const sidebarLinks = [
  { id: 'contact', label: 'Contact Us' },
  { id: 'enquiry', label: 'Admission Enquiry' },
  { id: 'departments', label: 'Department Contacts' },
  { id: 'office', label: 'Office Contacts' },
  { id: 'location', label: 'Location' },
  { id: 'feedback', label: 'Feedback' },
];

import API_URL from '../lib/api';

function Contact() {
  const { page } = useParams();
  const [active, setActive] = useState('contact');
  const [contactData, setContactData] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', rating: 0 });
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  useEffect(() => {
    fetch(`${API_URL}/contact`)
      .then((r) => r.json())
      .then((contactRes) => {
        const mapped = {};
        contactRes.forEach((s) => { mapped[s.section] = s; });
        setContactData(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getContact = (key) => contactData[key] || {};

  const handleFeedbackChange = (e) => {
    setFeedbackForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: feedbackForm.name,
        email: feedbackForm.email,
        phone: feedbackForm.phone || '',
        subject: feedbackForm.subject,
        message: feedbackForm.message,
        rating: feedbackForm.rating || 0,
        showOnHome: true,
        createdAt: serverTimestamp(),
      });
      setFeedbackSent(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const seoTitle = active === 'enquiry' ? 'Admission Enquiry' :
    active === 'departments' ? 'Department Contacts' :
    active === 'office' ? 'Office Contacts' :
    active === 'location' ? 'Location' :
    active === 'feedback' ? 'Feedback' : 'Contact Us';

  if (loading) {
    return (
      <>
        <SEO title="Contact Us | Satara Polytechnic" description="Get in touch with Satara Polytechnic, Satara." keywords="contact Satara Polytechnic, college phone, college email" url="/contact" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${seoTitle} | Satara Polytechnic`}
        description={`Contact Satara Polytechnic, Satara. ${active === 'location' ? 'Find our campus location on the map.' : active === 'enquiry' ? 'Submit your admission enquiry online.' : 'Get phone, email, and address details.'}`}
        keywords={`contact Satara Polytechnic, ${seoTitle}, college phone, college email, Satara polytechnic address`}
        url={`/contact/${page || ''}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
          { name: seoTitle },
        ])}
      />
      <PageBanner
        title="Contact Us"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Contact Us
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Contact</h3>
          <ul className="sidebar-list">
            {sidebarLinks.map((link) => (
              <li key={link.id}>
                <button
                  className={`sidebar-link ${active === link.id ? 'active' : ''}`}
                  onClick={() => setActive(link.id)}
                >
                  <span className="arrow">→</span>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="about-content">
          {/* Contact Us */}
          {active === 'contact' && (
            <>
              <h2 className="content-heading">Contact Us</h2>
              <div className="content-line"></div>
              <p>We'd love to hear from you. Reach out to us through any of the following channels.</p>

              <div className="contact-cards-grid">
                <div className="contact-card">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <h4>Phone</h4>
                  <a href={`tel:${(getContact('office').phone || '+91-94233 42843').replace(/[^0-9+]/g, '')}`}>{getContact('office').phone || '+91-94233 42843'}</a>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <h4>Email</h4>
                  <a href={`mailto:${getContact('office').email || 'satarapolyinfo@gmail.com'}`}>{getContact('office').email || 'satarapolyinfo@gmail.com'}</a>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h4>Address</h4>
                  <p>{getContact('office').address || 'At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra'}</p>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <h4>Office Hours</h4>
                  <p>{(getContact('office').officeHours || 'Monday – Saturday, 10:30 AM – 5:00 PM').replace(', ', ' \u2013 ')}</p>
                </div>
              </div>
            </>
          )}

          {/* Admission Enquiry */}
          {active === 'enquiry' && (
            <>
              <h2 className="content-heading">Admission Enquiry</h2>
              <div className="content-line"></div>
              <p>Interested in joining Satara Polytechnic? Fill in the form below and our admissions team will get in touch with you within 24 hours.</p>

              {feedbackSent && active === 'enquiry' ? (
                <div className="contact-success-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h3>Thank You!</h3>
                  <p>Your enquiry has been submitted. We will contact you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setFeedbackSent(true); }}>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input type="text" name="name" value={feedbackForm.name} onChange={handleFeedbackChange} placeholder="Enter your name" required />
                    </div>
                    <div className="form-field">
                      <label>Phone Number *</label>
                      <input type="tel" name="phone" value={feedbackForm.phone} onChange={handleFeedbackChange} placeholder="+91 XXXXX XXXXX" required />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input type="email" name="email" value={feedbackForm.email} onChange={handleFeedbackChange} placeholder="you@example.com" />
                  </div>
                  <div className="form-field">
                    <label>Message *</label>
                    <textarea name="message" rows={4} value={feedbackForm.message} onChange={handleFeedbackChange} placeholder="Write your enquiry..." required></textarea>
                  </div>
                  <button type="submit" className="contact-submit-btn">Submit Enquiry</button>
                </form>
              )}
            </>
          )}

          {/* Department Contacts */}
          {active === 'departments' && (
            <>
              <h2 className="content-heading">Department Contacts</h2>
              <div className="content-line"></div>
              <p>Contact details for each engineering department at Satara Polytechnic.</p>

              {(() => {
                const deptDetails = getContact('departments').departmentDetails || [];
                return deptDetails.length > 0 ? (
                  <div className="contact-dept-cards">
                    {deptDetails.map((dept, i) => (
                      <div key={i} className="contact-dept-card">
                        <h4>{dept.name}</h4>
                        {dept.hod && <p><strong>HOD:</strong> {dept.hod}</p>}
                        {dept.phone && <p><strong>Phone:</strong> <a href={`tel:${dept.phone.replace(/[^0-9+]/g, '')}`}>{dept.phone}</a></p>}
                        {dept.email && <p><strong>Email:</strong> <a href={`mailto:${dept.email}`}>{dept.email}</a></p>}
                        {dept.address && <p style={{ fontSize: '12px', color: '#888' }}>{dept.address}</p>}
                        {dept.description && <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{dept.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888' }}>No department contact details added yet. Admin can add them from the Admin Panel.</p>
                );
              })()}
            </>
          )}

          {/* Office Contacts */}
          {active === 'office' && (
            <>
              <h2 className="content-heading">Office Contacts</h2>
              <div className="content-line"></div>
              <p>Key office staff at Satara Polytechnic, Satara.</p>

              {(() => {
                const officeRows = getContact('office').officeContacts || [];
                const fallbackPhone = getContact('office').phone || '+91-94233 42843';
                const rows = officeRows.length > 0 ? officeRows : [
                  { designation: 'General Office', name: 'Satara Polytechnic', phone: fallbackPhone, email: '' },
                ];
                return (
                  <div className="contact-cards-grid" style={{ marginTop: '16px' }}>
                    {rows.map((row, i) => (
                      <div className="contact-card" key={i} style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <p style={{ margin: 0, fontSize: '13px' }}><strong>Name:</strong> {row.name || '—'}</p>
                          <p style={{ margin: 0, fontSize: '13px' }}><strong>Des:</strong> {row.designation || '—'}</p>
                          {row.phone && <p style={{ margin: 0, fontSize: '13px' }}><strong>Phone:</strong> <a href={`tel:${row.phone.replace(/[^0-9+]/g, '')}`}>{row.phone}</a></p>}
                          {row.email && <p style={{ margin: 0, fontSize: '13px' }}><strong>Email:</strong> <a href={`mailto:${row.email}`}>{row.email}</a></p>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}

          {/* Location */}
          {active === 'location' && (
            <>
              <h2 className="content-heading">Our Location</h2>
              <div className="content-line"></div>
              <p>Find us on the map. We are located near NH-4, Khindwadi, Satara.</p>

              <div className="contact-map-wrap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3823.2!2d74.0094!3d17.6530!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2399e87a8a1e3%3A0xaae19259100b0879!2sSatara%20Polytechnic%2C%20Satara!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="College Location"
                ></iframe>
              </div>

              <div className="contact-location-info">
                <div className="contact-loc-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <strong>Address</strong>
                    <p>{getContact('office').address || 'At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra'}</p>
                  </div>
                </div>
                <div className="contact-loc-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div>
                    <strong>Office Hours</strong>
                    <p>{getContact('office').officeHours || 'Monday – Saturday, 10:30 AM – 5:00 PM'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Feedback */}
          {active === 'feedback' && (
            <>
              <h2 className="content-heading">Feedback</h2>
              <div className="content-line"></div>
              <p>Your feedback helps us improve. Share your experience or suggestions with us.</p>

              {feedbackSent ? (
                <div className="contact-success-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h3>Thank You!</h3>
                  <p>Your feedback has been submitted successfully. We appreciate your time.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleFeedbackSubmit}>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Your Name *</label>
                      <input type="text" name="name" value={feedbackForm.name} onChange={handleFeedbackChange} placeholder="Enter your name" required />
                    </div>
                    <div className="form-field">
                      <label>Email Address</label>
                      <input type="email" name="email" value={feedbackForm.email} onChange={handleFeedbackChange} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Subject *</label>
                    <input type="text" name="subject" value={feedbackForm.subject} onChange={handleFeedbackChange} placeholder="What is this about?" required />
                  </div>
                  <div className="form-field">
                    <label>Rating *</label>
                    <div className="star-rating-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`star-btn ${star <= feedbackForm.rating ? 'active' : ''}`}
                          onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: star }))}
                        >
                          ★
                        </button>
                      ))}
                      {feedbackForm.rating > 0 && (
                        <span className="star-rating-label">{feedbackForm.rating}/5</span>
                      )}
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Your Feedback *</label>
                    <textarea name="message" rows={5} value={feedbackForm.message} onChange={handleFeedbackChange} placeholder="Write your feedback or suggestions..." required></textarea>
                  </div>
                  <button type="submit" className="contact-submit-btn">Submit Feedback</button>
                </form>
              )}

              {/* Feedback Carousel */}
              <FeedbackCarousel />
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Contact;
