import { z } from "zod";

export const joinSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().transform((str) => new Date(str)),
  height: z.string(),
  education: z.string(),
  occupation: z.string(),
  location: z.string(),
  familyDetails: z.string(),
  spiritualDetails: z.string(),
  diet: z.enum(["Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian"]),
  about: z.string(),
  profileImage: z.string().url(),
  galleryImages: z.array(z.string().url()).max(5),
  hiddenContactInfo: z.boolean().optional(),
});
