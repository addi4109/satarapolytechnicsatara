/**
 * Central API URL configuration.
 *
 * - Development: Vite proxies /api → localhost:5000 (see vite.config.js)
 * - Production:  Uses VITE_API_URL env var, or falls back to Render backend
 */
const API_URL = import.meta.env.VITE_API_URL || 'https://satarapolytechnicsatara.onrender.com';

export default API_URL;
