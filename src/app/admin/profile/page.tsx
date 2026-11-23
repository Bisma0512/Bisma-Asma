import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import {
  changeAdminPassword,
  updateAdminProfile,
} from "@/app/actions/admin";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  if (!session) redirect("/login?next=/admin/profile");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-espresso">Admin profile</h1>
        <p className="mt-1 text-taupe">{session.user.email}</p>
      </div>

      <form
        action={updateAdminProfile}
        className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6"
      >
        <div>
          <label className="text-sm font-semibold">Display name</label>
          <input
            name="name"
            defaultValue={session.user.name}
            required
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Avatar image URL</label>
          <input
            name="image"
            defaultValue={session.user.image ?? ""}
            placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <button className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white">
          Save profile
        </button>
      </form>

      <form
        action={changeAdminPassword}
        className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6"
      >
        <h2 className="font-display text-xl">Change password</h2>
        <div>
          <label className="text-sm font-semibold">Current password</label>
          <input
            name="currentPassword"
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">New password</label>
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          Update password
        </button>
      </form>

      <SignOutButton />
    </div>
  );
}
