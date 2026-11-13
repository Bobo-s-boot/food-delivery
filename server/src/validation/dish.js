import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
const optionalText = z.string().trim().max(2000).optional();

const dishFieldsSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  description: optionalText,
  price: z.number().finite().nonnegative().optional(),
  image: z.string().trim().max(2048).optional(),
  category: z.string().trim().max(120).optional(),
  restaurantId: objectIdSchema.optional(),
  restaurant: objectIdSchema.optional(),
});

export const createDishSchema = dishFieldsSchema
  .refine((value) => value.name !== undefined && value.price !== undefined)
  .refine((value) => value.restaurantId !== undefined || value.restaurant !== undefined)
  .transform(({ restaurant, ...dish }) => ({
    ...dish,
    restaurantId: dish.restaurantId || restaurant,
  }));

export const updateDishSchema = dishFieldsSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0)
  .refine(
    (value) =>
      value.restaurantId === undefined ||
      value.restaurant === undefined ||
      value.restaurantId === value.restaurant,
    { message: "Provide only one restaurant identifier." },
  )
  .transform(({ restaurant, ...dish }) => ({
    ...dish,
    ...(dish.restaurantId || restaurant
      ? { restaurantId: dish.restaurantId || restaurant }
      : {}),
  }));

export const dishIdSchema = objectIdSchema;

export const dishesQuerySchema = z.object({
  restaurantId: z
    .string()
    .trim()
    .refine(
      (value) =>
        /^[a-f\d]{24}$/i.test(value) ||
        (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))),
    )
    .optional(),
  q: z.string().trim().max(120).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional(),
});
