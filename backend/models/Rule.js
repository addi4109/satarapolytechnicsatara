import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'College Rules & Regulations',
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  rules: [{
    ruleTitle: { type: String, default: '' },
    ruleDesc: { type: String, default: '' },
  }],
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Rule', RuleSchema);
