"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
  redirectTo?: string;
  variant?: "button" | "sidebar" | "icon";
};

export function SignOutButton({
  className,
  label = "Log out",
  redirectTo = "/login",
  variant = "button",
}: Props) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        className={cn(
          "rounded-full p-2 text-espresso hover:bg-surface-low",
          className,
        )}
        aria-label={label}
        title={label}
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-critical transition hover:bg-critical/10",
          className,
        )}
      >
        <LogOut className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-outline px-5 py-2.5 text-sm font-semibold text-espresso transition hover:bg-surface-low",
        className,
      )}
    >
      <LogOut className="h-4 w-4" />
      {label}
    </button>
  );
}
