# SPS Project — Cleanup Audit Report

Generated: September 1, 2026

---

## Definitely Required

### Frontend Core
- `frontend/package.json` — npm manifest
- `frontend/package-lock.json` — lockfile
- `frontend/vite.config.js` — Vite configuration
- `frontend/index.html` — SPA entry point
- `frontend/.env` — environment variables (NOT committed)
- `frontend/.env.example` — env template
- `frontend/.env.local.example` — local dev env template
- `frontend/.oxlintrc.json` — linter config
- `frontend/src/main.jsx` — React entry point
- `frontend/src/App.jsx` — root component with routing
- `frontend/src/index.css` — global styles
- `frontend/src/lib/api.js` — centralized API URL config
- `frontend/src/lib/adminApi.js` — admin auth helper
- `frontend/src/lib/firebase.js` — Firebase config (enquiry form)
- `frontend/src/lib/supabase.js` — Supabase config (PDF storage)
- `frontend/src/lib/siteConfig.js` — academic year, copyright year utils
- `frontend/src/data/staticContent.js` — static page content

### Frontend Components (all imported)
- `frontend/src/components/AdminAlert.jsx`
- `frontend/src/components/AdminContentCard.jsx`
- `frontend/src/components/AdminLoading.jsx`
- `frontend/src/components/AdminStaffCard.jsx`
- `frontend/src/components/AdminTabs.jsx`
- `frontend/src/components/ContactMap.jsx` + `.css`
- `frontend/src/components/DebugPanel.jsx` + `.css`
- `frontend/src/components/Departments.jsx` + `.css`
- `frontend/src/components/EnquiryPopup.jsx` + `.css`
- `frontend/src/components/FeedbackCarousel.jsx` + `.css`
- `frontend/src/components/Footer.jsx` + `.css`
- `frontend/src/components/GoToTop.jsx` + `.css`
- `frontend/src/components/ImageSlider.jsx` + `.css`
- `frontend/src/components/ImageUpload.jsx` + `.css`
- `frontend/src/components/LoadingScreen.jsx` + `.css`
- `frontend/src/components/Navbar.jsx` + `.css`
- `frontend/src/components/NoticeTicker.jsx` + `.css`
- `frontend/src/components/PageBanner.jsx` + `.css`
- `frontend/src/components/PdfUpload.jsx`
- `frontend/src/components/Recruiters.jsx` + `.css`
- `frontend/src/components/SEO.jsx`
- `frontend/src/components/Skeleton.jsx` + `.css`
- `frontend/src/components/VideoUpload.jsx`
- `frontend/src/components/WelcomeSection.jsx` + `.css`

