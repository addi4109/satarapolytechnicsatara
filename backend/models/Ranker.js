import mongoose from 'mongoose';

const rankerSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true, min: 1, max: 3 },
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    score: { type: String, default: '' },
  },
  { timestamps: true }
);

const Ranker = mongoose.model('Ranker', rankerSchema);
export default Ranker;
