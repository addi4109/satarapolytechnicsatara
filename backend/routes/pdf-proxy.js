import { Router } from 'express';

const router = Router();

// Content-type mapping for common file extensions
const contentTypes = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
};

function getExtFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop().toLowerCase();
    return ext.split('?')[0]; // Remove query params
  } catch {
    return '';
  }
}

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
      return res.status(response.status).json({ error: `Failed to fetch file: ${response.status}` });
    }

    const ext = getExtFromUrl(url);
    const contentType = contentTypes[ext] || response.headers.get('content-type') || 'application/octet-stream';

    // Forward Content-Length so the browser PDF viewer can scroll properly
    const contentLength = response.headers.get('content-length');

    // Set proper headers
    res.setHeader('Content-Type', contentType);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Stream the response instead of buffering
    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        }
        res.write(value);
      }
    };
    await pump();
  } catch (err) {
    console.error('File proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to proxy file' });
    }
  }
});

export default router;
