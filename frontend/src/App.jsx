import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// Lazy-loaded page components for code splitting
const ImageSlider = lazy(() => import('./components/ImageSlider'));
const NoticeTicker = lazy(() => import('./components/NoticeTicker'));
const WelcomeSection = lazy(() => import('./components/WelcomeSection'));
const Departments = lazy(() => import('./components/Departments'));
const Recruiters = lazy(() => import('./components/Recruiters'));
const ContactMap = lazy(() => import('./components/ContactMap'));
const AboutCollege = lazy(() => import('./pages/AboutCollege'));
const Academics = lazy(() => import('./pages/Academics'));
const DepartmentsPage = lazy(() => import('./pages/Departments'));
const CellsPage = lazy(() => import('./pages/CellsPage'));
const CellDetail = lazy(() => import('./pages/CellDetail'));
const PhotoGallery = lazy(() => import('./pages/PhotoGallery'));
const VideoGallery = lazy(() => import('./pages/VideoGallery'));
const MediaNews = lazy(() => import('./pages/MediaNews'));
const Admissions = lazy(() => import('./pages/Admissions'));
const ApplyNow = lazy(() => import('./pages/ApplyNow'));
const Placements = lazy(() => import('./pages/Placements'));
const Examinations = lazy(() => import('./pages/Examinations'));
const Campus = lazy(() => import('./pages/Campus'));
const Activities = lazy(() => import('./pages/Activities'));
const Notices = lazy(() => import('./pages/Notices'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCells = lazy(() => import('./pages/AdminCells'));
const AdminCellForm = lazy(() => import('./pages/AdminCellForm'));
const AdminDepartments = lazy(() => import('./pages/AdminDepartments'));
const AdminDepartmentForm = lazy(() => import('./pages/AdminDepartmentForm'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminPlacements = lazy(() => import('./pages/AdminPlacements'));
const AdminNotices = lazy(() => import('./pages/AdminNotices'));
const AdminManagement = lazy(() => import('./pages/AdminManagement'));
const AdminAbout = lazy(() => import('./pages/AdminAbout'));
const AdminAdmissions = lazy(() => import('./pages/AdminAdmissions'));
const AdminExaminations = lazy(() => import('./pages/AdminExaminations'));
const AdminCampus = lazy(() => import('./pages/AdminCampus'));
const AdminActivities = lazy(() => import('./pages/AdminActivities'));

// Loading fallback with skeleton
function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton skeleton-block" style={{ width: 200, height: 12, margin: '0 auto 12px' }} />
        <div className="skeleton skeleton-text" style={{ width: 140, height: 10, margin: '0 auto' }} />
      </div>
    </div>
  );
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
          alternateName: 'Shri Polytechnic, Satara',
          url: 'https://sfrppolytechnic.ac.in',
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
      <Departments />
      <Recruiters />
      <ContactMap />
    </Suspense>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

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
          <Route path="/notices/:category" element={<Notices />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/placements/:page" element={<Placements />} />
          <Route path="/examination" element={<Examinations />} />
          <Route path="/examination/:page" element={<Examinations />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/campus/:page" element={<Campus />} />
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
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
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
  const [showLoading, setShowLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [loadingEnabled, setLoadingEnabled] = useState(true);

  // Fetch loading screen setting on mount
  useEffect(() => {
    fetch('/api/settings/loadingScreen')
      .then((r) => r.json())
      .then((data) => {
        if (data.value !== null && data.value !== undefined) {
          setLoadingEnabled(data.value);
        }
      })
      .catch(() => {}) // keep default true on error
      .finally(() => setSettingsLoaded(true));
  }, []);

  // Trigger loading screen on every homepage visit (only after settings loaded)
  useEffect(() => {
    if (settingsLoaded && location.pathname === '/' && loadingEnabled) {
      setShowLoading(true);
      setLoadingKey((k) => k + 1);
    }
  }, [location.pathname, loadingEnabled, settingsLoaded]);

  const handleLoadingComplete = useCallback(() => setShowLoading(false), []);

  return (
    <> 
      {showLoading && <LoadingScreen key={loadingKey} onComplete={handleLoadingComplete} />}
      <AppLayout />
    </>
  );
}

export default App;
