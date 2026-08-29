import { Router } from 'express';
import Alumni from '../models/Alumni.js';

const router = Router();

// GET /api/alumni — get all alumni (admin)
router.get('/', async (req, res) => {
  try {
    const data = await Alumni.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alumni/approved — get approved alumni (public)
router.get('/approved', async (req, res) => {
  try {
    const data = await Alumni.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alumni/:id — get single alumni
router.get('/:id', async (req, res) => {
  try {
    const data = await Alumni.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Alumni not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alumni — create new alumni registration
router.post('/', async (req, res) => {
  try {
    const alumni = new Alumni(req.body);
    await alumni.save();
    res.status(201).json(alumni);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/alumni/:id — update alumni (admin)
router.put('/:id', async (req, res) => {
  try {
    const data = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ error: 'Alumni not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/alumni/:id — delete alumni (admin)
router.delete('/:id', async (req, res) => {
  try {
    const data = await Alumni.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: 'Alumni not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
