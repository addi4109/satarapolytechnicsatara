import { Router } from 'express';
import Entrepreneur from '../models/Entrepreneur.js';

const router = Router();

// GET /api/entrepreneurs — get all (admin)
router.get('/', async (req, res) => {
  try {
    const data = await Entrepreneur.find().sort({ order: 1, createdAt: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entrepreneurs/public — get all (public)
router.get('/public', async (req, res) => {
  try {
    const data = await Entrepreneur.find().sort({ order: 1, createdAt: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entrepreneurs/:id — get single
router.get('/:id', async (req, res) => {
  try {
    const data = await Entrepreneur.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Entrepreneur not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/entrepreneurs — create
router.post('/', async (req, res) => {
  try {
    const entrepreneur = new Entrepreneur(req.body);
    await entrepreneur.save();
    res.status(201).json(entrepreneur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/entrepreneurs/:id — update
router.put('/:id', async (req, res) => {
  try {
    const data = await Entrepreneur.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ error: 'Entrepreneur not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/entrepreneurs/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    const data = await Entrepreneur.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: 'Entrepreneur not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
