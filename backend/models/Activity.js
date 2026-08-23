import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['sports', 'cultural', 'technical', 'industrial-visits', 'competitions'],
    unique: true,
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  infoRows: {
    type: [{ label: String, value: String }],
    default: [],
  },
  stats: {
    type: [{ num: String, label: String }],
    default: [],
  },
  // Gallery images for the section
  images: {
    type: [{ url: String, caption: String }],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Activity', ActivitySchema);
