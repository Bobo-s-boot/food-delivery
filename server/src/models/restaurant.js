import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    tags: [{ type: String }],
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Restaurant", restaurantSchema);
