import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

/**
 * Parse admin credentials from env vars.
 * Supports multiple admins via comma-separated values:
 *   ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
 *   ADMIN_PASSWORDS=pass1,pass2
 * 
 * Or single admin:
 *   ADMIN_EMAIL=admin@gmail.com
 *   ADMIN_PASSWORD=pass123
 */
function getAdminCredentials() {
  // Try multi-admin format first
  const emails = process.env.ADMIN_EMAILS;
  const passwords = process.env.ADMIN_PASSWORDS;
  
  if (emails && passwords) {
    const emailList = emails.split(',').map(e => e.trim());
    const passList = passwords.split(',').map(p => p.trim());
    return emailList.map((email, i) => ({
      email,
      password: passList[i] || ''
    }));
  }
  
  // Fallback to single admin format
  return [{
    email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }];
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success: true } or { success: false, error: '...' }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const admins = getAdminCredentials();
  
  // Check if any admin matches
  const isValid = admins.some(admin => 
    timingSafeEqual(email, admin.email) && timingSafeEqual(password, admin.password)
  );

  if (isValid) {
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
