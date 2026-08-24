import { Router } from 'express';
import Setting from '../models/Setting.js';

const router = Router();

// GET /api/settings — get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const obj = {};
    settings.forEach((s) => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/:key — get a single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    res.json({ key: req.params.key, value: setting ? setting.value : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings — update or create a setting
router.put('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'key is required' });
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/bulk — update multiple settings at once
router.put('/bulk', async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'settings object required' });
    }
    const ops = Object.entries(settings).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { value }, upsert: true },
    }));
    await Setting.bulkWrite(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
