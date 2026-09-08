import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import SupportTicket from "../models/supportTicket.js";
import User from "../models/user.js";

const SUPPORT_UPLOAD_DIR = path.resolve("uploads", "support");
const CATEGORY_LABELS = {
  account_profile: "Account & profile",
  order_delivery: "Order or delivery",
  restaurant_information: "Restaurant information",
  offer_discount: "Offer or discount",
  student_discount: "Student Discount",
  payment_refund: "Payment or refund",
  technical_problem: "Technical problem",
  other: "Other",
};
const STUDENT_STATUSES = new Set([
  "Not verified",
  "Pending",
  "Verified",
  "Action required",
  "Rejected",
  "Expired",
]);

const cleanText = (value, maxLength) =>
  String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);

const removeStoredFiles = async (storedNames = []) => {
  await Promise.all(
    storedNames.map((storedName) =>
      unlink(path.join(SUPPORT_UPLOAD_DIR, storedName)).catch(() => undefined),
    ),
  );
};

export const createSupportTicket = async (req, res) => {
  const storedNames = [];

  try {
    const user = await User.findOne({
      $or: [
        { id: req.user.id },
        { username: req.user.username },
        { _id: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : null },
      ].filter(Boolean),
    }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "A valid user account is required." });
    }

    const category = cleanText(req.body.category, 50);
    const subject = cleanText(req.body.subject, 120);
    const description = cleanText(req.body.description, 1500);
    const requesterEmail = cleanText(user.email || user.username, 254);

    if (!CATEGORY_LABELS[category]) {
      return res.status(400).json({ message: "Select an issue category." });
    }
    if (subject.length < 5) {
      return res.status(400).json({ message: "Subject must contain at least 5 characters." });
    }
    if (description.length < 20) {
      return res.status(400).json({ message: "Describe the problem in at least 20 characters." });
    }
    if (!/^\S+@\S+\.\S+$/.test(requesterEmail)) {
      return res.status(400).json({ message: "A valid account email is required." });
    }

    const relatedRestaurantId = cleanText(req.body.relatedRestaurantId, 80);
    if (
      relatedRestaurantId &&
      !mongoose.Types.ObjectId.isValid(relatedRestaurantId)
    ) {
      return res.status(400).json({ message: "The selected restaurant is invalid." });
    }

    const studentStatus = STUDENT_STATUSES.has(req.body.studentStatus)
      ? req.body.studentStatus
      : user.studentStatus || "Not verified";
    const ticket = new SupportTicket({
      ticketId: "PENDING",
      userId: user._id,
      userApplicationId: user.id,
      requesterName: cleanText(user.fullName || user.username, 160),
      requesterEmail,
      category,
      subject,
      description,
      relatedOrderId: cleanText(req.body.relatedOrderId, 100),
      relatedRestaurantId: relatedRestaurantId || null,
      relatedOfferId: cleanText(req.body.relatedOfferId, 120),
      studentStatus,
      clientMetadata: {
        route: cleanText(req.body.route, 500),
        affectedFeature: cleanText(req.body.affectedFeature, 80),
        userAgent: cleanText(req.body.userAgent, 500),
        platform: cleanText(req.body.platform, 120),
        language: cleanText(req.body.language, 40),
        viewport: cleanText(req.body.viewport, 40),
      },
      status: "Open",
      source: "User website",
      conversation: [{ author: "Customer", text: description }],
    });

    ticket.ticketId = `SUP-${ticket._id.toString().slice(-8).toUpperCase()}`;

    if (req.files?.length) {
      await mkdir(SUPPORT_UPLOAD_DIR, { recursive: true });

      for (const file of req.files) {
        const extension = path.extname(file.originalname).toLowerCase();
        const storedName = `${ticket.ticketId}-${randomUUID()}${extension}`;
        await writeFile(path.join(SUPPORT_UPLOAD_DIR, storedName), file.buffer);
        storedNames.push(storedName);
        ticket.attachments.push({
          originalName: cleanText(file.originalname, 240),
          storedName,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    }

    await ticket.save();

    return res.status(201).json({
      ticketId: ticket.ticketId,
      status: ticket.status,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    await removeStoredFiles(storedNames);
    console.error("Unable to create support request:", error.message);
    return res.status(500).json({
      message: "Unable to create the support request.",
    });
  }
};

export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("relatedRestaurantId", "name id")
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json(
      tickets.map((ticket) => ({
        ...ticket,
        categoryLabel: CATEGORY_LABELS[ticket.category] || ticket.category,
        attachments: (ticket.attachments || []).map((attachment) => ({
          _id: attachment._id,
          originalName: attachment.originalName,
          mimeType: attachment.mimeType,
          size: attachment.size,
        })),
      })),
    );
  } catch (error) {
    console.error("Unable to load support tickets:", error.message);
    return res.status(500).json({
      message: "Unable to load support tickets.",
    });
  }
};

export const getUserSupportTickets = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { id: req.user.id },
        { username: req.user.username },
        { _id: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : null },
      ].filter(Boolean),
    });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const query = {
      $or: [
        { userId: user._id },
        { userApplicationId: user.id },
        { requesterEmail: user.email || user.username },
      ],
    };

    const tickets = await SupportTicket.find(query)
      .populate("relatedRestaurantId", "name id")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(
      tickets.map((ticket) => ({
        ...ticket,
        categoryLabel: CATEGORY_LABELS[ticket.category] || ticket.category,
      })),
    );
  } catch (error) {
    console.error("Unable to load user support tickets:", error.message);
    return res.status(500).json({
      message: "Unable to load support tickets.",
    });
  }
};

