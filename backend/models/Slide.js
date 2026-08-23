import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, default: '' },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Slide = mongoose.model('Slide', slideSchema);
export default Slide;
