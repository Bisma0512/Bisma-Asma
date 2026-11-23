"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ nextPath = "/account" }: { nextPath?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error: err } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (err) {
      setError(err.message || "Sign in failed");
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6">
      {error ? (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">
          {error}
        </p>
      ) : null}
      <div>
        <label className="text-sm font-semibold">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Password</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-espresso py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
