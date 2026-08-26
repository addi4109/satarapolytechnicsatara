import mongoose from 'mongoose';

const CampusSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['library', 'bus-facility', 'canteen', 'registrar', 'office-staff', 'non-teaching-staff'],
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
  steps: {
    type: [{ title: String, desc: String }],
    default: [],
  },
  // For library: array of data tables
  tables: {
    type: [{
      title: String,
      columns: [String],
      rows: [[String]],
    }],
    default: [],
  },
  // For library: rules array
  rules: {
    type: [{
      ruleTitle: String,
      ruleDesc: String,
    }],
    default: [],
  },
  // For office-staff: array of staff members
  staffMembers: {
    type: [{
      name: String,
      designation: String,
      phone: String,
      email: String,
      photoUrl: String,
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

export default mongoose.model('Campus', CampusSchema);
