import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must be 100 characters or less"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required"),

  brand: z
    .string()
    .trim()
    .max(100, "Brand must be 100 characters or less")
    .optional(),
});

