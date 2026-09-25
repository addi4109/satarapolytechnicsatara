import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GoToTop from './components/GoToTop';
import EnquiryPopup from './components/EnquiryPopup';
import { initScrollReveal, startScrollRevealWatcher } from './lib/scrollReveal';
import { initSmoothScroll, destroySmoothScroll, scrollToTopImmediate } from './lib/smoothScroll';

// Deploy-safe lazy loader.
//
// Each deploy renames the hashed files in /assets (e.g. CellsPage-tR18qlJv.css).
// A tab opened before the deploy still runs the old JS, which requests assets
// that no longer exist and fails with "Unable to preload CSS" or "Failed to
// fetch dynamically imported module". Reloading once fetches the new
// index.html, whose script references the current hashed files.
//
// Reload-loop safety: only *fetch/preload* failures trigger a reload (never
// bare TypeErrors from module evaluation), and a time-window lock allows at
// most one recovery reload per 30s. The lock is intentionally NOT cleared on
// successful imports — clearing it lets a persistently failing chunk alternate
// with a succeeding one and reload the page forever.
const CHUNK_RELOAD_KEY = 'chunk-reload-attempted-at';
const CHUNK_RELOAD_LOCK_MS = 30000;

const STALE_CHUNK_PATTERN =
  /Unable to preload|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

function hasRecentChunkReload() {
  try {
    const at = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY));
    return Number.isFinite(at) && Date.now() - at < CHUNK_RELOAD_LOCK_MS;
  } catch {
    // Storage unavailable: assume we already tried to avoid reload loops.
    return true;
  }
}

function markChunkReload() {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures.
  }
}

function lazyWithRetry(factory) {
  return lazy(() =>
    factory().catch((error) => {
      const message = error?.message ?? '';
      const isStaleChunk = STALE_CHUNK_PATTERN.test(message);
      if (isStaleChunk && !hasRecentChunkReload()) {
        markChunkReload();
        window.location.reload();
      }
      throw error;
    }),
  );
}

