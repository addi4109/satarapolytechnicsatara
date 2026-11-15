import { Router } from 'express';
import Ranker from '../models/Ranker.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const items = await Ranker.find().sort({ rank: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const duplicate = await Ranker.findOne({ rank: Number(req.body.rank) });
    if (duplicate) {
      return res.status(400).json({ error: 'That rank is already assigned to another student.' });
    }
    const item = new Ranker(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const duplicate = await Ranker.findOne({
      rank: Number(req.body.rank),
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(400).json({ error: 'That rank is already assigned to another student.' });
    }
    const item = await Ranker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Ranker not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Ranker.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Ranker not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
