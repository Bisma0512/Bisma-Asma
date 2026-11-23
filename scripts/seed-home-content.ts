import { PrismaClient } from "@prisma/client";
import {
  HD_PRODUCT_IMAGES,
  HD_SLIDE_IMAGES,
  toHdUnsplashUrl,
} from "../src/lib/product-images";

const prisma = new PrismaClient();

async function main() {
  const bannerCount = await prisma.promoBanner.count();
  if (bannerCount === 0) {
    await prisma.promoBanner.createMany({
      data: [
        {
          text: "Complimentary delivery on orders over Rs 5,000 · Cash on Delivery",
          sortOrder: 0,
          isActive: true,
        },
        {
          text: "New: Spring Capsule Edit — lips, cheeks & glow essentials",
          sortOrder: 1,
          isActive: true,
        },
        {
          text: "Clean • Vegan formulas crafted for Pakistani skin tones",
          sortOrder: 2,
          isActive: true,
        },
      ],
    });
    console.log("banners seeded");
  } else {
    console.log("banners exist", bannerCount);
  }

  const slideCount = await prisma.homeSlide.count();
  if (slideCount === 0) {
    await prisma.homeSlide.createMany({
      data: HD_SLIDE_IMAGES.map((s, i) => ({
        imageUrl: s.imageUrl,
        title: s.title,
        subtitle: s.subtitle,
        linkUrl: s.linkUrl,
        sortOrder: i,
        isActive: true,
      })),
    });
    console.log("slides seeded");
  } else {
    const slides = await prisma.homeSlide.findMany({ orderBy: { sortOrder: "asc" } });
    for (let i = 0; i < slides.length; i++) {
      const hd = HD_SLIDE_IMAGES[i % HD_SLIDE_IMAGES.length];
      await prisma.homeSlide.update({
        where: { id: slides[i].id },
        data: { imageUrl: hd.imageUrl },
      });
    }
    console.log("slides upgraded to HD", slides.length);
  }

  const products = await prisma.product.findMany({ select: { id: true, images: true } });
  let updated = 0;
  for (let i = 0; i < products.length; i++) {
    const next = [
      HD_PRODUCT_IMAGES[i % HD_PRODUCT_IMAGES.length],
      ...products[i].images.slice(1).map(toHdUnsplashUrl),
    ];
    const changed = JSON.stringify(next) !== JSON.stringify(products[i].images);
    if (changed) {
      await prisma.product.update({
        where: { id: products[i].id },
        data: { images: next },
      });
      updated++;
    }
  }
  console.log("products images upgraded", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
