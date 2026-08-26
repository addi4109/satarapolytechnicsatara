import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['sports', 'cultural', 'technical', 'academic-events'],
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
  images: {
    type: [{ url: String, caption: String }],
    default: [],
  },
  // Sub-sections for sports/events (title, description, images for each)
  subSections: {
    type: [{
      title: String,
      description: String,
      images: [{ url: String, caption: String }],
    }],
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
