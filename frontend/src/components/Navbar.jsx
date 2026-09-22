import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    stack: true,
    columns: [
      {
        header: 'About',
        items: [
          { label: 'Satara Education Society', link: '/about/society' },
          { label: 'Institute', link: '/about/institute' },
          { label: 'Mandatory Disclosure', link: '/about/disclosure' },
          { label: 'Affiliation & Approval', link: '/about/affiliation' },
          { label: 'Institute Policy', link: '/about/policy' },
          { label: 'Organisational Chart', link: '/about/organisational-chart' },
          { label: 'Code of Conduct', link: '/about/code-of-conduct' },
        ],
      },
      {
        header: 'Administration',
        items: [
          { label: "Registrar's Desk", link: '/campus/registrar' },
          { label: 'Office Staff', link: '/campus/office-staff' },
          { label: 'Non Teaching Staff', link: '/campus/non-teaching-staff' },
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
    label: 'Departments',
    match: (p) => p.startsWith('/departments'),
    columns: [
      {
        header: 'Departments',
        key: 'departments',
      },
    ],
  },
  {
    label: 'Committees',
    match: (p) => p.startsWith('/academics') || p.startsWith('/cells'),
    columns: [
      {
        header: 'Cells & Committees',
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
    label: 'Placements',
    match: (p) => p.startsWith('/placements'),
    children: [
      { label: 'About Placement Cell', link: '/placements/about' },
      { label: 'Placement Process', link: '/placements/process' },
      { label: 'Placement Records', link: '/placements/records' },
      { label: 'Our Recruiters', link: '/placements/recruiters' },
    ],
  },
  {
    label: 'Life@SPS',
    stack: true,
    match: (p) => p.startsWith('/activities') || p.startsWith('/campus') || p.startsWith('/gallery'),
    columns: [
      {
        header: 'Activities',
        items: [
          { label: 'Sports', link: '/activities/sports' },
          { label: 'Cultural', link: '/activities/cultural' },
          { label: 'Technical Events', link: '/activities/technical' },
          { label: 'Industrial Visits', link: '/activities/industrial-visits' },
          { label: 'Competitions', link: '/activities/competitions' },
        ],
      },
      {
        header: 'Facilities',
        items: [
          { label: 'Library', link: '/campus/library' },
          { label: 'Bus Facility', link: '/campus/bus-facility' },
          { label: 'Canteen', link: '/campus/canteen' },
          { label: 'Equal Opportunity Center', link: '/campus/equal-opportunity-center' },
          { label: 'Center of Excellence', link: '/campus/center-of-excellence' },
        ],
      },
      {
        header: 'Gallery',
        items: [
          { label: 'Photo Gallery', link: '/gallery/photos' },
          { label: 'Video Gallery', link: '/gallery/videos' },
          { label: 'Media News', link: '/gallery/media' },
        ],
      },
    ],
  },
  {
    label: 'Student Section',
    stack: true,
    match: (p) => p.startsWith('/alumni') || p.startsWith('/examination'),
    columns: [
      {
        header: 'Examination',
        items: [
          { label: 'Academic Calendar', link: '/academics/calendar' },
          { label: 'Exam Schedule', link: '/examination/schedule' },
          { label: 'Exam Rules', link: '/examination/rules' },
          { label: 'Exam Form', link: '/examination/examform' },
          { label: 'Results', link: '/examination/results' },
          { label: 'Revaluation', link: '/examination/revaluation' },
          { label: 'Exam Notices', link: '/examination/notices' },
        ],
      },
      {
        header: 'Alumni',
        items: [
          { label: 'About Alumni', link: '/alumni/about' },
          { label: 'Alumni Vision & Mission', link: '/alumni/vision-mission' },
          { label: 'Entrepreneurs', link: '/alumni/entrepreneurs' },
          { label: 'Alumni Association', link: '/alumni/association' },
          { label: 'Alumni Registration Form', link: '/alumni/registration' },
        ],
      },
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
  const [dbCells, setDbCells] = useState([]);
  const [dbDepts, setDbDepts] = useState([]);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Real contact details (previously placeholder numbers).
  const PHONE = '+91-94233 42843';
  const EMAIL = 'satarapolyinfo@gmail.com';

  // Fetch cells & departments for the dropdowns. Uses exponential backoff
  // because a cold-started backend (Render free tier) can take ~1 min to
  // answer the first request; without retry the dropdowns fall back to
  // static links for the whole session.
  useEffect(() => {
    let cancelled = false;

    const fetchWithRetry = (url, apply, label, attempt = 0) => {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`${label} ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!cancelled && Array.isArray(data)) apply(data);
        })
        .catch((err) => {
          if (attempt < 5 && !cancelled) {
            setTimeout(() => fetchWithRetry(url, apply, label, attempt + 1), 2500 * 2 ** attempt);
          } else {
            console.error(`Failed to fetch ${label} for navbar:`, err);
          }
        });
    };

    fetchWithRetry(`${API_URL}/cells`, setDbCells, 'cells');
    fetchWithRetry(`${API_URL}/departments`, setDbDepts, 'departments');

    return () => {
      cancelled = true;
    };
  }, []);  // Close any open menu when the route changes.
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

  // Top-bar search results close on outside click.
  useEffect(() => {
    if (!showResults) return undefined;
    const onClick = (e) => {
      if (!e.target.closest('.top-search-wrap')) setShowResults(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [showResults]);

  const toggleMobile = (index) => setMobileExpanded(mobileExpanded === index ? null : index);

  // Resolve the dynamic column items (departments / cells from the database).
  const resolveColumnItems = (col) => {
    if (col.key === 'departments') {
      const deptItems = dbDepts.map((d) => ({ label: d.name, link: `/departments/${d.slug}` }));
      return deptItems.length > 0
        ? deptItems
        : [
            { label: 'Computer Engineering', link: '/departments/computer' },
            { label: 'Electronics & Telecom', link: '/departments/etc' },
            { label: 'Mechanical Engineering', link: '/departments/mechanical' },
            { label: 'Electrical Engineering', link: '/departments/electrical' },
            { label: 'Chemical Engineering', link: '/departments/chemical' },
            { label: 'Automobile Engineering', link: '/departments/auto' },
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

  // Flatten the full menu (plus DB-driven departments & cells) into a
  // searchable index of { label, link, section } entries.
  const searchIndex = useMemo(() => {
    const seen = new Set();
    const entries = [];
    const push = (label, link, section) => {
      if (!label || !link || seen.has(link)) return;
      seen.add(link);
      entries.push({ label, link, section });
    };
    MENU.forEach((item) => {
      push(item.label, item.link);
      (item.children || []).forEach((c) => push(c.label, c.link, item.label));
      (item.columns || []).forEach((col) => {
        resolveColumnItems(col).forEach((c) => push(c.label, c.link, col.header));
      });
    });
    return entries;
  }, [dbCells, dbDepts]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((e) => e.label.toLowerCase().includes(q) || (e.section || '').toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchIndex, query]);

  const handleSearchSelect = (link) => {
    setShowResults(false);
    setQuery('');
    navigate(link);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) handleSearchSelect(searchResults[0].link);
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
          <div className={`dropdown-multi ${item.stack ? 'dropdown-stacked' : ''} ${openMenu === idx || (mobileOpen && mobileExpanded === idx) ? 'show' : ''}`}>
            {item.columns.map((col, cIdx) => (
              <div
                className={`dropdown-col ${col.wide ? 'dropdown-col-wide' : ''} ${col.semiWide ? 'dropdown-col-semi-wide' : ''} ${col.key ? `dropdown-col-${col.key}` : ''}`}
                key={cIdx}
              >
                <span className="dropdown-col-header">{col.header}</span>
                <ul className="dropdown-col-list">{renderDropdownItems(resolveColumnItems(col))}</ul>
              </div>
            ))}
            {item.footer && (
              <div className="dropdown-footer">
                <Link to={item.footer.link} onClick={() => setMobileOpen(false)}>
                  <span className="footer-icon" aria-hidden="true">📅</span>
                  <span className="footer-text">
                    <span className="footer-title">{item.footer.label}</span>
                    {item.footer.desc && <span className="footer-desc">{item.footer.desc}</span>}
                  </span>
                  <span className="footer-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
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
    <header className="site-header">
      {/* top strip */}
      <div className="top-strip">
        <div className="top-strip-inner">
          <span className="top-left">
            <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="top-strip-link">
              <span aria-hidden="true">📞</span> {PHONE}
            </a>
          </span>
          <form className="top-search-wrap" role="search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="top-search-input"
              placeholder="Search pages…"
              aria-label="Search site"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => e.key === 'Escape' && setShowResults(false)}
            />
            <button type="submit" className="top-search-btn" aria-label="Search">
              <span aria-hidden="true">🔍</span>
            </button>
            {showResults && query.trim() && (
              <ul className="top-search-results">
                {searchResults.length === 0 ? (
                  <li className="top-search-empty">No matching pages found</li>
                ) : (
                  searchResults.map((r) => (
                    <li key={r.link}>
                      <button type="button" onClick={() => handleSearchSelect(r.link)}>
                        <span className="result-label">{r.label}</span>
                        {r.section && <span className="result-section">{r.section}</span>}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </form>
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
                width="56"
                height="56"
              />
            </div>
            <div className="logo-text">
              <p className="society-name">Satara Education Society's</p>
              <h1 className="college-name">Satara Polytechnic, Satara</h1>
            </div>
          </Link>

          {/* Hamburger joins the identity row on mobile: logo -> name -> ☰ */}
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

          <nav className="main-nav" aria-label="Primary">
            <div className="nav-inner">
              <ul className={`nav-list ${mobileOpen ? 'mobile-open' : ''}`}>
                {mobileOpen && (
                  <li className="mobile-search-item">
                    <form className="top-search-wrap mobile-search" role="search" onSubmit={handleSearchSubmit}>
                      <input
                        type="search"
                        className="top-search-input"
                        placeholder="Search pages…"
                        aria-label="Search site"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setShowResults(true);
                        }}
                        onKeyDown={(e) => e.key === 'Escape' && setShowResults(false)}
                      />
                      <button type="submit" className="top-search-btn" aria-label="Search">
                        <span aria-hidden="true">🔍</span>
                      </button>
                      {showResults && query.trim() && (
                        <ul className="top-search-results">
                          {searchResults.length === 0 ? (
                            <li className="top-search-empty">No matching pages found</li>
                          ) : (
                            searchResults.map((r) => (
                              <li key={r.link}>
                                <button type="button" onClick={() => handleSearchSelect(r.link)}>
                                  <span className="result-label">{r.label}</span>
                                  {r.section && <span className="result-section">{r.section}</span>}
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </form>
                  </li>
                )}
                {MENU.map((item, idx) => renderMenuItem(item, idx))}
              </ul>
            </div>
          </nav>

          {/* Backdrop is a direct child of the header (outside .main-nav, which
              is display:none on mobile) so the dim layer still renders. */}
          {mobileOpen && <div className="nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
