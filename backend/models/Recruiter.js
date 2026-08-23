import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
