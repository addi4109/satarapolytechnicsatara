import { Router } from 'express';

const router = Router();

// Proxy PDF from Supabase to bypass CORS issues
router.get('/', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Only allow Supabase URLs
    if (!url.includes('supabase.co')) {
      return res.status(403).json({ error: 'Only Supabase URLs are allowed' });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch PDF' });
    }

    // Set proper headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Stream the PDF
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('PDF proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy PDF' });
  }
});

export default router;
