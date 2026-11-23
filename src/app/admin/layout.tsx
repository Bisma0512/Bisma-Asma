import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getSiteSettings } from "@/lib/site";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/login?next=/admin");
  const site = await getSiteSettings();

  return (
    <AdminShell
      storeName={site.storeName}
      logoUrl={site.logoUrl}
      facebookUrl={site.facebookUrl}
      instagramUrl={site.instagramUrl}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AdminShell>
  );
}
