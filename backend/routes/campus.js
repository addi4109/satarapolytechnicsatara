import { Router } from 'express';
import Campus from '../models/Campus.js';

const router = Router();

// Get all campus sections
router.get('/', async (req, res) => {
  try {
    const sections = await Campus.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single section
router.get('/:section', async (req, res) => {
  try {
    const section = await Campus.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update section (upsert)
router.post('/', async (req, res) => {
  try {
    const { section, title, content, infoRows, stats, steps, staffMembers, tables, rules, images, busRoutes, active } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    const entry = await Campus.findOneAndUpdate(
      { section },
      { section, title, content, infoRows, stats, steps, staffMembers, tables, rules, images, busRoutes, active },
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
    await Campus.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
