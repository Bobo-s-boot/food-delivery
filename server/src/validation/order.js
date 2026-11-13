import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
const orderStatuses = [
  "pending",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];
const optionalText = (max) => z.string().trim().max(max).optional();

const orderItemSchema = z
  .object({
    id: objectIdSchema.optional(),
    _id: objectIdSchema.optional(),
    foodId: objectIdSchema.optional(),
    quantity: z.number().int().min(1).max(100),
  })
  .refine((item) => item.id || item._id || item.foodId)
  .transform((item) => ({
    dishId: item.id || item._id || item.foodId,
    quantity: item.quantity,
  }));

const orderBodySchema = z
  .object({
    customerName: optionalText(160),
    customerPhone: optionalText(40),
    customerEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
    customer: z
      .object({
        firstName: optionalText(80),
        lastName: optionalText(80),
        phone: optionalText(40),
        email: z.string().trim().email().max(254).optional().or(z.literal("")),
      })
      .optional(),
    address: optionalText(500),
    delivery: z
      .object({
        address: optionalText(500),
        method: z.enum(["delivery", "pickup"]).optional(),
      })
      .optional(),
    notes: optionalText(1500),
    preferences: z
      .object({
        notes: optionalText(1500),
        deliveryPreferences: z.array(z.string().trim().max(80)).max(20).optional(),
      })
      .optional(),
    deliveryPreferences: z.array(z.string().trim().max(80)).max(20).optional(),
    paymentMethod: z
      .enum(["Credit / Debit Card", "Apple Pay", "Cash to courier"])
      .optional(),
    payment: z
      .object({
        method: z
          .enum(["Credit / Debit Card", "Apple Pay", "Cash to courier"])
          .optional(),
        stripePaymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]+$/).optional(),
      })
      .optional(),
    stripePaymentIntentId: z
      .string()
      .regex(/^pi_[A-Za-z0-9]+$/)
      .nullable()
      .optional(),
    deliveryMethod: z.enum(["delivery", "pickup"]).optional(),
    items: z.array(orderItemSchema).min(1).max(50),
  })
  .refine(
    (body) =>
      Boolean(
        body.customerName?.trim() ||
          [body.customer?.firstName, body.customer?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim(),
      ),
    { message: "Customer name is required.", path: ["customerName"] },
  )
  .refine(
    (body) => Boolean(body.customerPhone?.trim() || body.customer?.phone?.trim()),
    { message: "Customer phone is required.", path: ["customerPhone"] },
  )
  .refine(
    (body) => Boolean(body.address?.trim() || body.delivery?.address?.trim()),
    { message: "Delivery address is required.", path: ["address"] },
  )
  .transform((body) => ({
    customerName:
      body.customerName ||
      [body.customer?.firstName, body.customer?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim(),
    customerPhone: body.customerPhone || body.customer?.phone || "",
    customerEmail: body.customerEmail || body.customer?.email || "",
    address: body.address || body.delivery?.address || "",
    notes: body.notes || body.preferences?.notes || "",
    deliveryPreferences:
      body.deliveryPreferences ||
      body.preferences?.deliveryPreferences ||
      [],
    paymentMethod:
      body.paymentMethod || body.payment?.method || "Cash to courier",
    stripePaymentIntentId:
      body.stripePaymentIntentId ??
      body.payment?.stripePaymentIntentId ??
      null,
    deliveryMethod: body.deliveryMethod || body.delivery?.method || "delivery",
    items: body.items,
  }));

export const createOrderSchema = z.preprocess((input) => {
  if (
    typeof input !== "object" ||
    input === null ||
    !("body" in input) ||
    typeof input.body !== "string"
  ) {
    return input;
  }

  try {
    return JSON.parse(input.body);
  } catch {
    return undefined;
  }
}, orderBodySchema);

export const orderIdSchema = objectIdSchema;
export const orderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});
export const orderQuerySchema = z.object({
  status: z.enum(orderStatuses).optional(),
});
