import { Router } from 'express';
import AlumniAssociation from '../models/AlumniAssociation.js';

const router = Router();

// GET /api/alumni-association — get all (admin)
router.get('/', async (req, res) => {
  try {
    const data = await AlumniAssociation.find().sort({ order: 1, createdAt: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alumni-association/public — get all (public)
router.get('/public', async (req, res) => {
  try {
    const data = await AlumniAssociation.find().sort({ order: 1, createdAt: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alumni-association — create
router.post('/', async (req, res) => {
  try {
    const member = new AlumniAssociation(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/alumni-association/:id — update
router.put('/:id', async (req, res) => {
  try {
    const data = await AlumniAssociation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ error: 'Member not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/alumni-association/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    const data = await AlumniAssociation.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
