# Hostinger Deployment Guide — SPS Project

## Architecture Overview

```
Internet
   │
   +─── https://satarapolytechnicsatara.com
   │          │
   │          └── React/Vite static build
   │             Hostinger public_html
   │
   +─── https://api.satarapolytechnicsatara.com
              │
              └── Node.js/Express API
                 Hostinger Node.js application
                 │
                 └── MongoDB Atlas
```

---

## Part A: Frontend Deployment

### 1. Build the frontend locally

```bash
cd frontend
npm install
```

### 2. Create production `.env` file

```bash
cp .env.example .env
```

Edit `.env` and fill in the production values:

```
VITE_API_URL=https://api.satarapolytechnicsatara.com
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_COLLEGE_TEMPLATE_ID=your_template_id
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_COLLEGE_EMAIL=info@satarapolytechnicsatara.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the build

```bash
npm run build
```

This generates `frontend/dist/` with:

```
frontend/dist/
├── index.html
├── .htaccess
├── assets/
│   ├── *.js
│   ├── *.css
│   └── images/fonts/etc.
├── robots.txt
├── sitemap.xml
└── other public assets
```

### 4. Upload to Hostinger

1. Log in to Hostinger hPanel
2. Go to **File Manager** → `public_html/`
3. **Delete** all existing files in `public_html/`
4. Upload the **contents** of `frontend/dist/` to `public_html/`

**Final structure in public_html:**

```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── *.js
│   ├── *.css
│   └── ...
├── robots.txt
├── sitemap.xml
├── favicon.svg
└── ...
```

**IMPORTANT:** Upload only the contents of `dist/`, NOT the entire `frontend/` folder. Never upload `node_modules/`, `src/`, or `.env` files.

---

## Part B: Backend Deployment

### 1. Upload the backend

1. In Hostinger hPanel, go to **Advanced** → **Node.js**
2. Create a new Node.js application:
   - **Application root:** `api` (or `api.satarapolytechnicsatara.com` subdomain folder)
   - **Startup file:** `index.js`
   - **Node.js version:** 20.x (or latest available)

3. Upload the backend files to the application directory:

```
api/
├── package.json
├── package-lock.json
├── index.js
├── seed.js
├── seed-departments.js
├── middleware/
│   ├── adminAuth.js
│   └── securityHeaders.js
├── models/
│   └── *.js
└── routes/
    └── *.js
```

**Do NOT upload:**
- `node_modules/`
- `.env` (secrets go in Hostinger's Node.js panel)
- `.env.example`

### 2. Configure environment variables

In Hostinger hPanel → Node.js → your application → **Environment Variables**:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (or as assigned by Hostinger) |
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/sps?retryWrites=true&w=majority` |
| `FRONTEND_URL` | `https://satarapolytechnicsatara.com` |
| `ADMIN_EMAIL` | `your_admin_email` |
| `ADMIN_PASSWORD` | `your_secure_password` |
| `ADMIN_API_KEY` | `your_secure_api_key` |

### 3. Install dependencies & start

In the Hostinger Node.js panel:

1. **Build/Install command:** `npm install`
2. **Start command:** `node index.js`
3. Click **Run** or **Restart**

### 4. Configure the subdomain

If using a subdomain `api.satarapolytechnicsatara.com`:

1. In Hostinger hPanel → **Domains** → **Subdomains**
2. Create subdomain: `api` → points to the Node.js application root
3. Or use Hostinger's Node.js app settings to bind to the subdomain

### 5. Verify the backend

Visit: `https://api.satarapolytechnicsatara.com/api/health`

Expected response:
```json
{"status":"ok"}
```

---

## Part C: Post-Deployment Checklist

### Frontend
- [ ] `https://satarapolytechnicsatara.com` loads the homepage
- [ ] All pages render correctly (navigate to /about, /admissions, /contact, etc.)
- [ ] React Router works (direct URL navigation, page refresh)
- [ ] Images and assets load
- [ ] CSS styling is correct
- [ ] Admin login page works at `/admin/login`

### Backend
- [ ] `https://api.satarapolytechnicsatara.com/api/health` returns `{"status":"ok"}`
- [ ] Public API endpoints work (GET requests)
- [ ] Admin login works (POST /api/auth/login)
- [ ] Admin write operations work (with API key)
- [ ] MongoDB connection is stable
- [ ] CORS allows the frontend origin

### API Integration
- [ ] Frontend data loads (departments, notices, slides, etc.)
- [ ] PDF proxy works for notice PDFs
- [ ] Image uploads work (Cloudinary)
- [ ] Enquiry form works (EmailJS)
- [ ] Admin panel fully functional

### Security
- [ ] `.env` files are NOT in `public_html/`
- [ ] `.env` files are NOT in `frontend/dist/`
- [ ] Backend secrets are in Hostinger environment variables
- [ ] CORS only allows `https://satarapolytechnicsatara.com`
- [ ] No `node_modules` in public directories

---

## Troubleshooting

### Frontend shows blank page
- Check `public_html/index.html` exists
- Check `.htaccess` is uploaded (Apache must have `mod_rewrite`)
- Check browser console for JS errors

### API calls fail from frontend
- Verify `VITE_API_URL` is set correctly in the build
- Check CORS configuration allows the frontend domain
- Verify backend is running and accessible

### Backend won't start
- Check Node.js version in Hostinger panel
- Verify all environment variables are set
- Check the application logs in Hostinger panel

### MongoDB connection fails
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist (allow Hostinger IPs or `0.0.0.0/0`)
- Verify database user credentials

### 404 on page refresh (SPA)
- Ensure `.htaccess` is in `public_html/`
- Check Apache `mod_rewrite` is enabled
- Verify the `.htaccess` content is correct

---

## Environment Variables Summary

### Frontend (VITE_API_URL and others)
Set during build time in `.env` file. NOT needed at runtime.

### Backend (set in Hostinger Node.js panel)
- `NODE_ENV=production`
- `PORT=5000`
- `MONGO_URI=mongodb+srv://...`
- `FRONTEND_URL=https://satarapolytechnicsatara.com`
- `ADMIN_EMAIL=...`
- `ADMIN_PASSWORD=...`
- `ADMIN_API_KEY=...`
