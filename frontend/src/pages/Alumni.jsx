import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { SkeletonPage } from '../components/Skeleton';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';
import './Alumni.css';

const routeMap = {
  '': 'about',
  'about': 'about',
  'vision-mission': 'vision-mission',
  'entrepreneurs': 'entrepreneurs',
  'association': 'association',
  'registration': 'registration',
};

const sidebarLinks = [
  { id: 'about', label: 'About Alumni' },
  { id: 'vision-mission', label: 'Alumni Vision & Mission' },
  { id: 'entrepreneurs', label: 'Entrepreneurs' },
  { id: 'association', label: 'Alumni Association' },
  { id: 'registration', label: 'Alumni Registration Form' },
];

function Alumni() {
  const { page } = useParams();
  const [active, setActive] = useState('about');
  const [loading, setLoading] = useState(false);
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    passingYear: '',
    department: '',
    currentPosition: '',
    company: '',
    message: '',
  });
  const [regSubmitted, setRegSubmitted] = useState(false);

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  const handleRegChange = (e) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    setRegSubmitted(true);
  };

  const seoTitle = active === 'about' ? 'About Alumni' :
    active === 'vision-mission' ? 'Alumni Vision & Mission' :
    active === 'entrepreneurs' ? 'Entrepreneurs' :
    active === 'association' ? 'Alumni Association' :
    'Alumni Registration Form';

  if (loading) {
    return (
      <>
        <SEO title="Alumni | Satara Polytechnic" description="Alumni network of Satara Polytechnic, Satara." keywords="alumni, Satara Polytechnic alumni" url="/alumni" />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${seoTitle} | Satara Polytechnic`}
        description={`Satara Polytechnic Alumni - ${seoTitle}. Stay connected with your alma mater.`}
        keywords={`alumni, Satara Polytechnic alumni, ${seoTitle}`}
        url={`/alumni/${page || 'about'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Alumni', url: '/alumni' },
          { name: seoTitle },
        ])}
      />
      <PageBanner
        title="Alumni"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Alumni
          </>
        }
      />

      <div className="about-layout">
        <aside className="about-sidebar">
          <h3 className="sidebar-heading">Alumni</h3>
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
          {/* About Alumni */}
          {active === 'about' && (
            <>
              <h2 className="content-heading">About Alumni</h2>
              <div className="content-line"></div>
              <p>
                The alumni of Satara Polytechnic, Satara form a proud and thriving community of
                engineers, entrepreneurs, and professionals spread across India and around the world.
                Since our establishment, thousands of diploma holders have graduated from our institute
                and gone on to build successful careers in diverse engineering sectors.
              </p>
              <p>
                Our alumni are the true ambassadors of Satara Polytechnic. Their achievements in
                industry, academia, and entrepreneurship reflect the quality of education and values
                instilled during their time at the institute. Many of our alumni hold senior positions
                in leading companies, while others have started their own ventures, creating employment
                opportunities and contributing to the economy.
              </p>
              <p>
                We take immense pride in the accomplishments of our alumni and remain committed to
                maintaining a lifelong connection with them. The Alumni Network serves as a bridge
                between the institute and its graduates, fostering mentorship, collaboration, and
                giving back to the alma mater.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">10,000+</span>
                  <span className="stat-txt">Alumni Worldwide</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">50+</span>
                  <span className="stat-txt">Years of Legacy</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">500+</span>
                  <span className="stat-txt">Entrepreneurs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">6</span>
                  <span className="stat-txt">Engineering Branches</span>
                </div>
              </div>

              {/* Notable Alumni */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Our Alumni Achievements</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Industry Leaders</span>
                    <span className="info-value">Our alumni hold key positions in top companies across IT, manufacturing, automobile, chemical, and electrical sectors in India and abroad.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Entrepreneurs</span>
                    <span className="info-value">Many alumni have started their own businesses, from small-scale industries to successful tech startups, creating employment and driving innovation.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Government Service</span>
                    <span className="info-value">Several alumni serve in various government departments, public sector undertakings, and defense services across the nation.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Higher Education</span>
                    <span className="info-value">Many alumni have pursued higher education including B.E., B.Tech, M.E., MBA, and PhD from reputed universities in India and overseas.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Alumni Vision & Mission */}
          {active === 'vision-mission' && (
            <>
              <h2 className="content-heading">Alumni Vision & Mission</h2>
              <div className="content-line"></div>

              {/* Vision */}
              <div className="alumni-vm-card">
                <div className="alumni-vm-icon alumni-vm-vision">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To build a vibrant, engaged, and ever-growing alumni network that strengthens the
                  bond between Satara Polytechnic and its graduates. We envision a community where
                  alumni actively contribute to the institute's growth through mentorship, knowledge
                  sharing, industry partnerships, and philanthropic support — creating a legacy of
                  excellence that inspires future generations.
                </p>
              </div>

              {/* Mission */}
              <div className="alumni-vm-card">
                <div className="alumni-vm-icon alumni-vm-mission">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to connect, engage, and empower the alumni community of Satara
                  Polytechnic by:
                </p>
                <ul className="alumni-mission-list">
                  <li>Fostering lifelong relationships between alumni and the institute</li>
                  <li>Facilitating mentorship and career guidance for current students</li>
                  <li>Organizing alumni meets, reunions, and networking events</li>
                  <li>Creating opportunities for alumni to contribute to institute development</li>
                  <li>Supporting industry-academia collaboration and knowledge exchange</li>
                  <li>Promoting entrepreneurship and innovation among alumni</li>
                  <li>Recognizing and celebrating alumni achievements</li>
                </ul>
              </div>

              {/* Core Values */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Core Values</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Connection</span>
                    <span className="info-value">Building and maintaining strong bonds between alumni, students, and the institute through regular engagement and communication.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Giving Back</span>
                    <span className="info-value">Encouraging alumni to contribute their time, expertise, and resources for the betterment of current students and institute infrastructure.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Excellence</span>
                    <span className="info-value">Upholding the highest standards of professional and personal excellence in all endeavors, reflecting the values of Satara Polytechnic.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Innovation</span>
                    <span className="info-value">Promoting a culture of continuous learning, innovation, and adaptation to stay relevant in the rapidly evolving engineering landscape.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Entrepreneurs */}
          {active === 'entrepreneurs' && (
            <>
              <h2 className="content-heading">Entrepreneurs</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic has a rich tradition of producing successful entrepreneurs who have
                built businesses ranging from small-scale industries to large manufacturing units and
                tech startups. Our alumni entrepreneurs are a testament to the institute's focus on
                practical education, innovation, and self-reliance.
              </p>
              <p>
                The entrepreneurial spirit nurtured at Satara Polytechnic encourages students to think
                beyond traditional employment and create their own path. Many of our alumni started
                their ventures soon after graduation, leveraging the technical skills and business
                acumen gained during their diploma years.
              </p>

              {/* Stats */}
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">500+</span>
                  <span className="stat-txt">Alumni Entrepreneurs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">200+</span>
                  <span className="stat-txt">Businesses Started</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">5000+</span>
                  <span className="stat-txt">Jobs Created</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">10+</span>
                  <span className="stat-txt">Industry Sectors</span>
                </div>
              </div>

              {/* Sectors */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Entrepreneurship Sectors</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Manufacturing</span>
                    <span className="info-value">CNC machining units, fabrication workshops, auto component manufacturing, and precision engineering businesses.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">IT & Software</span>
                    <span className="info-value">Software development firms, web agencies, mobile app companies, and IT consulting services.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Automobile Services</span>
                    <span className="info-value">Auto repair workshops, dealership showrooms, spare parts businesses, and vehicle customization studios.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Construction & Infrastructure</span>
                    <span className="info-value">Civil contracting firms, real estate development, interior design studios, and建筑 material supply businesses.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Electrical & Electronics</span>
                    <span className="info-value">Electrical contracting, solar energy installation, home automation, and electronics repair services.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Chemical & Process</span>
                    <span className="info-value">Chemical processing units, water treatment plants, environmental consulting, and food processing businesses.</span>
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Success Stories</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <p>
                  Our alumni entrepreneurs have made their mark across diverse sectors. From running
                  successful manufacturing units in Satara and Pune to launching tech startups in
                  Mumbai and Bangalore, our graduates have shown that a diploma from Satara
                  Polytechnic is a strong foundation for entrepreneurial success.
                </p>
                <p>
                  The institute regularly invites successful alumni entrepreneurs to share their
                  journey and insights with current students through guest lectures, workshops, and
                  mentorship sessions. These interactions inspire students and provide practical
                  guidance for those aspiring to start their own ventures.
                </p>
              </div>

              {/* CTA */}
              <div style={{ marginTop: '36px', background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', margin: '0 0 8px' }}>Are You an Alumni Entrepreneur?</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px', lineHeight: '1.6' }}>
                  Share your success story with us! We would love to feature your journey and inspire the next generation of entrepreneurs.
                </p>
                <a href="mailto:satarapolyinfo@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', background: '#243358', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  ✉ Share Your Story
                </a>
              </div>
            </>
          )}

          {/* Alumni Association */}
          {active === 'association' && (
            <>
              <h2 className="content-heading">Alumni Association</h2>
              <div className="content-line"></div>
              <p>
                The Satara Polytechnic Alumni Association (SPAA) is the official body that connects
                all alumni of the institute. Established to strengthen the bond between the institute
                and its graduates, the association serves as a platform for networking, knowledge
                sharing, and mutual growth.
              </p>
              <p>
                The association organizes regular alumni meets, annual reunions, technical workshops,
                and social events that bring together alumni from different batches and branches.
                These events provide opportunities to reconnect with old friends, share professional
                experiences, and contribute to the institute's development.
              </p>

              {/* Association Structure */}
              <div style={{ marginTop: '28px' }}>
                <h3 className="content-sub-heading">Association Structure</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">President</span>
                    <span className="info-value">Senior alumni leader who oversees the association's activities and represents the alumni community.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vice President</span>
                    <span className="info-value">Supports the president and coordinates special initiatives and alumni engagement programs.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Secretary</span>
                    <span className="info-value">Manages official communications, meeting minutes, and day-to-day operations of the association.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Treasurer</span>
                    <span className="info-value">Handles the association's finances, membership fees, and fundraising activities.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Executive Committee</span>
                    <span className="info-value">Representatives from each department and batch who help plan and execute alumni events and initiatives.</span>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div style={{ marginTop: '36px' }}>
                <h3 className="content-sub-heading">Key Activities</h3>
                <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '20px', borderRadius: '2px' }}></div>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-label">Annual Alumni Meet</span>
                    <span className="info-value">A grand annual gathering where alumni from all batches come together to reconnect, share memories, and celebrate their journey.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Batch Reunions</span>
                    <span className="info-value">Dedicated reunion events for specific batches to celebrate milestones and reconnect with classmates and faculty.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mentorship Program</span>
                    <span className="info-value">Alumni mentors guide current students with career advice, interview preparation, and industry insights.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Guest Lectures</span>
                    <span className="info-value">Alumni experts deliver technical and professional lectures, sharing real-world industry experience with students.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Scholarship Fund</span>
                    <span className="info-value">Alumni contribute to scholarship funds that support meritorious and economically disadvantaged students.</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Industry Connect</span>
                    <span className="info-value">Alumni help facilitate industry visits, internships, and placement opportunities for current students.</span>
                  </div>
                </div>
              </div>

              {/* Join CTA */}
              <div style={{ marginTop: '36px', background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#243358', margin: '0 0 8px' }}>Join the Alumni Association</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px', lineHeight: '1.6' }}>
                  Become a member of SPAA and stay connected with your alma mater. Register today to receive updates about events, reunions, and networking opportunities.
                </p>
                <a href="/alumni/registration" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', background: '#243358', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  Register Now →
                </a>
              </div>
            </>
          )}

          {/* Alumni Registration Form */}
          {active === 'registration' && (
            <>
              <h2 className="content-heading">Alumni Registration Form</h2>
              <div className="content-line"></div>
              <p>
                Register as an alumnus of Satara Polytechnic to stay connected with your alma mater.
                Fill in your details below to join our alumni network and receive updates about
                events, reunions, and opportunities.
              </p>

              {regSubmitted ? (
                <div className="contact-success-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <h3>Thank You!</h3>
                  <p>Your alumni registration has been submitted successfully. We will get in touch with you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleRegSubmit}>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input type="text" name="fullName" value={regForm.fullName} onChange={handleRegChange} placeholder="Enter your full name" required />
                    </div>
                    <div className="form-field">
                      <label>Email Address *</label>
                      <input type="email" name="email" value={regForm.email} onChange={handleRegChange} placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Phone Number *</label>
                      <input type="tel" name="phone" value={regForm.phone} onChange={handleRegChange} placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div className="form-field">
                      <label>Passing Year *</label>
                      <input type="text" name="passingYear" value={regForm.passingYear} onChange={handleRegChange} placeholder="e.g. 2015" required />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Department *</label>
                      <select name="department" value={regForm.department} onChange={handleRegChange} required>
                        <option value="">Select Department</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Automobile Engineering">Automobile Engineering</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Current Position</label>
                      <input type="text" name="currentPosition" value={regForm.currentPosition} onChange={handleRegChange} placeholder="e.g. Software Engineer" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Company / Organization</label>
                    <input type="text" name="company" value={regForm.company} onChange={handleRegChange} placeholder="e.g. TCS, Infosys, Own Business" />
                  </div>
                  <div className="form-field">
                    <label>Message (Optional)</label>
                    <textarea name="message" rows={4} value={regForm.message} onChange={handleRegChange} placeholder="Share your experience or any message..."></textarea>
                  </div>
                  <button type="submit" className="contact-submit-btn">Register as Alumni</button>
                </form>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Alumni;
