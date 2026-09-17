import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

import API_URL from '../lib/api';

// Static menu model. Departments & Cells are merged in from the API at runtime,
// so items managed in the admin panel keep appearing automatically.
// `match` = URL test used to highlight the active section.
const MENU = [
  {
    label: 'Home',
    link: '/',
    match: (p) => p === '/',
  },
  {
    label: 'About',
    match: (p) => p.startsWith('/about'),
    columns: [
      {
        header: 'About',
        items: [
          { label: 'Satara Education Society', link: '/about/society' },
          { label: 'Institute', link: '/about/institute' },
          { label: 'Mandatory Disclosure', link: '/about/disclosure' },
          { label: 'Vision & Mission', link: '/about/vision-mission' },
          { label: 'Affiliation & Approval', link: '/about/affiliation' },
          { label: 'Institute Policy', link: '/about/policy' },
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
          { label: 'Local Governing Body', link: '/about/local-governing-body' },
        ],
      },
    ],
  },
  {
    label: 'Academics',
    match: (p) => p.startsWith('/departments') || p.startsWith('/academics') || p.startsWith('/cells'),
    columns: [
      {
        header: 'Departments',
        semiWide: true,
        key: 'departments',
      },
      {
        header: 'Cells & Committees',
        wide: true,
        key: 'cells',
      },
    ],
  },
  {
    label: 'Admissions',
    match: (p) => p.startsWith('/admissions'),
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
    label: 'Campus',
    match: (p) => p.startsWith('/campus'),
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
    label: 'Placements',
    match: (p) => p.startsWith('/placements'),
    children: [
      { label: 'About Placement Cell', link: '/cells/placement' },
      { label: 'Placement Process', link: '/placements/process' },
      { label: 'Placement Records', link: '/placements/records' },
      { label: 'Our Recruiters', link: '/placements/recruiters' },
    ],
  },
  {
    label: 'Alumni',
    match: (p) => p.startsWith('/alumni'),
    children: [
      { label: 'About Alumni', link: '/alumni/about' },
      { label: 'Alumni Vision & Mission', link: '/alumni/vision-mission' },
      { label: 'Entrepreneurs', link: '/alumni/entrepreneurs' },
      { label: 'Alumni Association', link: '/alumni/association' },
      { label: 'Alumni Registration Form', link: '/alumni/registration' },
    ],
  },
  {
    label: 'Activities',
    match: (p) => p.startsWith('/activities'),
    children: [
      { label: 'Sports', link: '/activities/sports' },
      { label: 'Cultural', link: '/activities/cultural' },
      { label: 'Technical Events', link: '/activities/technical' },
      { label: 'Industrial Visits', link: '/activities/industrial-visits' },
      { label: 'Competitions', link: '/activities/competitions' },
    ],
  },
  {
    label: 'Examination',
    match: (p) => p.startsWith('/examination'),
    children: [
      { label: 'Exam Schedule', link: '/examination/schedule' },
      { label: 'Exam Rules', link: '/examination/rules' },
      { label: 'Results', link: '/examination/results' },
      { label: 'Revaluation', link: '/examination/revaluation' },
      { label: 'Exam Notices', link: '/examination/notices' },
    ],
  },
  {
    label: 'Gallery',
    match: (p) => p.startsWith('/gallery'),
    children: [
      { label: 'Photo Gallery', link: '/gallery/photos' },
      { label: 'Video Gallery', link: '/gallery/videos' },
      { label: 'Media News', link: '/gallery/media' },
    ],
  },
  {
    label: 'Notices',
    link: '/notices',
    match: (p) => p.startsWith('/notices'),
  },
  {
    label: 'Contact',
    match: (p) => p.startsWith('/contact'),
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

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dbCells, setDbCells] = useState([]);
  const [dbDepts, setDbDepts] = useState([]);
  const location = useLocation();

  // Real contact details (previously placeholder numbers).
  const PHONE = '+91-94233 42843';
  const EMAIL = 'satarapolyinfo@gmail.com';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close any open menu when the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setOpenMenu(null);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Desktop dropdowns close on outside click and Escape.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onClick = () => setOpenMenu(null);
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const toggleMobile = (index) => setMobileExpanded(mobileExpanded === index ? null : index);

  // Resolve the dynamic column items (departments / cells from the database).
  const resolveColumnItems = (col) => {
    if (col.key === 'departments') {
      const deptItems = dbDepts.map((d) => ({ label: d.name, link: `/departments/${d.slug}` }));
      return deptItems.length > 0
        ? [...deptItems, { divider: true }, { title: 'Academic Calendar' }, { label: 'Academic Calendar', link: '/academics/calendar' }]
        : [
            { label: 'Computer Engineering', link: '/departments/computer' },
            { label: 'Electronics & Telecom', link: '/departments/etc' },
            { label: 'Mechanical Engineering', link: '/departments/mechanical' },
            { label: 'Electrical Engineering', link: '/departments/electrical' },
            { label: 'Chemical Engineering', link: '/departments/chemical' },
            { label: 'Automobile Engineering', link: '/departments/auto' },
            { divider: true },
            { title: 'Academic Calendar' },
            { label: 'Academic Calendar', link: '/academics/calendar' },
          ];
    }
    if (col.key === 'cells') {
      const cellItems = dbCells.map((c) => ({ label: c.name, link: `/cells/${c.slug}` }));
      return cellItems.length > 0
        ? [{ label: 'About Cells and Committees', link: '/cells' }, ...cellItems]
        : [{ label: 'About Cells and Committees', link: '/cells' }];
    }
    return col.items || [];
  };

  const renderDropdownItems = (items) =>
    items.map((child, iIdx) => (
      <li key={iIdx}>
        {child.divider ? (
          <span className="dropdown-col-divider" />
        ) : child.title ? (
          <span className="dropdown-col-title">{child.title}</span>
        ) : (
          <Link to={child.link} onClick={() => setMobileOpen(false)}>
            {child.label}
          </Link>
        )}
      </li>
    ));

  const renderMenuItem = (item, idx) => {
    const hasDropdown = item.children || item.columns;
    const isActive = item.match ? item.match(location.pathname) : false;

    if (item.columns) {
      return (
        <li
          key={idx}
          className={`nav-item has-dropdown ${openMenu === idx ? 'active' : ''} ${isActive ? 'current' : ''}`}
          onMouseEnter={() => setOpenMenu(idx)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            className="nav-link dropdown-toggle"
            aria-expanded={openMenu === idx}
            aria-haspopup="true"
            onClick={() => (mobileOpen ? toggleMobile(idx) : setOpenMenu(openMenu === idx ? null : idx))}
          >
            {item.label}
            <span className="arrow" aria-hidden="true">▾</span>
          </button>
          <div className={`dropdown-multi ${openMenu === idx || (mobileOpen && mobileExpanded === idx) ? 'show' : ''}`}>
            {item.columns.map((col, cIdx) => (
              <div
                className={`dropdown-col ${col.wide ? 'dropdown-col-wide' : ''} ${col.semiWide ? 'dropdown-col-semi-wide' : ''}`}
                key={cIdx}
              >
                <span className="dropdown-col-header">{col.header}</span>
                <ul className="dropdown-col-list">{renderDropdownItems(resolveColumnItems(col))}</ul>
              </div>
            ))}
          </div>
        </li>
      );
    }

    if (item.children) {
      return (
        <li
          key={idx}
          className={`nav-item has-dropdown ${openMenu === idx ? 'active' : ''} ${isActive ? 'current' : ''}`}
          onMouseEnter={() => setOpenMenu(idx)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            className="nav-link dropdown-toggle"
            aria-expanded={openMenu === idx}
            aria-haspopup="true"
            onClick={() => (mobileOpen ? toggleMobile(idx) : setOpenMenu(openMenu === idx ? null : idx))}
          >
            {item.label}
            <span className="arrow" aria-hidden="true">▾</span>
          </button>
          <ul className={`dropdown-menu ${openMenu === idx || (mobileOpen && mobileExpanded === idx) ? 'show' : ''}`}>
            {item.children.map((child, cIdx) => (
              <li key={cIdx}>
                {child.type === 'header' ? (
                  <span className="dropdown-header">{child.label}</span>
                ) : (
                  <Link to={child.link} onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={idx} className={`nav-item ${isActive ? 'current' : ''}`}>
        <Link to={item.link} className="nav-link">
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      {/* top strip */}
      <div className="top-strip">
        <div className="top-strip-inner">
          <span className="top-left">
            <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="top-strip-link">
              <span aria-hidden="true">📞</span> {PHONE}
            </a>
          </span>
          <span className="top-right">
            <a href={`mailto:${EMAIL}`} className="top-strip-link">
              <span aria-hidden="true">✉</span> {EMAIL}
            </a>
          </span>
        </div>
      </div>

      {/* single-bar header: identity block on the left, tabs in front */}
      <div className="main-header">
        <div className="main-header-inner">
          <Link to="/" className="logo-area" aria-label="Satara Polytechnic, Satara — Home">
            <div className="logo-circle">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10"
                alt="College Logo"
                className="logo-img"
                width="72"
                height="72"
              />
            </div>
            <div className="logo-text">
              <p className="society-name">Satara Education Society's</p>
              <h1 className="college-name">Satara Polytechnic, Satara</h1>
              <p className="address-line">At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra</p>
              <p className="affiliation-line">Approved by AICTE Delhi, DTE Maharashtra State, Affiliated to MSBTE, Mumbai</p>
              <p className="motto">"Jai Jagat, Jai Bharat"</p>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Primary">
            <div className="nav-inner">
              {/* hamburger lives in the sticky bar so it stays reachable while scrolled */}
              <button
                type="button"
                className={`hamburger ${mobileOpen ? 'is-active' : ''}`}
                onClick={() => {
                  setMobileOpen(!mobileOpen);
                  setMobileExpanded(null);
                }}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <ul className={`nav-list ${mobileOpen ? 'mobile-open' : ''}`}>
                {MENU.map((item, idx) => renderMenuItem(item, idx))}
              </ul>
              {/* Backdrop lives inside the nav's stacking context so the drawer,
                  hamburger and close button all sit above it. */}
              {mobileOpen && <div className="nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
