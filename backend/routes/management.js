import { Router } from 'express';
import Management from '../models/Management.js';

const router = Router();

// Get all management entries
router.get('/', async (req, res) => {
  try {
    const entries = await Management.find().sort({ order: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single management entry by role
router.get('/:role', async (req, res) => {
  try {
    const entry = await Management.findOne({ role: req.params.role });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update management entry
router.post('/', async (req, res) => {
  try {
    const { role, name, title, qualification, photoUrl, message, shortDesc, order, active } = req.body;

    if (!role || !name) {
      return res.status(400).json({ error: 'Role and name are required' });
    }

    const entry = await Management.findOneAndUpdate(
      { role },
      { role, name, title, qualification, photoUrl, message, shortDesc, order, active },
      { new: true, upsert: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete management entry
router.delete('/:role', async (req, res) => {
  try {
    await Management.findOneAndDelete({ role: req.params.role });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
