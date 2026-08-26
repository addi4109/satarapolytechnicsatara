import dotenv from 'dotenv';
dotenv.config();

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'sps-admin-key-change-in-production';

/**
 * Middleware to protect admin (write) API routes.
 * Requires x-admin-key header to match the ADMIN_API_KEY env var.
 * GET requests are always allowed (public read).
 */
export function requireAdmin(req, res, next) {
  // Only protect write operations
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const providedKey = req.headers['x-admin-key'];
  if (!providedKey || providedKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Admin API key required.' });
  }

  next();
}

/**
 * Simple rate limiter using in-memory store.
 * Limits each IP to maxRequests requests within the windowMs period.
 */
export function rateLimit({ windowMs = 60000, maxRequests = 100 } = {}) {
  const hits = new Map();

  // Cleanup old entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of hits) {
      if (now - data.windowStart > windowMs) {
        hits.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now - record.windowStart > windowMs) {
      hits.set(ip, { windowStart: now, count: 1 });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    next();
  };
}
