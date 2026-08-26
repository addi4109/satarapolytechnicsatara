import { Router } from 'express';
import Admission from '../models/Admission.js';

const router = Router();

// Get all admission sections
router.get('/', async (req, res) => {
  try {
    const sections = await Admission.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single section
router.get('/:section', async (req, res) => {
  try {
    const section = await Admission.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update section
router.post('/', async (req, res) => {
  try {
    const { section, title, content, stats, steps, documents, feeTables, courseTable, eligFirstYear, eligDirect2nd, feeRows1, feeRows2, pdfUrl, scholarshipDocs, infoRows, active } = req.body;

    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    const entry = await Admission.findOneAndUpdate(
      { section },
      { section, title, content, stats, steps, documents, feeTables, courseTable, eligFirstYear, eligDirect2nd, feeRows1, feeRows2, pdfUrl, scholarshipDocs, infoRows, active },
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
    await Admission.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
