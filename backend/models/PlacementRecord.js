import mongoose from 'mongoose';

const placementRecordSchema = new mongoose.Schema({
  year: { type: String, required: true },           // e.g. "2023-24"
  eligible: { type: Number, required: true },        // Students eligible
  placed: { type: Number, required: true },          // Students placed
  highestPackage: { type: Number, default: 0 },      // Highest package in LPA
  averagePackage: { type: Number, default: 0 },      // Average package in LPA
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('PlacementRecord', placementRecordSchema);
