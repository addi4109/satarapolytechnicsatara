import mongoose from 'mongoose';

const ExaminationSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['schedule', 'rules', 'results', 'revaluation', 'notices'],
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
  // For schedule section: array of schedule entries
  schedules: {
    type: [{
      examName: String,
      semester: String,
      department: String,
      startDate: String,
      endDate: String,
      pdfUrl: String,
    }],
    default: [],
  },
  // For rules section: array of sub-sections, each with its own rules
  ruleSubSections: {
    type: [{
      subTitle: { type: String, default: '' },
      rules: {
        type: [{
          title: String,
          description: String,
          subPoints: {
            type: [String],
            default: [],
          },
        }],
        default: [],
      },
    }],
    default: [],
  },
  // Legacy flat rules (kept for backward compatibility)
  rules: {
    type: [{
      title: String,
      description: String,
      subPoints: {
        type: [String],
        default: [],
      },
    }],
    default: [],
  },
  // For results section: array of result entries
  resultsData: {
    type: [{
      examName: String,
      semester: String,
      passPercentage: String,
      topScorer: String,
      topScore: String,
      pdfUrl: String,
    }],
    default: [],
  },
  // For results section: single link that opens the result portal
  resultPortalUrl: {
    type: String,
    default: '',
    trim: true,
  },
  // For revaluation section
  revaluationSteps: {
    type: [{
      title: String,
      description: String,
      subPoints: {
        type: [String],
        default: [],
      },
    }],
    default: [],
  },
  // Fee info for revaluation
  revaluationFee: {
    type: String,
    default: '',
  },
  // Deadline for revaluation
  revaluationDeadline: {
    type: String,
    default: '',
  },
  // Portal URL for revaluation
  revaluationPortalUrl: {
    type: String,
    default: '',
    trim: true,
  },
  // For notices section: array of notice items
  noticesData: {
    type: [{
      title: String,
      date: String,
      description: String,
      pdfUrl: String,
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

export default mongoose.model('Examination', ExaminationSchema);
