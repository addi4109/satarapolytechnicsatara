import mongoose from 'mongoose';

const placementGallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PlacementGallery = mongoose.model('PlacementGallery', placementGallerySchema);
export default PlacementGallery;
