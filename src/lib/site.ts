import { prisma } from "@/lib/prisma";

export const DEFAULT_SITE = {
  storeName: "Bisma & Asma Cosmetics",
  logoUrl: null as string | null,
  facebookUrl: "https://facebook.com/bismaasmacosmetics",
  instagramUrl: "https://instagram.com/bismaasmacosmetics",
};

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!settings) return DEFAULT_SITE;
    return {
      storeName: settings.storeName,
      logoUrl: settings.logoUrl,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
    };
  } catch {
    return DEFAULT_SITE;
  }
}
