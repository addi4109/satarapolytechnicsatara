import { Router } from 'express';
import Placement from '../models/Placement.js';

const router = Router();

// Get all placement sections
router.get('/', async (req, res) => {
  try {
    const sections = await Placement.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single section
router.get('/:section', async (req, res) => {
  try {
    const section = await Placement.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update section
router.post('/', async (req, res) => {
  try {
    const { section, title, content, steps, records, recruiters, active } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    const entry = await Placement.findOneAndUpdate(
      { section },
      { section, title, content, steps, records, recruiters, active },
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
    await Placement.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
