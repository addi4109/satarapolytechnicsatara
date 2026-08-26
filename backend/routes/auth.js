import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success: true } or { success: false, error: '...' }
 * 
 * Credentials are checked server-side — never exposed to frontend JS.
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  // Timing-safe comparison to prevent timing attacks
  const emailMatch = timingSafeEqual(email, ADMIN_EMAIL);
  const passwordMatch = timingSafeEqual(password, ADMIN_PASSWORD);

  if (emailMatch && passwordMatch) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'Invalid email or password' });
});

/**
 * Simple timing-safe string comparison.
 * Prevents attackers from measuring response time to guess credentials.
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    // Still compute to maintain constant time
    let result = a.length ^ b.length;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return result === 0;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export default router;
