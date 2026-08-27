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
  // For library: images array
  images: {
    type: [{
      url: String,
      caption: String,
    }],
    default: [],
  },
  // For bus-facility: bus routes
  busRoutes: {
    type: [{
      routeName: String,
      stops: [String],
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
  // For canteen: food menu items
  foodMenu: {
    type: [{
      name: String,
      category: String,
      price: String,
      time: String,
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
