import mongoose from 'mongoose';

// Single-document collection holding the total site visit count.
const visitCounterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const VisitCounter = mongoose.model('VisitCounter', visitCounterSchema);
export default VisitCounter;
