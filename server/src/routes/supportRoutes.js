import path from "node:path";
import express from "express";
import multer from "multer";
import {
  createSupportTicket,
  downloadSupportAttachment,
  getSupportTickets,
} from "../controllers/supportController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const supportedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!supportedMimeTypes.has(file.mimetype) || !supportedExtensions.has(extension)) {
      const error = new Error("This file type is not supported.");
      error.code = "UNSUPPORTED_FILE_TYPE";
      callback(error);
      return;
    }
    callback(null, true);
  },
});

const receiveAttachments = (req, res, next) => {
  upload.array("attachments", 3)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The file is larger than the allowed size."
        : error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
          ? "You can upload up to 3 files."
          : error.message || "Unable to process the attachments.";
    res.status(400).json({ message });
  });
};

router.post("/", protect, receiveAttachments, createSupportTicket);
router.get("/", protect, isAdmin, getSupportTickets);
router.get(
  "/:ticketId/attachments/:attachmentId",
  protect,
  isAdmin,
  downloadSupportAttachment,
);

export default router;
