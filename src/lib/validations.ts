import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password too long" }),
  firstName: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name cant be longer than 30 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name cant be longer than 30 characters" }),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});
