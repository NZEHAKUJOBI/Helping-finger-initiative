import { z } from "zod";

/**
 * Schema-first validation: each schema is both the runtime validator
 * (server actions) and the compile-time type (via z.infer).
 */

const name = z.string().trim().min(2, "Please enter your full name").max(100);
const email = z.string().trim().email("Please enter a valid email address");
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,20}$/, "Please enter a valid phone number");
const optionalPhone = z.union([z.literal(""), phone]).optional();

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  subject: z.string().trim().min(3, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export const volunteerSchema = z.object({
  name,
  email,
  phone,
  location: z.string().trim().min(2, "Where are you based?").max(150),
  interests: z.string().trim().min(2, "Tell us which programmes interest you").max(500),
  skills: z.string().trim().max(1000).optional(),
});

export const partnerSchema = z.object({
  organisation: z.string().trim().min(2, "Organisation name is required").max(200),
  contactName: name,
  email,
  phone: optionalPhone,
  partnerType: z.enum([
    "government",
    "ngo",
    "corporate",
    "foundation",
    "community",
    "faith-based",
    "other",
  ]),
  message: z.string().trim().min(10, "Tell us a little about the partnership").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
