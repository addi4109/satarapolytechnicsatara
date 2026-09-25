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
    const {
      section, title, content, mission, achievements, infoRows, stats,
      image, orgLevels, conductSections, pdfUrl, active,
    } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    // Only overwrite fields the client actually sent, so unspecified
    // arrays/fields keep their stored values.
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (mission !== undefined) update.mission = mission;
    if (achievements !== undefined) update.achievements = achievements;
    if (infoRows !== undefined) update.infoRows = infoRows;
    if (stats !== undefined) update.stats = stats;
    if (image !== undefined) update.image = image;
    if (orgLevels !== undefined) update.orgLevels = orgLevels;
    if (conductSections !== undefined) update.conductSections = conductSections;
    if (pdfUrl !== undefined) update.pdfUrl = pdfUrl;
    if (active !== undefined) update.active = active;

    const entry = await About.findOneAndUpdate(
      { section },
      { $set: update },
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
