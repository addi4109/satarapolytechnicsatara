import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';
import NoticeTicker from './components/NoticeTicker';
import WelcomeSection from './components/WelcomeSection';
import Departments from './components/Departments';
import Recruiters from './components/Recruiters';
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
import Examinations from './pages/Examinations';
import Campus from './pages/Campus';
import AdminCampus from './pages/AdminCampus';
import Activities from './pages/Activities';
import AdminActivities from './pages/AdminActivities';
import Notices from './pages/Notices';

function HomePage() {
  return (
    <>
      <ImageSlider />
      <NoticeTicker />
      <WelcomeSection />
      <Departments />
      <Recruiters />
      <ContactMap />
    </>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
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
        <Route path="/admin/placements" element={<AdminPlacements />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/examinations" element={<AdminExaminations />} />
        <Route path="/admin/campus" element={<AdminCampus />} />
        <Route path="/admin/activities" element={<AdminActivities />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
