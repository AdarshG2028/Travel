import { z } from "zod";

export const phoneSchema = z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number");

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  email: z.string().trim().email().max(120),
  destination: z.string().trim().min(2).max(80),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  travelers: z.coerce.number().int().min(1).max(100),
  budget: z.coerce.number().int().min(0).max(10_000_000).optional(),
  requirements: z.string().trim().max(2000).optional(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const listQuerySchema = z.object({
  destination: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type ListQuery = z.infer<typeof listQuerySchema>;
