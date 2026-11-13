import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
});

export default mongoose.model("Counter", counterSchema);
