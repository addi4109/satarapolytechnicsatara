/**
 * Admin API helper — sends x-admin-key header with write requests.
 * 
 * GET requests work without auth (public).
 * POST/PUT/DELETE include the admin key from localStorage.
 */

const ADMIN_KEY_STORAGE = 'sps_admin_api_key';

export function setAdminApiKey(key) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function getAdminApiKey() {
  return localStorage.getItem(ADMIN_KEY_STORAGE) || '';
}

export function clearAdminApiKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

/**
 * Authenticated fetch wrapper for admin API calls.
 * Automatically adds x-admin-key header for non-GET requests.
 */
export async function adminFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...options.headers };

  if (method !== 'GET' && method !== 'HEAD') {
    headers['x-admin-key'] = getAdminApiKey();
  }

  return fetch(url, { ...options, headers });
}
