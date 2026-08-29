import mongoose from 'mongoose';

const alumniAssociationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AlumniAssociation = mongoose.model('AlumniAssociation', alumniAssociationSchema);
export default AlumniAssociation;
