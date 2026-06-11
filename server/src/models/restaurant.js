import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    title: { type: String },
    badge: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    rating: { type: String, required: true },
    price: { type: Number },
    image: { type: String, required: true },
    location: { type: String, required: true },
    tags: [{ type: String }],
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Restaurant", restaurantSchema);
