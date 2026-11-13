import { z } from "zod";

const userIdStringSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(z.number().int().min(1).max(Number.MAX_SAFE_INTEGER));

export const userIdSchema = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : value),
  userIdStringSchema,
);
