import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
});

const clientMetadataSchema = new mongoose.Schema(
  {
    route: { type: String, default: "" },
    affectedFeature: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    platform: { type: String, default: "" },
    language: { type: String, default: "" },
    viewport: { type: String, default: "" },
  },
  { _id: false },
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userApplicationId: { type: Number, required: true },
    requesterName: { type: String, required: true, trim: true },
    requesterEmail: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "account_profile",
        "order_delivery",
        "restaurant_information",
        "offer_discount",
        "student_discount",
        "payment_refund",
        "technical_problem",
        "other",
      ],
    },
    subject: { type: String, required: true, trim: true, minlength: 5, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 1500 },
    relatedOrderId: { type: String, default: "", trim: true },
    relatedRestaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },
    relatedOfferId: { type: String, default: "", trim: true },
    studentStatus: {
      type: String,
      enum: [
        "Not verified",
        "Pending",
        "Verified",
        "Action required",
        "Rejected",
        "Expired",
      ],
      default: "Not verified",
    },
    attachments: { type: [attachmentSchema], default: [] },
    clientMetadata: { type: clientMetadataSchema, default: () => ({}) },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: {
      type: String,
      enum: [
        "New",
        "Open",
        "Waiting for customer",
        "Waiting for restaurant",
        "Waiting for internal action",
        "Resolved",
      ],
      default: "Open",
      index: true,
    },
    source: { type: String, default: "User website" },
    conversation: {
      type: [
        {
          author: { type: String, required: true },
          text: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("SupportTicket", supportTicketSchema);
