import { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GoToTop from './components/GoToTop';
import EnquiryPopup from './components/EnquiryPopup';
import API_URL from './lib/api';
import { initScrollReveal, startScrollRevealWatcher } from './lib/scrollReveal';
import { initSmoothScroll, destroySmoothScroll, scrollToTopImmediate } from './lib/smoothScroll';

import ImageSlider from './components/ImageSlider';
import NoticeTicker from './components/NoticeTicker';
import WelcomeSection from './components/WelcomeSection';
import Departments from './components/Departments';
import PlacementRecordBanner from './components/PlacementRecordBanner';
import Recruiters from './components/Recruiters';
import LatestNews from './components/LatestNews';
import InstituteRankers from './components/InstituteRankers';
import ContactMap from './components/ContactMap';
import AboutCollege from './pages/AboutCollege';
import Academics from './pages/Academics';
import DepartmentsPage from './pages/Departments';
import CellsPage from './pages/CellsPage';
import CellDetail from './pages/CellDetail';
import PhotoGallery from './pages/PhotoGallery';
import VideoGallery from './pages/VideoGallery';
import MediaNews from './pages/MediaNews';
import Admissions from './pages/Admissions';
import ApplyNow from './pages/ApplyNow';
import Placements from './pages/Placements';
import Examinations from './pages/Examinations';
import Campus from './pages/Campus';
import Contact from './pages/Contact';
import Activities from './pages/Activities';
import Notices from './pages/Notices';
import AdmissionNotices from './pages/AdmissionNotices';
import Alumni from './pages/Alumni';
import GrievanceRedressal from './pages/GrievanceRedressal';
import OnlineGrievance from './pages/OnlineGrievance';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCells from './pages/AdminCells';
import AdminCellForm from './pages/AdminCellForm';
import AdminDepartments from './pages/AdminDepartments';
import AdminDepartmentForm from './pages/AdminDepartmentForm';
import AdminGallery from './pages/AdminGallery';
import AdminPlacements from './pages/AdminPlacements';
import AdminNotices from './pages/AdminNotices';
import AdminManagement from './pages/AdminManagement';
import AdminAbout from './pages/AdminAbout';
import AdminAdmissions from './pages/AdminAdmissions';
import AdminExaminations from './pages/AdminExaminations';
import AdminCampus from './pages/AdminCampus';
import AdminActivities from './pages/AdminActivities';
import AdminContact from './pages/AdminContact';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminFeedbacks from './pages/AdminFeedbacks';
import AdminAlumni from './pages/AdminAlumni';
import AdminRankers from './pages/AdminRankers';

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
      <div className="home-page">
        <ImageSlider />
        <NoticeTicker />
        <WelcomeSection />
        <Departments />
        <PlacementRecordBanner />
        <Recruiters />
        <LatestNews />
        <InstituteRankers />
        <ContactMap />
      </div>    </Suspense>
  );
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const prevPathRef = useRef(location.pathname);

  // Inertial (Lenis) scrolling on public pages; admin keeps native scroll.
  useEffect(() => {
    if (isAdmin) return undefined;
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, [isAdmin]);

  // Route internal <a href="/..."> clicks through the client router so pages
  // change without a full reload. External links, mail/tel, hash links,
  // new-tab links and downloads are left to the browser.
  useEffect(() => {
    function handleClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      navigate(href);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  // Scroll to top on route changes, except when moving between Life@SPS
  // sidebar pages so the reader keeps their position in the section.
  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = location.pathname;

    if (isAdmin) return;

    const isLifePath = (path) =>
      path.startsWith('/activities') ||
      path.startsWith('/campus') ||
      path.startsWith('/gallery');

    if (isLifePath(prevPath) && isLifePath(location.pathname)) return;

    scrollToTopImmediate();
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
          <Route path="/student/grievance-redressal" element={<GrievanceRedressal />} />
          <Route path="/online-grievance" element={<OnlineGrievance />} />
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
          <Route path="/admin/rankers" element={<AdminRankers />} />
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
    if (location.pathname !== '/') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/settings/enquiryPopupEnabled`);
        const data = await res.json();
        if (!cancelled && data.value !== false) setShowEnquiry(true);
      } catch {
        if (!cancelled) setShowEnquiry(true);
      }
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <>
      {showEnquiry && <EnquiryPopup onClose={() => setShowEnquiry(false)} />}
      <AppLayout />
    </>
  );
}

export default App;
