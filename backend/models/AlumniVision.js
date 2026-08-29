import mongoose from 'mongoose';

const alumniVisionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, default: 'vision-mission' },
    title: { type: String, default: '' },
    visionContent: { type: String, default: '' },
    missionPoints: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AlumniVision = mongoose.model('AlumniVision', alumniVisionSchema);
export default AlumniVision;
