import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    department: { type: String, default: '' },
    currentPosition: { type: String, default: '' },
    company: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const Alumni = mongoose.model('Alumni', alumniSchema);
export default Alumni;
