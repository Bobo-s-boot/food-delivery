import { z } from "zod";

export const paymentIntentSchema = z.object({
  amount: z.number().int().positive().max(99_999_999),
  currency: z
    .string()
    .regex(/^[a-z]{3}$/i)
    .transform((value) => value.toLowerCase())
    .optional()
    .default("usd"),
  metadata: z
    .record(z.string().max(500))
    .refine(
      (metadata) =>
        Object.keys(metadata).length <= 50 &&
        Object.keys(metadata).every((key) => key.length <= 40),
    )
    .optional()
    .default({}),
});

export const stripeWebhookSchema = z.object({
  signature: z.string().min(1),
  body: z.custom((value) => Buffer.isBuffer(value)),
});
