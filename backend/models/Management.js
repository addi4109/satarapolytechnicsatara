import mongoose from 'mongoose';

const ManagementSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['founder', 'chairman', 'secretary', 'principal'],
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  qualification: {
    type: String,
    default: '',
    trim: true,
  },
  photoUrl: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  shortDesc: {
    type: String,
    default: '',
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Management', ManagementSchema);
