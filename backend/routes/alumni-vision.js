import { Router } from 'express';
import AlumniVision from '../models/AlumniVision.js';

const router = Router();

// GET /api/alumni-vision — get the vision document
router.get('/', async (req, res) => {
  try {
    const data = await AlumniVision.findOne({ section: 'vision-mission' });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alumni-vision — create or update
router.post('/', async (req, res) => {
  try {
    const { title, visionContent, missionPoints, active } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (visionContent !== undefined) update.visionContent = visionContent;
    if (missionPoints !== undefined) update.missionPoints = missionPoints;
    if (active !== undefined) update.active = active;

    const data = await AlumniVision.findOneAndUpdate(
      { section: 'vision-mission' },
      { $set: update },
      { upsert: true, new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/alumni-vision
router.delete('/', async (req, res) => {
  try {
    await AlumniVision.findOneAndDelete({ section: 'vision-mission' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
