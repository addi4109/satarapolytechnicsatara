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

// Supabase occasionally drops connections (ECONNRESET / socket hang up),
// which surfaced to users as "Failed to proxy file". Retry transient failures.
async function fetchWithRetry(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });
      // Don't retry client errors (404 etc.) — they will keep failing.
      if (response.ok || response.status < 500) {
        return response;
      }
      lastErr = new Error(`Upstream responded with ${response.status}`);
    } catch (err) {
      lastErr = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)));
  }
  throw lastErr || new Error('Failed to fetch file');
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

    const response = await fetchWithRetry(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch file: ${response.status}` });
    }

    const ext = getExtFromUrl(url);
    const contentType =
      contentTypes[ext] || response.headers.get('content-type') || 'application/octet-stream';

    // Buffer the whole file instead of streaming. The previous implementation
    // used response.body.getReader() and forwarded Supabase's Content-Length,
    // which intermittently broke on the Node runtime (mismatched/undelivered
    // body -> "Failed to proxy file" and broken PDF viewer). Files served here
    // are small, so buffering is safe and far more reliable.
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (err) {
    // Surface the real cause (DNS failure, timeout, reset) instead of a
    // generic message so storage problems are diagnosable from the response.
    const cause =
      err?.cause?.code || err?.code || (err?.name === 'TimeoutError' ? 'ETIMEDOUT' : '');
    console.error('File proxy error:', cause || '', err?.message || err);
    if (!res.headersSent) {
      const isDns = ['ENOTFOUND', 'EAI_AGAIN'].includes(cause);
      res.status(isDns ? 502 : 500).json({
        error: 'Failed to proxy file',
        reason: cause || err?.message || 'unknown',
      });
    }
  }
});

export default router;
