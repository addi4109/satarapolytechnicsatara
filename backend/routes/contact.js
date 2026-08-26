import { Router } from 'express';
import Contact from '../models/Contact.js';

const router = Router();

// GET /api/contact — get all contact sections
router.get('/', async (req, res) => {
  try {
    const data = await Contact.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact/:section — get a single section
router.get('/:section', async (req, res) => {
  try {
    const data = await Contact.findOne({ section: req.params.section });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/contact — create or update a section
router.post('/', async (req, res) => {
  try {
    const { section, officeContacts, phone, email, address, officeHours, mapEmbedUrl, enquiryFields, feedbackFields, active } = req.body;
    if (!section) return res.status(400).json({ error: 'section is required' });

    const update = {};
    if (officeContacts !== undefined) update.officeContacts = officeContacts;
    if (phone !== undefined) update.phone = phone;
    if (email !== undefined) update.email = email;
    if (address !== undefined) update.address = address;
    if (officeHours !== undefined) update.officeHours = officeHours;
    if (mapEmbedUrl !== undefined) update.mapEmbedUrl = mapEmbedUrl;
    if (enquiryFields !== undefined) update.enquiryFields = enquiryFields;
    if (feedbackFields !== undefined) update.feedbackFields = feedbackFields;
    if (active !== undefined) update.active = active;

    const data = await Contact.findOneAndUpdate(
      { section },
      { $set: update },
      { upsert: true, new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:section
router.delete('/:section', async (req, res) => {
  try {
    await Contact.findOneAndDelete({ section: req.params.section });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
