"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import {
  createCustomerSchema,
  formatZodError,
} from "@/lib/validation/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function assertUniqueCustomerCredentials(
  email: string,
  phone: string,
): Promise<ActionResult> {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
    select: { email: true, phone: true },
  });
  if (!existing) return { ok: true };
  if (existing.email === email) {
    return { ok: false, error: "This email is already registered" };
  }
  if (existing.phone === phone) {
    return { ok: false, error: "This phone number is already registered" };
  }
  return { ok: false, error: "Account already exists" };
}

export async function validateRegisterInput(input: unknown): Promise<
  | { ok: true; data: { name: string; email: string; phone: string; password: string } }
  | { ok: false; error: string }
> {
  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }
  const unique = await assertUniqueCustomerCredentials(
    parsed.data.email,
    parsed.data.phone,
  );
  if (!unique.ok) return unique;
  return {
    ok: true,
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    },
  };
}

export async function createCustomerAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = createCustomerSchema.safeParse({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  });
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }

  const { name, email, phone, password } = parsed.data;
  const unique = await assertUniqueCustomerCredentials(email, phone);
  if (!unique.ok) return unique;

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      emailVerified: false,
      role: Role.USER,
    },
  });
  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashed,
    },
  });

  revalidatePath("/admin/customers");
  return { ok: true };
}
