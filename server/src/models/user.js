import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, default: null },
    role: { type: String, default: "user" },
    fullName: { type: String, default: "" },
    provider: { type: String, default: "local" },
    providerId: { type: String, default: null },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
