import { Router } from 'express';
import Cell from '../models/Cell.js';

const router = Router();

// GET all cells
router.get('/', async (req, res) => {
  try {
    const cells = await Cell.find().sort({ order: 1, createdAt: 1 });
    res.json(cells);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single cell by slug
router.get('/:slug', async (req, res) => {
  try {
    const cell = await Cell.findOne({ slug: req.params.slug });
    if (!cell) return res.status(404).json({ error: 'Cell not found' });
    res.json(cell);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create cell
router.post('/', async (req, res) => {
  try {
    const cell = new Cell(req.body);
    await cell.save();
    res.status(201).json(cell);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update cell
router.put('/:id', async (req, res) => {
  try {
    const cell = await Cell.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cell) return res.status(404).json({ error: 'Cell not found' });
    res.json(cell);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE cell
router.delete('/:id', async (req, res) => {
  try {
    const cell = await Cell.findByIdAndDelete(req.params.id);
    if (!cell) return res.status(404).json({ error: 'Cell not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
