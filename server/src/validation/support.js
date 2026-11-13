import { z } from "zod";

const categories = [
  "account_profile",
  "order_delivery",
  "restaurant_information",
  "offer_discount",
  "student_discount",
  "payment_refund",
  "technical_problem",
  "other",
];
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
const text = (max) => z.string().trim().max(max).optional().default("");

export const createSupportTicketSchema = z.object({
  category: z.enum(categories),
  subject: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(1500),
  relatedOrderId: text(100),
  relatedRestaurantId: z
    .union([objectIdSchema, z.literal("")])
    .optional()
    .default(""),
  relatedOfferId: text(120),
  route: text(500),
  affectedFeature: text(80),
  userAgent: text(500),
  platform: text(120),
  language: text(40),
  viewport: text(40),
});

export const updateSupportTicketSchema = z.object({
  status: z.enum([
    "New",
    "Open",
    "Waiting for customer",
    "Waiting for restaurant",
    "Waiting for internal action",
    "Resolved",
  ]),
  note: text(1500),
});

export const supportTimelineSchema = z.object({
  text: z.string().trim().min(1).max(1500),
});

export const supportTicketIdSchema = z
  .string()
  .refine(
    (value) =>
      /^SUP-[A-F\d]{8}$/i.test(value) || objectIdSchema.safeParse(value).success,
  );
export const supportAttachmentIdSchema = objectIdSchema;

export const supportAttachmentsSchema = z
  .array(
    z.object({
      originalname: z.string().min(1).max(255),
      mimetype: z.enum([
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ]),
      size: z.number().int().positive().max(10 * 1024 * 1024),
      buffer: z.custom((value) => Buffer.isBuffer(value)),
    }),
  )
  .max(3);
