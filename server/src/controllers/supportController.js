import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import SupportTicket from "../models/supportTicket.js";
import User from "../models/user.js";
import {
  createSupportTicketSchema,
  supportAttachmentIdSchema,
  supportAttachmentsSchema,
  supportTicketIdSchema,
  supportTimelineSchema,
  updateSupportTicketSchema,
} from "../validation/support.js";

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
    const bodyValidation = createSupportTicketSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: "Invalid support request.",
        errors: bodyValidation.error.flatten(),
      });
    }

    const filesValidation = supportAttachmentsSchema.safeParse(req.files || []);
    if (!filesValidation.success) {
      return res.status(400).json({
        message: "Invalid attachments.",
        errors: filesValidation.error.flatten(),
      });
    }

    const body = bodyValidation.data;
    const files = filesValidation.data;
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

    const category = body.category;
    const subject = cleanText(body.subject, 120);
    const description = cleanText(body.description, 1500);
    const requesterEmail = cleanText(user.email || user.username, 254);

    if (!/^\S+@\S+\.\S+$/.test(requesterEmail)) {
      return res.status(400).json({ message: "A valid account email is required." });
    }

    const relatedRestaurantId = body.relatedRestaurantId;
    const studentStatus = STUDENT_STATUSES.has(user.studentStatus)
      ? user.studentStatus
      : "Not verified";
    const ticket = new SupportTicket({
      ticketId: "PENDING",
      userId: user._id,
      userApplicationId: user.id,
      requesterName: cleanText(user.fullName || user.username, 160),
      requesterEmail,
      category,
      subject,
      description,
      relatedOrderId: cleanText(body.relatedOrderId, 100),
      relatedRestaurantId: relatedRestaurantId || null,
      relatedOfferId: cleanText(body.relatedOfferId, 120),
      studentStatus,
      clientMetadata: {
        route: cleanText(body.route, 500),
        affectedFeature: cleanText(body.affectedFeature, 80),
        userAgent: cleanText(body.userAgent, 500),
        platform: cleanText(body.platform, 120),
        language: cleanText(body.language, 40),
        viewport: cleanText(body.viewport, 40),
      },
      status: "Open",
      source: "User website",
      conversation: [{ author: "Customer", text: description }],
    });

    ticket.ticketId = `SUP-${ticket._id.toString().slice(-8).toUpperCase()}`;

    if (files.length) {
      await mkdir(SUPPORT_UPLOAD_DIR, { recursive: true });

      for (const file of files) {
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
    const idValidation = supportTicketIdSchema.safeParse(req.params.ticketId);
    if (!idValidation.success) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const bodyValidation = updateSupportTicketSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: "Invalid ticket update.",
        errors: bodyValidation.error.flatten(),
      });
    }
    const { status, note } = bodyValidation.data;
    const ticketId = idValidation.data;

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
        text: cleanText(note, 1500),
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
    const idValidation = supportTicketIdSchema.safeParse(req.params.ticketId);
    if (!idValidation.success) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const bodyValidation = supportTimelineSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: "Invalid timeline entry.",
        errors: bodyValidation.error.flatten(),
      });
    }
    const { text } = bodyValidation.data;
    const ticketId = idValidation.data;

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
      author: cleanText(
        req.user?.username ? `Admin (${req.user.username})` : "Support team",
        80,
      ),
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
    const ticketIdValidation = supportTicketIdSchema.safeParse(
      req.params.ticketId,
    );
    const attachmentIdValidation = supportAttachmentIdSchema.safeParse(
      req.params.attachmentId,
    );
    if (!ticketIdValidation.success || !attachmentIdValidation.success) {
      return res.status(400).json({ message: "Invalid attachment reference." });
    }

    const ticket = await SupportTicket.findOne({
      ticketId: ticketIdValidation.data,
    });
    const attachment = ticket?.attachments.id(attachmentIdValidation.data);

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
