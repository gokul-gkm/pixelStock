import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name must not exceed 40 characters")
      .regex(
        /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
        "Name can contain letters, numbers, and single spaces only",
      )
      .refine((value) => (value.match(/[a-zA-Z]/g)?.length ?? 0) >= 3, {
        message: "Name must contain at least 3 letters",
      }),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(5, "Email is too short")
      .email("Invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must have at least 3 characters before @",
      ),
    phone: z.string().refine(
      (value) => {
        const phone = parsePhoneNumberFromString(value);
        return phone?.isValid();
      },
      {
        message: "Enter a valid international phone number",
      },
    ),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must match the password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });
