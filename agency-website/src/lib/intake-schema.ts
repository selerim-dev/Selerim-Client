import { z } from "zod";
export const revenueBands = [
  "Under $5M",
  "$5M–$10M",
  "$10M–$25M",
  "$25M–$50M",
  "$50M–$100M",
  "$100M+",
  "Prefer to discuss",
] as const;
export const timelines = [
  "Within 30 days",
  "In 1–3 months",
  "In 3–6 months",
  "Exploring options",
] as const;
export const budgets = [
  "$2,500 audit first",
  "$7,500–$15,000 build after audit",
  "$15,000+ across future phases",
  "Need help defining a budget",
] as const;
export const intakeSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid work email.").max(254),
  company: z.string().trim().min(2, "Please enter your company.").max(150),
  revenue: z.enum(revenueBands, { error: "Choose a revenue band." }),
  workflow: z
    .string()
    .trim()
    .min(20, "Please describe the workflow in at least 20 characters.")
    .max(3000),
  systems: z
    .string()
    .trim()
    .min(2, "List your systems, or tell us you are unsure.")
    .max(1000),
  timeline: z.enum(timelines, { error: "Choose a timeline." }),
  budget: z.enum(budgets, { error: "Choose a budget band." }),
  website: z.string().max(0).optional(),
});
export type IntakeData = z.infer<typeof intakeSchema>;
