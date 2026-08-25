import { useState, useEffect } from 'react';
import './Navbar.css';

const API_URL = '/api';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [dbCells, setDbCells] = useState([]);
  const [dbDepts, setDbDepts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/cells`)
      .then((res) => res.json())
      .then((data) => setDbCells(data))
      .catch((err) => console.error('Failed to fetch cells for navbar:', err));
    fetch(`${API_URL}/departments`)
      .then((res) => res.json())
      .then((data) => setDbDepts(data))
      .catch((err) => console.error('Failed to fetch departments for navbar:', err));
  }, []);

  const menuData = [
    {
      label: 'HOME',
      link: '/',
    },
    {
      label: 'ABOUT',
      type: 'multi-column',
      columns: [
        {
          header: 'About',
          items: [
            { label: 'Satara Education Society', link: '/about/society' },
            { label: 'Institute', link: '/about/institute' },
            { label: 'Mandatory Disclosure', link: '/about/disclosure' },
            { label: 'Vision & Mission', link: '/about/vision-mission' },
            { label: 'Affiliation & Approval', link: '/about/affiliation' },
          ],
        },
        {
          header: 'Management',
          items: [
            { label: 'Founder', link: '/about/founder' },
            { label: 'Chairman', link: '/about/chairman' },
            { label: 'Secretary', link: '/about/secretary' },
            { label: 'Principal', link: '/about/principal' },
            { label: 'Governing Body', link: '/about/governing-body' },
          ],
        },
      ],
    },
    {
      label: 'ACADEMICS',
      type: 'multi-column',
      columns: [
        {
          header: 'Departments',
          items: dbDepts.filter((d) => !d.hideFromHome).map((d) => ({
            label: d.name,
            link: `/departments/${d.slug}`,
          })),
        },
        {
          header: 'Cell and Committees',
          items: dbCells.map((c) => ({
            label: c.name,
            link: `/cells/${c.slug}`,
          })),
        },
      ],
    },
    {
      label: 'ADMISSIONS',
      children: [
        { label: 'Admission Overview', link: '/admissions/overview' },
        { label: 'Courses Offered', link: '/admissions/courses' },
        { label: 'Eligibility', link: '/admissions/eligibility' },
        { label: 'Admission Process', link: '/admissions/process' },
        { label: 'First Year Admission', link: '/admissions/first-year' },
        { label: 'Direct Second Year', link: '/admissions/direct-second' },
        { label: 'A-CAP', link: '/admissions/acap' },

        { label: 'Fee Structure', link: '/admissions/fees' },
        { label: 'Scholarships', link: '/admissions/scholarships' },
        { label: 'College Brochure', link: '/admissions/brochure' },

        { label: 'Apply Now', link: '/admissions/apply' },
      ],
    },
    {
      label: 'CAMPUS',
      type: 'multi-column',
      columns: [
        {
          header: 'Facility',
          items: [
            { label: 'Library', link: '/campus/library' },
            { label: 'Bus Facility', link: '/campus/bus-facility' },
            { label: 'Canteen', link: '/campus/canteen' },
          ],
        },
        {
          header: 'Office',
          items: [
            { label: "Registrar's Desk", link: '/campus/registrar' },
            { label: 'Office Staff', link: '/campus/office-staff' },
            { label: 'Non Teaching Staff', link: '/campus/non-teaching-staff' },
          ],
        },
      ],
    },
    {
      label: 'PLACEMENTS',
      children: [
        { label: 'About Placement Cell', link: '/placements/about' },
        { label: 'Placement Process', link: '/placements/process' },
        { label: 'Placement Records', link: '/placements/records' },
        { label: 'Our Recruiters', link: '/placements/recruiters' },
      ],
    },
    {
      label: 'ACTIVITIES',
      children: [
        { label: 'Sports', link: '/activities/sports' },
        { label: 'Cultural', link: '/activities/cultural' },
        { label: 'Technical Events', link: '/activities/technical' },
        { label: 'Industrial Visits', link: '/activities/industrial-visits' },
        { label: 'Competitions', link: '/activities/competitions' },
      ],
    },
    {
      label: 'EXAMINATION',
      children: [
        { label: 'Exam Schedule', link: '/examination/schedule' },
        { label: 'Exam Rules', link: '/examination/rules' },
        { label: 'Results', link: '/examination/results' },
        { label: 'Revaluation', link: '/examination/revaluation' },
        { label: 'Exam Notices', link: '/examination/notices' },
      ],
    },
    {
      label: 'GALLERY',
      children: [
        { label: 'Photo Gallery', link: '/gallery/photos' },
        { label: 'Video Gallery', link: '/gallery/videos' },
        { label: 'Media News', link: '/gallery/media' },
      ],
    },
    {
      label: 'NOTICES',
      link: '/notices',
    },
    {
      label: 'CONTACT',
      children: [
        { label: 'Contact Us', link: '/contact' },
        { label: 'Admission Enquiry', link: '/contact/admission-enquiry' },
        { label: 'Department Contacts', link: '/contact/departments' },
        { label: 'Office Contacts', link: '/contact/office' },
        { label: 'Location', link: '/contact/location' },
        { label: 'Feedback', link: '/contact/feedback' },
      ],
    },
  ];

  const handleMouseEnter = (index) => {
    setOpenMenu(index);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };

  const toggleMobile = (index) => {
    setMobileExpanded(mobileExpanded === index ? null : index);
  };

  return (
    <header className="site-header">
      {/* top strip */}
      <div className="top-strip">
        <div className="top-strip-inner">
          <span className="top-left">📞 +91-XXXXXXXXXX</span>
          <span className="top-right">✉ info@college.ac.in</span>
        </div>
      </div>

      {/* main header with logo */}
      <div className="main-header">
        <div className="main-header-inner">
          <div className="logo-area">
            <div className="logo-circle">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10"
                alt="College Logo"
                className="logo-img"
              />
            </div>
            <div className="logo-text">
              <p className="society-name">Satara Education Society's</p>
              <h1 className="college-name">Satara Polytechnic, Satara</h1>
              <p className="address-line">At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra</p>
              <p className="affiliation-line">Approved by AICTE Delhi, DTE Maharashtra State, Affiliated to MSBTE, Mumbai</p>
              <p className="motto">"Jai Jagat, Jai Bharat"</p>
            </div>
          </div>
        </div>
      </div>

      {/* nav bar */}
      <nav className="main-nav">
        <div className="nav-inner">
          {/* hamburger for mobile */}
          <button
            className={`hamburger ${mobileOpen ? 'is-active' : ''}`}
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setMobileExpanded(null);
            }}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-list ${mobileOpen ? 'mobile-open' : ''}`}>
            {menuData.map((item, idx) => (
              <li
                key={idx}
                className={`nav-item ${item.children ? 'has-dropdown' : ''} ${openMenu === idx ? 'active' : ''}`}
                onMouseEnter={() => (item.children || item.type === 'multi-column') && handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                {item.type === 'multi-column' ? (
                  <>
                    <button
                      className="nav-link dropdown-toggle"
                      onClick={() => {
                        if (mobileOpen) toggleMobile(idx);
                      }}
                    >
                      {item.label}
                      <span className="arrow">▾</span>
                    </button>
                    <div
                      className={`dropdown-multi ${
                        openMenu === idx || (mobileOpen && mobileExpanded === idx) ? 'show' : ''
                      }`}
                    >
                      {item.columns.map((col, cIdx) => (
                        <div className="dropdown-col" key={cIdx}>
                          <span className="dropdown-col-header">{col.header}</span>
                          <ul className="dropdown-col-list">
                            {col.items.map((child, iIdx) => (
                              <li key={iIdx}>
                                <a href={child.link} onClick={() => setMobileOpen(false)}>
                                  {child.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                ) : item.children ? (
                  <>
                    <button
                      className="nav-link dropdown-toggle"
                      onClick={() => {
                        if (mobileOpen) toggleMobile(idx);
                      }}
                    >
                      {item.label}
                      <span className="arrow">▾</span>
                    </button>
                    <ul
                      className={`dropdown-menu ${
                        openMenu === idx || (mobileOpen && mobileExpanded === idx) ? 'show' : ''
                      }`}
                    >
                      {item.children.map((child, cIdx) => (
                        <li key={cIdx}>
                          {child.type === 'header' ? (
                            <span className="dropdown-header">{child.label}</span>
                          ) : (
                            <a href={child.link} onClick={() => setMobileOpen(false)}>
                              {child.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a href={item.link} className="nav-link">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
