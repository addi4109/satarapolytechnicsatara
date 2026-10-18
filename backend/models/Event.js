import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  rules: [{ type: String }],
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    googleFormUrl: { type: String, default: '' },
    date: { type: String, default: '' },
    venue: { type: String, default: '' },
    competitions: [competitionSchema],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
