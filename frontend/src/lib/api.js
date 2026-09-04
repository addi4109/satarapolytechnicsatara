/**
 * Central API URL configuration.
 *
 * - Development: Vite proxies /api → localhost:5000 (see vite.config.js)
 * - Production:  Uses VITE_API_URL env var, or falls back to the Render backend.
 *
 * Every fetch call in the app uses `${API_URL}/<resource>` (no /api prefix),
 * so API_URL must point at the API root INCLUDING the /api path segment.
 */
let API_URL = (import.meta.env.VITE_API_URL || 'https://satarapolytechnicsatara.onrender.com').replace(/\/+$/, '');
if (!/\/api$/.test(API_URL)) {
  API_URL += '/api';
}

export default API_URL;