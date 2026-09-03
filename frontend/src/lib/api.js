/**
 * Central API URL configuration.
 *
 * - Development: Vite proxies /api → localhost:5000 (see vite.config.js)
 * - Production:  Calls https://api.satarapolytechnicsatara.com directly
 */
const API_URL = import.meta.env.VITE_API_URL || '/api';

export default API_URL;
