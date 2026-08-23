import { Router } from 'express';
import PlacementRecord from '../models/PlacementRecord.js';

const router = Router();

// Get all placement records
router.get('/', async (req, res) => {
  try {
    const items = await PlacementRecord.find().sort({ order: 1, year: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single placement record
router.get('/:id', async (req, res) => {
  try {
    const item = await PlacementRecord.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Record not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create placement record
router.post('/', async (req, res) => {
  try {
    const item = new PlacementRecord(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update placement record
router.put('/:id', async (req, res) => {
  try {
    const item = await PlacementRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Record not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete placement record
router.delete('/:id', async (req, res) => {
  try {
    const item = await PlacementRecord.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