### Frontend Pages (all lazy-loaded in App.jsx)
- `frontend/src/pages/AboutCollege.jsx` + `.css`
- `frontend/src/pages/Academics.jsx` + `.css`
- `frontend/src/pages/Activities.jsx`
- `frontend/src/pages/AdminAbout.jsx`
- `frontend/src/pages/AdminActivities.jsx`
- `frontend/src/pages/AdminAdmissions.jsx`
- `frontend/src/pages/AdminAlumni.jsx`
- `frontend/src/pages/AdminCampus.jsx`
- `frontend/src/pages/AdminCellForm.jsx`
- `frontend/src/pages/AdminCells.jsx`
- `frontend/src/pages/AdminContact.jsx`
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/AdminDepartmentForm.jsx`
- `frontend/src/pages/AdminDepartments.jsx`
- `frontend/src/pages/AdminEnquiries.jsx`
- `frontend/src/pages/AdminExaminations.jsx`
- `frontend/src/pages/AdminFeedbacks.jsx`
- `frontend/src/pages/AdminGallery.jsx`
- `frontend/src/pages/AdminLayout.jsx`
- `frontend/src/pages/AdminLogin.jsx`
- `frontend/src/pages/AdminManagement.jsx`
- `frontend/src/pages/AdminNotices.jsx`
- `frontend/src/pages/AdminPlacements.jsx`
- `frontend/src/pages/AdmissionNotices.jsx`
- `frontend/src/pages/Admissions.jsx`
- `frontend/src/pages/Alumni.jsx` + `.css`
- `frontend/src/pages/ApplyNow.jsx` + `.css`
- `frontend/src/pages/Campus.jsx`
- `frontend/src/pages/CellDetail.jsx`
- `frontend/src/pages/CellsPage.jsx` + `.css`
- `frontend/src/pages/Contact.jsx` + `.css`
- `frontend/src/pages/Departments.jsx`
- `frontend/src/pages/Examinations.jsx`
- `frontend/src/pages/MediaNews.jsx`
- `frontend/src/pages/Notices.jsx` + `.css`
- `frontend/src/pages/PhotoGallery.jsx`
- `frontend/src/pages/Placements.jsx` + `.css`
- `frontend/src/pages/VideoGallery.jsx`

### Shared CSS (imported by multiple pages)
- `frontend/src/pages/Admin.css` — shared admin panel styles
- `frontend/src/pages/DepartmentsPage.css` — shared layout styles
- `frontend/src/pages/Gallery.css` — shared gallery styles

### Frontend Public Assets
- `frontend/public/.htaccess` — Apache SPA routing
- `frontend/public/favicon.svg` — browser favicon (auto-served)
- `frontend/public/robots.txt` — search engine directives
- `frontend/public/sitemap.xml` — sitemap

### Backend
- `backend/package.json` — npm manifest
- `backend/package-lock.json` — lockfile
- `backend/index.js` — Express entry point
- `backend/.env` — environment variables (NOT committed)
- `backend/.env.example` — env template
- `backend/middleware/adminAuth.js` — admin auth + rate limiter
- `backend/middleware/securityHeaders.js` — security headers
- `backend/routes/*.js` — 28 route files (all registered in index.js)
- `backend/models/*.js` — 26 model files (all used by routes)
- `backend/seed.js` — database seed script
- `backend/seed-departments.js` — departments seed script

### Root Files
- `.gitignore` — git ignore rules
- `README.md` — project documentation
- `HOSTINGER_DEPLOYMENT.md` — deployment guide

---

## Definitely Unused — SAFE TO REMOVE

| File | Reason |
|---|---|
| `googlec8184b1a304cf83f.html` (root) | Duplicate of `frontend/public/googlec8184b1a304cf83f.html`. The public/ copy is the one served by Vite. |
| `websiteundermaintanence.html` (root) | Not referenced anywhere in source code. Appears to be an old maintenance page. |
| `frontend/vercel.json.bak` (root) | Old Vercel deployment config, renamed to .bak during Hostinger migration. No longer needed. |
| `frontend/public/enquiry-image.png` (1.88 MB) | Not referenced in any source file (JSX, CSS, or HTML). The EnquiryPopup uses CSS-only design. |
| `frontend/public/spark-infographic.png` (1.45 MB) | Not referenced in any source file. Appears to be an old infographic. |
| `frontend/public/icons.svg` (5 KB) | Not referenced in any source file. Old icons file. |
| `frontend/src/assets/` (empty directory) | Empty directory, no files inside. |

---

## Duplicates

| File 1 | File 2 | Status |
|---|---|---|
| `googlec8184b1a304cf83f.html` (root) | `frontend/public/googlec8184b1a304cf83f.html` | Identical content. Root copy is redundant. |

---

## Generated Files

| Path | Status |
|---|---|
| `frontend/dist/` | Generated by `npm run build`. Safe to regenerate. |
| `frontend/node_modules/` | Generated by `npm install`. Safe to regenerate. |
| `backend/node_modules/` | Generated by `npm install`. Safe to regenerate. |

---

## Temporary Files

| File | Status |
|---|---|
| `frontend/vercel.json.bak` | Temporary backup from previous Hostinger migration. |

---

## Dependencies Removed

**0 npm packages removed.** All dependencies are actively used:

### Frontend
- `@emailjs/browser` → ApplyNow.jsx, EnquiryPopup.jsx
- `@supabase/supabase-js` → lib/supabase.js (PDF uploads)
- `firebase` → lib/firebase.js, DebugPanel.jsx (enquiry form)
- `react`, `react-dom` → core framework
- `react-helmet-async` → SEO.jsx
- `react-router-dom` → App.jsx routing
- All devDependencies (`@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `oxlint`, `vite`) → build toolchain

### Backend
- `cors` → index.js
- `dns2` → index.js (MongoDB Atlas DNS resolution)
- `dotenv` → index.js, auth.js, adminAuth.js
- `express` → index.js
- `mongoose` → index.js, all models

---

## Files NOT Removed (Suspicious but Kept)

| File | Reason Kept |
|---|---|
| `frontend/src/components/AdminSectionPage.jsx` | Defined but never imported. However, it's a reusable wrapper component that may be used in future admin pages. Keeping it as it's small and harmless. |
| `frontend/public/favicon.svg` | Not explicitly referenced in source, but browsers auto-detect `/favicon.svg`. Keeping as fallback. |
| `frontend/public/googlec8184b1a304cf83f.html` | Google Search Console verification. Must remain in public/ for Google to verify domain. |
| `backend/routes/rules.js` + `models/Rule.js` | Route is registered in backend but not called from frontend. May be used by future admin features. Keeping. |
| `backend/seed.js`, `backend/seed-departments.js` | Utility scripts for database seeding. Not used at runtime but needed for initial setup. |
