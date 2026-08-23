import { Router } from 'express';
import GoverningBody from '../models/GoverningBody.js';

const router = Router();

// Get all governing body members (public - active only)
router.get('/', async (req, res) => {
  try {
    const members = await GoverningBody.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all governing body members (admin - including inactive)
router.get('/all', async (req, res) => {
  try {
    const members = await GoverningBody.find().sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new member
router.post('/', async (req, res) => {
  try {
    const member = new GoverningBody(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a member
router.put('/:id', async (req, res) => {
  try {
    const member = await GoverningBody.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    const member = await GoverningBody.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
