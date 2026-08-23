import { Router } from 'express';
import About from '../models/About.js';

const router = Router();

// Get all about sections
router.get('/', async (req, res) => {
  try {
    const sections = await About.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single section by key
router.get('/:section', async (req, res) => {
  try {
    const section = await About.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update section
router.post('/', async (req, res) => {
  try {
    const { section, title, content, mission, achievements, infoRows, stats, active } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    const entry = await About.findOneAndUpdate(
      { section },
      { section, title, content, mission, achievements, infoRows, stats, active },
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
    await About.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
