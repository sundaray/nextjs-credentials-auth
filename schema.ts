import { z } from "zod";

export const SignInEmailPasswordFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" })
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "contain at least one letter" })
    .regex(/[0-9]/, { message: "contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "contain at least one special character.",
    })
    .trim(),
});

export const ResetPasswordFormSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "contain at least one letter" })
      .regex(/[0-9]/, { message: "contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "contain at least one special character",
      })
      .trim(),
    confirmNewPassword: z.string({ required_error: "Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    // This tells Zod which field to attach the error to
    path: ["confirmNewPassword"],
  });
