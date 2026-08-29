import mongoose from 'mongoose';

const entrepreneurSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firm: { type: String, required: true },
    department: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    sector: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Entrepreneur = mongoose.model('Entrepreneur', entrepreneurSchema);
export default Entrepreneur;
