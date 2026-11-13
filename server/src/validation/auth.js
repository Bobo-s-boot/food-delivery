import { z } from "zod";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(254),
  password: z
    .string()
    .min(1)
    .refine((value) => new TextEncoder().encode(value).length <= 72),
});

export const registerSchema = credentialsSchema;
export const loginSchema = credentialsSchema;
