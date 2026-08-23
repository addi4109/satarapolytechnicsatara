import mongoose from 'mongoose';

const placementProcessSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },       // Step number (1, 2, 3...)
  title: { type: String, required: true },             // Step title
  description: { type: String, required: true },       // Step description
  order: { type: Number, default: 0 },                 // For sorting
}, { timestamps: true });

export default mongoose.model('PlacementProcess', placementProcessSchema);
