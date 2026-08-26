import { Router } from 'express';
import Rule from '../models/Rule.js';

const router = Router();

// Get rules
router.get('/', async (req, res) => {
  try {
    const rules = await Rule.findOne().sort({ updatedAt: -1 });
    res.json(rules || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update rules
router.post('/', async (req, res) => {
  try {
    const { title, description, rules, active } = req.body;

    let existing = await Rule.findOne();
    if (existing) {
      existing.title = title ?? existing.title;
      existing.description = description ?? existing.description;
      existing.rules = rules ?? existing.rules;
      existing.active = active ?? existing.active;
      await existing.save();
      res.json(existing);
    } else {
      const entry = await Rule.create({ title, description, rules, active });
      res.json(entry);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete rules
router.delete('/', async (req, res) => {
  try {
    await Rule.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
