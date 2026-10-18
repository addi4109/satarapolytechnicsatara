import { Router } from 'express';
import Event from '../models/Event.js';

const router = Router();

// GET active events (public)
router.get('/', async (req, res) => {
  try {
    const items = await Event.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all events (admin)
router.get('/all', async (req, res) => {
  try {
    const items = await Event.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const item = new Event(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const item = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Event not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const item = await Event.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
