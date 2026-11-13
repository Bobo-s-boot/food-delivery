import { z } from "zod";

const optionalText = z.string().trim().optional();

export const restaurantCreateSchema = z.object({
  name: z.string().trim().min(1),
  cuisine: z.string().trim().min(1),
  title: optionalText,
  badge: optionalText,
  description: optionalText,
  category: z.string().trim().min(1),
  rating: optionalText,
  price: z.number().finite().nonnegative().optional(),
  image: optionalText,
  location: optionalText,
  tags: z.array(z.string().trim().min(1)).optional(),
});

export const restaurantUpdateSchema = restaurantCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0);

export const restaurantQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional(),
});

export const restaurantNumericIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(z.number().int().max(Number.MAX_SAFE_INTEGER));

export const restaurantObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
