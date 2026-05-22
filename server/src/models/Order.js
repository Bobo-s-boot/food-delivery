import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryTime: {
      type: Number,
      min: 0,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "delivering", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
    },
    courier: {
      type: String,
      default: "Not assigned",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
