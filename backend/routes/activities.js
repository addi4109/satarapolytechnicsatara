import { Router } from 'express';
import Activity from '../models/Activity.js';

const router = Router();

// Get all activity sections
router.get('/', async (req, res) => {
  try {
    const sections = await Activity.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single section
router.get('/:section', async (req, res) => {
  try {
    const section = await Activity.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update section (upsert)
router.post('/', async (req, res) => {
  try {
    const { section, title, content, infoRows, stats, images, subSections, active } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    const entry = await Activity.findOneAndUpdate(
      { section },
      { section, title, content, infoRows, stats, images, subSections, active },
      { new: true, upsert: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete section
router.delete('/:section', async (req, res) => {
  try {
    await Activity.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
