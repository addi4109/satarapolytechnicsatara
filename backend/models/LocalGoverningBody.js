import mongoose from 'mongoose';

const LocalGoverningBodySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  photoUrl: {
    type: String,
    default: '',
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

export default mongoose.model('LocalGoverningBody', LocalGoverningBodySchema);
