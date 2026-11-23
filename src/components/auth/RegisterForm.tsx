"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { validateRegisterInput } from "@/app/actions/customers";
import { formatZodError, registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      setError(formatZodError(parsed.error));
      setPending(false);
      return;
    }

    const verified = await validateRegisterInput(raw);
    if (!verified.ok) {
      setError(verified.error);
      setPending(false);
      return;
    }

    const { name, email, phone, password } = verified.data;
    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
      phone,
    });
    setPending(false);
    if (err) {
      setError(err.message || "Registration failed");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6"
      noValidate
    >
      {error ? (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">
          {error}
        </p>
      ) : null}
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        error={fieldErrors.name}
        hint="Letters only, at least 2 characters"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={fieldErrors.email}
        hint="We’ll use this to sign you in"
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="03XXXXXXXXX"
        error={fieldErrors.phone}
        hint="Pakistan mobile: 03XXXXXXXXX or +923XXXXXXXXX"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
        hint="Min 8 chars · letter · number · special character"
      />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-espresso py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-espresso">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border bg-surface px-3 py-2.5 outline-none focus:border-primary ${
          error ? "border-critical" : "border-outline"
        }`}
      />
      {error ? (
        <p className="mt-1 text-xs text-critical">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-taupe">{hint}</p>
      ) : null}
    </div>
  );
}
