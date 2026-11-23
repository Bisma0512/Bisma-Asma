"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCustomerAction } from "@/app/actions/customers";

export function CustomerForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const result = await createCustomerAction(fd);
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 rounded-2xl border border-outline/40 bg-white p-6"
      noValidate
    >
      {error ? (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">
          {error}
        </p>
      ) : null}
      <Field label="Full name" name="name" />
      <Field label="Email" name="email" type="email" />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        placeholder="03XXXXXXXXX"
        hint="Pakistan mobile format"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        hint="Min 8 · letter · number · special character"
      />
      <Field label="Confirm password" name="confirmPassword" type="password" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create customer"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
      />
      {hint ? <p className="mt-1 text-xs text-taupe">{hint}</p> : null}
    </div>
  );
}
