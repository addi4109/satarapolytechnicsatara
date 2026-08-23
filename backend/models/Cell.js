import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  phone: { type: String, default: '' },
  position: { type: String, default: '' },
});

const cellSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    members: [memberSchema],
    type: {
      type: String,
      enum: ['cell', 'committee'],
      default: 'cell',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from name
cellSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

const Cell = mongoose.model('Cell', cellSchema);
export default Cell;
