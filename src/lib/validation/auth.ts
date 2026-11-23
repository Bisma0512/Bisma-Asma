import { z } from "zod";

/** Pakistan mobile: 03XXXXXXXXX or +923XXXXXXXXX (optional dashes/spaces). */
export const PK_PHONE_REGEX = /^(?:\+92|0)3\d{9}$/;

export function normalizePkPhone(raw: string): string {
  const digits = raw.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+92")) return `0${digits.slice(3)}`;
  if (digits.startsWith("92") && digits.length === 12) return `0${digits.slice(2)}`;
  return digits;
}

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name must be under 80 characters")
  .regex(/^[a-zA-Z\s'.-]+$/, "Name can only include letters, spaces, and . ' -");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(120, "Email is too long");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .transform(normalizePkPhone)
  .refine((v) => PK_PHONE_REGEX.test(v), {
    message: "Enter a valid Pakistani mobile (03XXXXXXXXX or +923XXXXXXXXX)",
  });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createCustomerSchema = registerSchema;

export type RegisterInput = z.infer<typeof registerSchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join(". ");
}

/**
 * Validation types used for customer registration / admin create:
 * 1. Required-field — name, email, phone, password, confirm password
 * 2. Length — min/max on name, email, password
 * 3. Format / pattern — email RFC-ish, Pakistan mobile, name charset
 * 4. Password strength — letter + number + special char, min 8
 * 5. Confirmation match — password === confirmPassword
 * 6. Normalization — phone dashes/spaces → 03XXXXXXXXX; email lowercased
 * 7. Uniqueness (server) — email and phone must not already exist
 * 8. Role guard (server) — public register always USER; only admin creates customers
 *
 * Not enabled yet (needs SMS/email provider): OTP / email link verification.
 */
export const AUTH_VALIDATION_TYPES = [
  "required",
  "length",
  "format",
  "password-strength",
  "confirmation-match",
  "normalization",
  "uniqueness",
  "role-guard",
] as const;
