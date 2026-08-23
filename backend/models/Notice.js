import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['admission', 'examination', 'academic', 'placement', 'scholarship', 'department', 'circulars', 'general'],
      default: 'general'
    },
    pdfUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
