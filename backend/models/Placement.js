import mongoose from 'mongoose';

const PlacementSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['about', 'process', 'records', 'recruiters'],
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
  steps: {
    type: [{ title: String, desc: String }],
    default: [],
  },
  records: {
    type: [{ year: String, placed: String, companies: String }],
    default: [],
  },
  recruiters: {
    type: [{ name: String, logoUrl: String }],
    default: [],
  },
  officerName: { type: String, default: '' },
  officerPhoto: { type: String, default: '' },
  officerQual: { type: String, default: '' },
  officeTeam: {
    type: [{ name: String, designation: String, photo: String, qual: String, email: String }],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Placement', PlacementSchema);
