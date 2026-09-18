import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['society', 'institute', 'accreditation', 'disclosure', 'vision', 'affiliation', 'achievements', 'organisational-chart', 'code-of-conduct'],
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
  mission: {
    type: [String],
    default: [],
  },
  achievements: {
    type: [String],
    default: [],
  },
  infoRows: {
    type: [{ label: String, value: String }],
    default: [],
  },
  stats: {
    type: [{ num: String, label: String }],
    default: [],
  },
  // Organisational chart levels: [{ label, nodes: [{ title, subtitle, featured }] }]
  orgLevels: {
    type: [{
      label: String,
      nodes: [{ title: String, subtitle: String, featured: Boolean }],
    }],
    default: [],
  },
  // Code of conduct sections: [{ title, items: [String] }]
  conductSections: {
    type: [{ title: String, items: [String] }],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('About', AboutSchema);
