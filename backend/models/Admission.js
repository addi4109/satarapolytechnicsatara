import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['overview', 'courses', 'eligibility', 'process', 'first-year', 'direct-second', 'acap', 'fees', 'scholarships', 'brochure', 'apply'],
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
  note: {
    type: String,
    default: '',
  },
  stats: {
    type: [{ num: String, label: String }],
    default: [],
  },
  steps: {
    type: [{ title: String, desc: String }],
    default: [],
  },
  documents: {
    type: [String],
    default: [],
  },
  eligFirstYear: {
    type: [String],
    default: [],
  },
  eligDirect2nd: {
    type: [String],
    default: [],
  },
  feeRows1: {
    type: [{ particular: String, open: String, vjnt: String, scst: String, girls: String }],
    default: [],
  },
  feeRows2: {
    type: [{ particular: String, open: String, vjnt: String, scst: String, girls: String }],
    default: [],
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  scholarshipDocs: {
    type: [{ category: String, scheme: String, docs: [{ sr: String, document: String, details: String }] }],
    default: [],
  },
  feeTables: {
    type: [{ year: String, rows: [{ particular: String, open: String, vjnt: String, scst: String, girls: String }] }],
    default: [],
  },
  courseTable: {
    type: [{ name: String, duration: String, intake: String, direct2nd: String }],
    default: [],
  },
  infoRows: {
    type: [{ label: String, value: String }],
    default: [],
  },
  subSections: {
    type: [{
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      stats: { type: [{ num: String, label: String }], default: [] },
      documents: { type: [String], default: [] },
      steps: { type: [{ title: String, desc: String }], default: [] },
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

export default mongoose.model('Admission', AdmissionSchema);
