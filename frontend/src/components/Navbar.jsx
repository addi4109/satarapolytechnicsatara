import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

import API_URL from '../lib/api';

/*
 * Navigation model
 * ----------------
 * type: 'link'     direct tab
 * type: 'dropdown' single-column dropdown (children)
 * type: 'mega'     multi-column mega menu (columns), optional footer strip
 * size: 'sm' | 'md' | 'lg' controls panel width
 *
 * Departments & Cells items are merged from the admin database at runtime;
 * static lists below are only fallbacks (same mechanism as before).
 */
const MENU = [
  {
    type: 'link',
    label: 'Home',
    link: '/',
    match: (p) => p === '/',
  },
  {
    type: 'mega',
    label: 'About',
    size: 'md',
    match: (p) => p.startsWith('/about'),
    columns: [
      {
        header: 'About',
        items: [
          { label: 'Satara Education Society', link: '/about/society' },
          { label: 'Institute', link: '/about/institute' },
          { label: 'Vision & Mission', link: '/about/vision-mission' },
          { label: 'Affiliation & Approval', link: '/about/affiliation' },
          { label: 'Mandatory Disclosure', link: '/about/disclosure' },
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
    type: 'mega',
    label: 'Departments',
    size: 'lg',
    match: (p) => p.startsWith('/departments'),
    columns: [
      {
        header: 'Engineering Departments',
        key: 'departments',
      },
      {
        header: 'Quick Access',
        items: [
          { label: 'Department Overview', link: '/departments/computer' },
          { label: "HOD's Desk", link: '/departments/computer?tab=hod' },
          { label: 'Faculty', link: '/departments/computer?tab=faculty' },
          { label: 'Infrastructure & Labs', link: '/departments/computer?tab=infrastructure' },
          { label: 'Curriculum', link: '/departments/computer?tab=curriculum' },
        ],
      },
    ],
  },
  {
    type: 'mega',
    label: 'Academics',
    size: 'lg',
    match: (p) => p.startsWith('/academics') || p.startsWith('/cells'),
    columns: [
      {
        header: 'Academic Information',
        items: [
          { label: 'Academic Overview', link: '/academics/overview' },
          { label: 'Academic Calendar', link: '/academics/calendar' },
          { label: 'Academic Schedule', link: '/academics/timetable' },
          { label: 'Curriculum', link: '/academics/curriculum' },
          { label: 'Courses Offered', link: '/academics/courses' },
          { label: 'E-Learning', link: '/academics/elearning' },
          { label: 'Results', link: '/academics/results' },
        ],
      },
      {
        header: 'Cells & Committees',
        key: 'cells',
      },
    ],
    footer: {
      label: 'Academic Calendar',
      desc: 'MSBTE Academic Year • Exams • Holidays',
      link: '/academics/calendar',
    },
  },
  {
    type: 'dropdown',
    label: 'Admissions',
    size: 'wide',
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
    type: 'mega',
    label: 'Campus',
    size: 'md',
    compactOnly: true,
    match: (p) => p.startsWith('/campus'),
    columns: [
      {
        header: 'Facilities',
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
          { label: 'Non-Teaching Staff', link: '/campus/non-teaching-staff' },
        ],
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Placements',
    size: 'sm',
    match: (p) => p.startsWith('/placements'),
    children: [
      { label: 'About Placement Cell', link: '/cells/placement' },
      { label: 'Placement Process', link: '/placements/process' },
      { label: 'Placement Records', link: '/placements/records' },
      { label: 'Our Recruiters', link: '/placements/recruiters' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Student Life',
    size: 'sm',
    compactOnly: true,
    match: (p) => p.startsWith('/activities') || p === '/cells/nss',
    children: [
      { label: 'Sports', link: '/activities/sports' },
      { label: 'Cultural', link: '/activities/cultural' },
      { label: 'Technical Events', link: '/activities/technical' },
      { label: 'Academic Events & Activities', link: '/activities/academic-events' },
      { label: 'NSS', link: '/cells/nss' },
    ],
  },
  {
    type: 'link',
    label: 'Notices',
    link: '/notices',
    match: (p) => p.startsWith('/notices') && !p.startsWith('/notices/admission'),
  },
  {
    type: 'dropdown',
    label: 'Contact',
    size: 'sm',
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

// Pages that remain reachable but don't fit the primary bar live here.
// On narrower desktop widths, Campus and Student Life join this menu too.
const MORE_BASE = [
  { label: 'Alumni', link: '/alumni' },
  { label: 'Examination', link: '/examination' },
  { label: 'Photo Gallery', link: '/gallery/photos' },
  { label: 'Video Gallery', link: '/gallery/videos' },
  { label: 'Media News', link: '/gallery/media' },
];

// Static fallbacks — used only when the database lists are unavailable,
// mirroring the existing fallback behaviour.
const FALLBACK_DEPARTMENTS = [
  { label: 'Computer Engineering', link: '/departments/computer' },
  { label: 'Electronics & Telecommunication', link: '/departments/etc' },
  { label: 'Mechanical Engineering', link: '/departments/mechanical' },
  { label: 'Electrical Engineering', link: '/departments/electrical' },
  { label: 'Chemical Engineering', link: '/departments/chemical' },
  { label: 'Automobile Engineering', link: '/departments/auto' },
];

const FALLBACK_CELLS = [
  { label: 'Placement Cell', link: '/cells/placement' },
  { label: 'Anti-Ragging Cell', link: '/cells/anti-ragging' },
  { label: 'Grievance Cell', link: '/cells/grievance' },
  { label: 'Women Development Cell', link: '/cells/womens-grievance' },
  { label: 'SC/ST Cell', link: '/cells/sc-st' },
  { label: 'NSS', link: '/cells/nss' },
  { label: 'Internal Complaint Committee', link: '/cells/internal-committee' },
  { label: 'IQAC', link: '/cells/iqac' },
];

const APPLY_LINK = '/admissions/apply';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [dbCells, setDbCells] = useState([]);
  const [dbDepts, setDbDepts] = useState([]);
  const location = useLocation();
  const closeTimer = useRef(null);

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

  // Solid white bar + shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Narrow desktop: fold Campus & Student Life into "More" instead of
  // cramming every tab onto one line.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1400px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Close menus on route change.
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

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openWithHover = (idx) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(idx);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const toggleMobile = (idx) => setMobileExpanded(mobileExpanded === idx ? null : idx);

  // Tabs hidden from the primary bar on narrow desktops fold into More.
  const foldedItems = compact ? MENU.filter((m) => m.compactOnly) : [];
  const primaryItems = MENU.filter((m) => !m.compactOnly || !compact);

  const resolveColumnItems = (col) => {
    if (col.key === 'departments') {
      const deptItems = dbDepts.map((d) => ({ label: d.name, link: `/departments/${d.slug}` }));
      return deptItems.length > 0 ? deptItems : FALLBACK_DEPARTMENTS;
    }
    if (col.key === 'cells') {
      const cellItems = dbCells.map((c) => ({ label: c.name, link: `/cells/${c.slug}` }));
      return cellItems.length > 0
        ? [{ label: 'About Cells & Committees', link: '/cells' }, ...cellItems]
        : [{ label: 'About Cells & Committees', link: '/cells' }, ...FALLBACK_CELLS];
    }
    return col.items || [];
  };

  const renderDropdownItems = (items) =>
    items.map((child, iIdx) => (
      <li key={iIdx}>
        <Link to={child.link} onClick={() => setMobileOpen(false)}>
          {child.label}
          <span className="dd-item-chevron" aria-hidden="true">›</span>
        </Link>
      </li>
    ));

  const renderPanelFooter = (footer) => (
    <div className="dd-footer">
      <Link to={footer.link} onClick={() => setOpenMenu(null)}>
        <span className="dd-footer-icon" aria-hidden="true">📅</span>
        <span className="dd-footer-text">
          <span className="dd-footer-title">{footer.label}</span>
          {footer.desc && <span className="dd-footer-desc">{footer.desc}</span>}
        </span>
        <span className="dd-footer-arrow" aria-hidden="true">→</span>
      </Link>
    </div>
  );

  const isActive = (item) => (item.match ? item.match(location.pathname) : false);

  const renderDesktopTab = (item, idx) => {
    const active = isActive(item);
    const open = openMenu === idx;
    const nearRightEdge = idx >= primaryItems.length - 3;

    if (item.type === 'link') {
      return (
        <li key={item.label} className={`nav-tab ${active ? 'is-active' : ''}`}>
          <Link to={item.link} className="nav-tab-link">
            {item.label}
          </Link>
        </li>
      );
    }

    const hasChildren = item.type === 'dropdown';
    return (
      <li
        key={item.label}
        className={`nav-tab has-panel ${open ? 'is-open' : ''} ${active ? 'is-active' : ''}`}
        onMouseEnter={() => openWithHover(idx)}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className="nav-tab-link"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpenMenu(open ? null : idx)}
        >
          {item.label}
          <span className="chevron" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="9" height="9">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {hasChildren ? (
          <ul className={`dd dd-${item.size} ${open ? 'show' : ''} ${nearRightEdge ? 'align-right' : ''}`}>
            {renderDropdownItems(item.children)}
          </ul>
        ) : (
          <div
            className={`dd dd-mega dd-${item.size} ${open ? 'show' : ''} ${nearRightEdge ? 'align-right' : ''}`}
          >
            {item.columns.map((col) => (
              <div className="dd-col" key={col.header}>
                <span className="dd-col-header">{col.header}</span>
                <ul className="dd-col-list">{renderDropdownItems(resolveColumnItems(col))}</ul>
              </div>
            ))}
            {item.footer && renderPanelFooter(item.footer)}
          </div>
        )}
      </li>
    );
  };

  const renderMoreTab = (idx) => {
    const open = openMenu === idx;
    const active = ['/alumni', '/examination', '/gallery'].some((p) => location.pathname.startsWith(p));
    return (
      <li
        key="more"
        className={`nav-tab has-panel ${open ? 'is-open' : ''} ${active ? 'is-active' : ''}`}
        onMouseEnter={() => openWithHover(idx)}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className="nav-tab-link"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpenMenu(open ? null : idx)}
        >
          More
          <span className="chevron" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="9" height="9">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <ul className={`dd dd-sm align-right ${open ? 'show' : ''}`}>
          {MORE_BASE.map((child) => (
            <li key={child.label}>
              <Link to={child.link} onClick={() => setOpenMenu(null)}>
                {child.label}
                <span className="dd-item-chevron" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
          {foldedItems.map((section) => (
            <li key={section.label} className="dd-group">
              <span className="dd-group-header">{section.label}</span>
              <ul className="dd-group-list">
                {(section.columns
                  ? section.columns.flatMap((c) => resolveColumnItems(c))
                  : section.children
                ).map((child) => (
                  <li key={child.label}>
                    <Link to={child.link} onClick={() => setOpenMenu(null)}>
                      {child.label}
                      <span className="dd-item-chevron" aria-hidden="true">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  // Mobile drawer items — every section, regardless of desktop compact mode.
  const mobileItems = [
    ...MENU,
    { type: 'header', label: 'More' },
    ...MORE_BASE.map((i) => ({ type: 'link', label: i.label, link: i.link })),
  ];

  const renderMobileItem = (item, idx) => {
    if (item.type === 'header') {
      return <li key={`h-${idx}`} className="m-header">{item.label}</li>;
    }
    if (item.type === 'link') {
      const active = isActive(item);
      return (
        <li key={item.label} className={active ? 'is-active' : ''}>
          <Link to={item.link} className="m-link" onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
        </li>
      );
    }

    const expanded = mobileExpanded === idx;
    const subItems = item.columns
      ? item.columns.flatMap((c) => resolveColumnItems(c))
      : item.children;

    if (item.footer) {
      subItems.push({ label: 'Academic Calendar', link: item.footer.link });
    }

    return (
      <li key={item.label} className={expanded ? 'is-open' : ''}>
        <button
          type="button"
          className="m-link"
          aria-expanded={expanded}
          onClick={() => toggleMobile(idx)}
        >
          {item.label}
          <span className="m-plus" aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        <ul className={`m-sub ${expanded ? 'open' : ''}`}>
          {subItems.map((child) => (
            <li key={child.label}>
              <Link to={child.link} onClick={() => setMobileOpen(false)}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      {/* contact strip — collapses away once the page scrolls */}
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

      <div className="nav-bar">
        <div className="nav-bar-inner">
          <Link to="/" className="logo-area" aria-label="Satara Polytechnic, Satara — Home">
            <div className="logo-circle">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10"
                alt="College Logo"
                className="logo-img"
                width="54"
                height="54"
              />
            </div>
            <div className="logo-text">
              <p className="society-name">Satara Education Society's</p>
              <h1 className="college-name">Satara Polytechnic, Satara</h1>
            </div>
          </Link>

          {/* desktop tabs */}
          <nav className="desktop-nav" aria-label="Primary">
            <ul className="nav-tabs">
              {primaryItems.map((item, idx) => renderDesktopTab(item, idx))}
              {renderMoreTab(primaryItems.length)}
              <li className="nav-apply">
                <Link to={APPLY_LINK} className="apply-btn">
                  Apply Now
                </Link>
              </li>
            </ul>
          </nav>

          {/* mobile hamburger */}
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
        </div>
      </div>

      {/* mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="m-list">
          {mobileItems.map((item, idx) => renderMobileItem(item, idx))}
        </ul>
        <div className="m-apply-wrap">
          <Link to={APPLY_LINK} className="apply-btn m-apply" onClick={() => setMobileOpen(false)}>
            Apply Now
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
    </header>
  );
}

export default Navbar;
