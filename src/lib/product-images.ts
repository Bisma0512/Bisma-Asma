/** Curated HD Unsplash makeup images (verified 200, w=2000). */
export const HD_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=90",
] as const;

export const HD_FALLBACK_IMAGE = HD_PRODUCT_IMAGES[0];

export const HD_SLIDE_IMAGES = [
  {
    imageUrl: HD_PRODUCT_IMAGES[0],
    title: "Luminous Beauty",
    subtitle: "Shop the viral edit",
    linkUrl: "/shop",
  },
  {
    imageUrl: HD_PRODUCT_IMAGES[1],
    title: "Soft Glam Cheeks",
    subtitle: "Blush & bronze essentials",
    linkUrl: "/shop/cheeks",
  },
  {
    imageUrl: HD_PRODUCT_IMAGES[7],
    title: "Dewy Complexion",
    subtitle: "Skin-first base & glow",
    linkUrl: "/shop/complexion",
  },
  {
    imageUrl: HD_PRODUCT_IMAGES[2],
    title: "Lip Glaze Ritual",
    subtitle: "Oils, tints & stains",
    linkUrl: "/shop/lips",
  },
] as const;

/** Upgrade legacy / broken Unsplash query params to HD. */
export function toHdUnsplashUrl(url: string): string {
  if (!url.includes("images.unsplash.com")) return url;
  try {
    const u = new URL(url);
    const id = u.pathname.split("/").pop() || "";
    // Known removed assets
    if (
      id.startsWith("photo-1586495777744") ||
      id.startsWith("photo-1571781926291")
    ) {
      return HD_FALLBACK_IMAGE;
    }
    u.search = "";
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", "2000");
    u.searchParams.set("q", "90");
    return u.toString();
  } catch {
    return HD_FALLBACK_IMAGE;
  }
}