export const updateSupportTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      "New",
      "Open",
      "Waiting for customer",
      "Waiting for restaurant",
      "Waiting for internal action",
      "Resolved",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid ticket status." });
    }

    const ticket = await SupportTicket.findOne({
      $or: [
        { ticketId },
        { _id: mongoose.Types.ObjectId.isValid(ticketId) ? ticketId : null },
      ].filter(Boolean),
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    ticket.status = status;
    if (note) {
      ticket.conversation.push({
        author: req.user?.username ? `Admin (${req.user.username})` : "Support team",
        text: note,
        timestamp: new Date(),
      });
    } else if (status === "Resolved") {
      ticket.conversation.push({
        author: "Support note",
        text: "Ticket marked as resolved by the administrator.",
        timestamp: new Date(),
      });
    }

    await ticket.save();

    return res.status(200).json({
      ticketId: ticket.ticketId,
      status: ticket.status,
      updatedAt: ticket.updatedAt,
      conversation: ticket.conversation,
    });
  } catch (error) {
    console.error("Unable to update support ticket status:", error.message);
    return res.status(500).json({
      message: "Unable to update support ticket status.",
    });
  }
};

export const addSupportTicketTimelineEntry = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { author, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message text is required." });
    }

    const ticket = await SupportTicket.findOne({
      $or: [
        { ticketId },
        { _id: mongoose.Types.ObjectId.isValid(ticketId) ? ticketId : null },
      ].filter(Boolean),
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const entry = {
      author: cleanText(author || req.user?.username || "Support team", 80),
      text: cleanText(text, 1500),
      timestamp: new Date(),
    };

    ticket.conversation.push(entry);
    await ticket.save();

    return res.status(200).json(entry);
  } catch (error) {
    console.error("Unable to add timeline entry:", error.message);
    return res.status(500).json({
      message: "Unable to add timeline entry.",
    });
  }
};

export const downloadSupportAttachment = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });
    const attachment = ticket?.attachments.id(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found." });
    }

    return res.download(
      path.join(SUPPORT_UPLOAD_DIR, path.basename(attachment.storedName)),
      attachment.originalName,
    );
  } catch (error) {
    console.error("Unable to download support attachment:", error.message);
    return res.status(500).json({
      message: "Unable to download the attachment.",
    });
  }
};

export { CATEGORY_LABELS };

