import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HomeHero } from "@/components/store/home/HomeHero";
import { HomeSlider } from "@/components/store/home/HomeSlider";
import { ShadeDiagnostic } from "@/components/store/home/ShadeDiagnostic";
import { RoutineKit } from "@/components/store/home/RoutineKit";
import { ReviewsSection } from "@/components/store/home/ReviewsSection";
import { TrustStrip } from "@/components/store/home/TrustStrip";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, slides, lips, cheeks, complexion] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true, category: true },
      take: 12,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.homeSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findFirst({
      where: { isActive: true, category: { slug: "lips" } },
      include: { variants: true },
      orderBy: { isFeatured: "desc" },
    }),
    prisma.product.findFirst({
      where: { isActive: true, category: { slug: "cheeks" } },
      include: { variants: true },
      orderBy: { isFeatured: "desc" },
    }),
    prisma.product.findFirst({
      where: { isActive: true, category: { slug: "complexion" } },
      include: { variants: true },
      orderBy: { isFeatured: "desc" },
    }),
  ]);

  const heroProduct = featured[0] ?? null;
  const trending = featured.slice(0, 12);

  return (
    <div>
      <HomeHero
        product={
          heroProduct
            ? {
                id: heroProduct.id,
                name: heroProduct.name,
                slug: heroProduct.slug,
                description: heroProduct.description,
                basePricePkr: heroProduct.basePricePkr,
                images: heroProduct.images,
                variants: heroProduct.variants.map((v) => ({
                  id: v.id,
                  shadeName: v.shadeName,
                  shadeHex: v.shadeHex,
                })),
              }
            : null
        }
      />

      <Reveal>
        <HomeSlider
          slides={slides.map((s) => ({
            id: s.id,
            imageUrl: s.imageUrl,
            title: s.title,
            subtitle: s.subtitle,
            linkUrl: s.linkUrl,
          }))}
        />
      </Reveal>

      <section
        id="trending-section"
        className="w-full bg-surface-low py-16 md:py-24"
      >
        <Reveal>
          <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  Trending Drops
                </p>
                <h2 className="mt-2 font-display text-3xl text-espresso md:text-4xl">
                  The Trending Drops
                </h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-primary">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
              {trending.map((product, i) => (
                <Reveal key={product.id} delayMs={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            {trending.length === 0 ? (
              <p className="text-taupe">Products will appear after seeding.</p>
            ) : null}
          </div>
        </Reveal>
      </section>

      <ShadeDiagnostic />

      <RoutineKit
        lip={
          lips
            ? {
                id: lips.id,
                name: lips.name,
                basePricePkr: lips.basePricePkr,
                variants: lips.variants.map((v) => ({
                  id: v.id,
                  shadeName: v.shadeName,
                  shadeHex: v.shadeHex,
                })),
              }
            : null
        }
        blush={
          cheeks
            ? {
                id: cheeks.id,
                name: cheeks.name,
                basePricePkr: cheeks.basePricePkr,
                variants: cheeks.variants.map((v) => ({
                  id: v.id,
                  shadeName: v.shadeName,
                  shadeHex: v.shadeHex,
                })),
              }
            : null
        }
        complexion={
          complexion
            ? {
                id: complexion.id,
                name: complexion.name,
                basePricePkr: complexion.basePricePkr,
                variants: complexion.variants.map((v) => ({
                  id: v.id,
                  shadeName: v.shadeName,
                  shadeHex: v.shadeHex,
                })),
              }
            : null
        }
      />

      <ReviewsSection />
      <TrustStrip />
    </div>
  );
}
