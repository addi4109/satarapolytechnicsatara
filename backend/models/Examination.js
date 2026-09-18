import mongoose from 'mongoose';

const ExaminationSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['schedule', 'rules', 'results', 'revaluation', 'notices', 'rankholders', 'examform'],
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
  // For exam form section: link to the online exam form portal
  examFormPortalUrl: {
    type: String,
    default: '',
    trim: true,
  },
  // For exam form section: steps to fill the exam form
  examFormSteps: {
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
  // For exam form section: important rules/instructions while filling the form
  examFormRules: {
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
  // For rankholders section
  rankholders: {
    type: [{
      name: String,
      department: String,
      semester: String,
      rank: String,
      marks: String,
      year: String,
      photoUrl: String,
      image: String,
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