// Lazy-loaded page components for code splitting
const ImageSlider = lazyWithRetry(() => import('./components/ImageSlider'));
const NoticeTicker = lazyWithRetry(() => import('./components/NoticeTicker'));
const WelcomeSection = lazyWithRetry(() => import('./components/WelcomeSection'));
const Departments = lazyWithRetry(() => import('./components/Departments'));
const Facilities = lazyWithRetry(() => import('./components/Facilities'));
const PlacementRecordBanner = lazyWithRetry(() => import('./components/PlacementRecordBanner'));
const Recruiters = lazyWithRetry(() => import('./components/Recruiters'));
const LatestNews = lazyWithRetry(() => import('./components/LatestNews'));
const ContactMap = lazyWithRetry(() => import('./components/ContactMap'));
const AboutCollege = lazyWithRetry(() => import('./pages/AboutCollege'));
const Academics = lazyWithRetry(() => import('./pages/Academics'));
const DepartmentsPage = lazyWithRetry(() => import('./pages/Departments'));
const CellsPage = lazyWithRetry(() => import('./pages/CellsPage'));
const CellDetail = lazyWithRetry(() => import('./pages/CellDetail'));
const PhotoGallery = lazyWithRetry(() => import('./pages/PhotoGallery'));
const VideoGallery = lazyWithRetry(() => import('./pages/VideoGallery'));
const MediaNews = lazyWithRetry(() => import('./pages/MediaNews'));
const Admissions = lazyWithRetry(() => import('./pages/Admissions'));
const ApplyNow = lazyWithRetry(() => import('./pages/ApplyNow'));
const Placements = lazyWithRetry(() => import('./pages/Placements'));
const Examinations = lazyWithRetry(() => import('./pages/Examinations'));
const Campus = lazyWithRetry(() => import('./pages/Campus'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const Activities = lazyWithRetry(() => import('./pages/Activities'));
const Notices = lazyWithRetry(() => import('./pages/Notices'));
const AdmissionNotices = lazyWithRetry(() => import('./pages/AdmissionNotices'));
const Alumni = lazyWithRetry(() => import('./pages/Alumni'));
const AdminLogin = lazyWithRetry(() => import('./pages/AdminLogin'));
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'));
const AdminCells = lazyWithRetry(() => import('./pages/AdminCells'));
const AdminCellForm = lazyWithRetry(() => import('./pages/AdminCellForm'));
const AdminDepartments = lazyWithRetry(() => import('./pages/AdminDepartments'));
const AdminDepartmentForm = lazyWithRetry(() => import('./pages/AdminDepartmentForm'));
const AdminGallery = lazyWithRetry(() => import('./pages/AdminGallery'));
const AdminPlacements = lazyWithRetry(() => import('./pages/AdminPlacements'));
const AdminNotices = lazyWithRetry(() => import('./pages/AdminNotices'));
const AdminManagement = lazyWithRetry(() => import('./pages/AdminManagement'));
const AdminAbout = lazyWithRetry(() => import('./pages/AdminAbout'));
const AdminAdmissions = lazyWithRetry(() => import('./pages/AdminAdmissions'));
const AdminExaminations = lazyWithRetry(() => import('./pages/AdminExaminations'));
const AdminCampus = lazyWithRetry(() => import('./pages/AdminCampus'));
const AdminActivities = lazyWithRetry(() => import('./pages/AdminActivities'));
const AdminContact = lazyWithRetry(() => import('./pages/AdminContact'));
const AdminEnquiries = lazyWithRetry(() => import('./pages/AdminEnquiries'));
const AdminFeedbacks = lazyWithRetry(() => import('./pages/AdminFeedbacks'));
const AdminAlumni = lazyWithRetry(() => import('./pages/AdminAlumni'));

// Loading fallback
function PageLoader() {
  return <div style={{ minHeight: '60vh' }} />;
}

function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SEO
        title="Satara Polytechnic, Satara | Premier Diploma Engineering College"
        description="Satara Polytechnic, Satara is a premier diploma engineering institute affiliated to MSBTE, Mumbai. Offering 6 engineering branches - Computer, ETC, Mechanical, Chemical, Electrical & Automobile. Excellent placement record and experienced faculty."
        keywords="Satara Polytechnic, diploma college Satara, engineering college Satara, polytechnic admission, MSBTE affiliated, diploma engineering, Satara polytechnic admission"
        url="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'Satara Polytechnic, Satara',
          alternateName: 'Satara Polytechnic, Satara',
          url: 'https://satarapolytechnicsatara.com',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Satara',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9309919088',
            contactType: 'admissions',
            availableLanguage: ['English', 'Hindi', 'Marathi'],
          },
        }}
      />
      <ImageSlider />
      <NoticeTicker />
      <WelcomeSection />
      <Facilities />
      <Departments />
      <PlacementRecordBanner />
      <Recruiters />
      <LatestNews />
      <ContactMap />
    </Suspense>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Inertial (Lenis) scrolling on public pages; admin keeps native scroll.
  useEffect(() => {
    if (isAdmin) return undefined;
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, [isAdmin]);

  // Scroll to top on every route change (skip admin, which manages its own layout).
  useEffect(() => {
    if (!isAdmin) {
      scrollToTopImmediate();
    }
  }, [location.pathname, isAdmin]);

  // Global scroll-reveal engine: animates [data-reveal] elements into view.
  // Idempotent; the watcher picks up lazily-mounted pages automatically.
  useEffect(() => {
    initScrollReveal();
    startScrollRevealWatcher();
  }, []);

  return (
    <>
      {!isAdmin && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about/:page" element={<AboutCollege />} />
          <Route path="/cells" element={<CellsPage />} />
          <Route path="/cells/:cellId" element={<CellDetail />} />
          <Route path="/admissions/apply" element={<ApplyNow />} />
          <Route path="/admissions/:page" element={<Admissions />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/admission" element={<AdmissionNotices />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/alumni/:page" element={<Alumni />} />
          <Route path="/notices/:category" element={<Notices />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/placements/:page" element={<Placements />} />
          <Route path="/examination" element={<Examinations />} />
          <Route path="/examination/:page" element={<Examinations />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/campus/:page" element={<Campus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/:page" element={<Contact />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:page" element={<Activities />} />
          <Route path="/gallery/photos" element={<PhotoGallery />} />
          <Route path="/gallery/videos" element={<VideoGallery />} />
          <Route path="/gallery/media" element={<MediaNews />} />
          <Route path="/academics/:page" element={<Academics />} />
          <Route path="/departments/computer" element={<DepartmentsPage />} />
          <Route path="/departments/:deptId" element={<DepartmentsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cells" element={<AdminCells />} />
          <Route path="/admin/cells/new" element={<AdminCellForm />} />
          <Route path="/admin/cells/edit/:id" element={<AdminCellForm />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/departments/new" element={<AdminDepartmentForm />} />
          <Route path="/admin/departments/edit/:id" element={<AdminDepartmentForm />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/placements" element={<AdminPlacements />} />
          <Route path="/admin/about" element={<AdminAbout />} />
          <Route path="/admin/admissions" element={<AdminAdmissions />} />
          <Route path="/admin/management" element={<AdminManagement />} />
          <Route path="/admin/notices" element={<AdminNotices />} />
          <Route path="/admin/examinations" element={<AdminExaminations />} />
          <Route path="/admin/campus" element={<AdminCampus />} />
          <Route path="/admin/activities" element={<AdminActivities />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
          <Route path="/admin/alumni" element={<AdminAlumni />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <GoToTop />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWithLoader />
    </BrowserRouter>
  );
}

function AppWithLoader() {
  const location = useLocation();
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setTimeout(() => setShowEnquiry(true), 800);
    }
  }, [location.pathname]);

  return (
    <>
      {showEnquiry && <EnquiryPopup onClose={() => setShowEnquiry(false)} />}
      <AppLayout />
    </>
  );
}

export default App;
