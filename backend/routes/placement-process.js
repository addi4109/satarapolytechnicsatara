import { Router } from 'express';
import PlacementProcess from '../models/PlacementProcess.js';

const router = Router();

// Get all placement process steps
router.get('/', async (req, res) => {
  try {
    const items = await PlacementProcess.find().sort({ order: 1, stepNumber: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single placement process step
router.get('/:id', async (req, res) => {
  try {
    const item = await PlacementProcess.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Step not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create placement process step
router.post('/', async (req, res) => {
  try {
    const item = new PlacementProcess(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update placement process step
router.put('/:id', async (req, res) => {
  try {
    const item = await PlacementProcess.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Step not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete placement process step
router.delete('/:id', async (req, res) => {
  try {
    const item = await PlacementProcess.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Step not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
