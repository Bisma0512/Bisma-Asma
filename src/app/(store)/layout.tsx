import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { getSiteSettings } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, banners] = await Promise.all([
    getSiteSettings(),
    prisma.promoBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, text: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        storeName={site.storeName}
        logoUrl={site.logoUrl}
        banners={banners}
      />
      <main>{children}</main>
      <Footer
        storeName={site.storeName}
        logoUrl={site.logoUrl}
        facebookUrl={site.facebookUrl}
        instagramUrl={site.instagramUrl}
      />
    </div>
  );
}
