import { Router } from 'express';
import VisitCounter from '../models/VisitCounter.js';

const router = Router();

const COUNTER_KEY = 'site';

// POST /api/visits — record a visit and return the updated total.
// Registered before the admin auth middleware in index.js because browsers
// hit it on every session without an admin key. Session de-duplication is
// handled client-side (localStorage timestamp) to keep this endpoint dumb.
router.post('/', async (req, res) => {
  try {
    const counter = await VisitCounter.findOneAndUpdate(
      { key: COUNTER_KEY },
      { $inc: { total: 1 } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    res.json({ total: counter.total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/visits — read the total without incrementing.
router.get('/', async (req, res) => {
  try {
    const counter = await VisitCounter.findOne({ key: COUNTER_KEY });
    res.json({ total: counter ? counter.total : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
