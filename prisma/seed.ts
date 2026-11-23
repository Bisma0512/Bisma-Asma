import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

const IMAGES = [
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
];

const SHADES = [
  { name: "Rose Nude", hex: "#C48B7A" },
  { name: "Berry Crush", hex: "#8B3A4A" },
  { name: "Honey Glow", hex: "#D4A574" },
  { name: "Coral Sunset", hex: "#E07A5F" },
  { name: "Deep Mocha", hex: "#5C4033" },
  { name: "Soft Mauve", hex: "#B08AAA" },
  { name: "Classic Red", hex: "#A4161A" },
  { name: "Champagne", hex: "#E8D5B7" },
];

type ProductDef = {
  name: string;
  description: string;
  category: string;
  price: number;
  compareAt?: number;
  featured?: boolean;
  badges?: string[];
  shadeCount?: number;
};

function buildCatalog(): ProductDef[] {
  const lips = [
    "Velvet Matte Lipstick",
    "Satin Lip Color",
    "Sheer Lip Gloss",
    "Lip Oil Tinted",
    "Longwear Liquid Lip",
    "Creamy Lip Crayon",
    "Hydrating Lip Balm Tint",
    "Plumping Lip Serum",
    "Matte Lip Stain",
    "Glazed Lip Lacquer",
    "Nude Lip Pencil",
    "Bold Berry Lipstick",
    "Peach Melba Gloss",
    "Karachi Kiss Matte",
    "Lahore Rose Stain",
  ];
  const cheeks = [
    "Cream Blush Stick",
    "Powder Blush Compact",
    "Liquid Cheek Tint",
    "Bronzer Duo",
    "Highlighter Palette",
    "Glow Blush Balm",
    "Matte Contour Stick",
    "Soft Focus Blush",
    "Sunlit Bronzing Powder",
    "Champagne Highlighter",
    "Dewy Cheek Oil",
    "Silk Cloud Blush",
  ];
  const complexion = [
    "Lightweight Foundation",
    "Skin Tint SPF 30",
    "Concealer Stick",
    "Setting Powder Loose",
    "Setting Mist Spray",
    "BB Cream Glow",
    "CC Cream Corrector",
    "Matte Powder Foundation",
    "Hydra Foundation Serum",
    "Under Eye Brightener",
    "Color Corrector Palette",
    "Primer Soft Focus",
    "Baking Powder Translucent",
    "Tinted Moisturizer",
    "Full Coverage Foundation",
  ];
  const eyes = [
    "Kajal Intense Black",
    "Volume Mascara",
    "Eyeshadow Quad",
    "Liquid Eyeliner Pen",
    "Brow Pencil Dual",
    "Shimmer Shadow Stick",
    "Lengthening Mascara",
    "Smudge Proof Kajal",
    "Nude Eye Palette",
    "Gel Eyeliner Pot",
    "Brow Gel Clear",
    "Glitter Liner",
    "Matte Shadow Single",
    "Lash Primer",
  ];
  const sets = [
    "Bridal Glow Kit",
    "Everyday Essentials Set",
    "Lip Trio Bundle",
    "Cheek & Glow Duo",
    "Travel Mini Kit",
    "Eid Edit Set",
    "Office Soft Glam Kit",
    "Festive Party Palette Set",
  ];
  const skincare = [
    "Rose Mist Toner",
    "Vitamin C Serum",
    "Niacinamide Gel",
    "Hydra Face Cream",
    "Clay Mask Stick",
    "Lip Sleeping Mask",
    "Eye Cream Soft",
    "Sunscreen Fluid SPF 50",
    "Micellar Cleansing Water",
    "Gentle Foam Cleanser",
  ];
  const tools = [
    "Blending Sponge",
    "Foundation Brush",
    "Lip Brush Precision",
    "Powder Puff Soft",
    "Brow Brush Duo",
    "Makeup Mirror Compact",
    "Brush Cleaning Mat",
    "Travel Brush Set",
  ];

  const out: ProductDef[] = [];
  const push = (
    names: string[],
    category: string,
    base: number,
    shadeCount = 3
  ) => {
    names.forEach((name, i) => {
      out.push({
        name: `Bisma ${name}`,
        description: `${name} by Bisma & Asma Cosmetics — crafted for Pakistani skin tones with a clean, luminous finish. Ideal for everyday and festive wear.`,
        category,
        price: base + (i % 5) * 150,
        compareAt: base + (i % 5) * 150 + 400,
        featured: i < 2,
        badges: i === 0 ? ["Best Seller"] : i === 1 ? ["New"] : ["Clean"],
        shadeCount,
      });
    });
  };

  push(lips, "Lips", 1499, 4);
  push(cheeks, "Cheeks", 1699, 4);
  push(complexion, "Complexion", 2499, 5);
  push(eyes, "Eyes", 1299, 3);
  push(sets, "Sets", 3999, 2);
  push(skincare, "Skincare", 1899, 1);
  push(tools, "Tools", 799, 1);

  // Asma line to push past 100
  const asmaExtras = [
    "Asma Soft Matte Lip",
    "Asma Dew Blush",
    "Asma Skin Veil",
    "Asma Wing Liner",
    "Asma Brow Define",
    "Asma Glow Drops",
    "Asma Fixing Spray",
    "Asma Lip Liner Duo",
    "Asma Mini Lip Vault",
    "Asma Sheer Tint",
    "Asma Velvet Contour",
    "Asma Pearl Highlighter",
    "Asma Karachi Nude Lip",
    "Asma Multani Clay Mask",
    "Asma Henna Glow Bronzer",
    "Asma Mendi Inspired Liner",
    "Asma Eid Soft Glam Kit",
    "Asma Office Nude Duo",
    "Asma Wedding Highlight",
    "Asma Desi Rose Blush",
    "Asma Silk Skin Primer",
    "Asma Overnight Lip Mask",
  ];
  asmaExtras.forEach((name, i) => {
    const cats = ["Lips", "Cheeks", "Complexion", "Eyes", "Sets", "Skincare"] as const;
    out.push({
      name,
      description: `${name} — signature Asma edit for luminous Pakistani glam. Buildable, blendable, and COD-ready.`,
      category: cats[i % cats.length],
      price: 1599 + i * 100,
      featured: i < 3,
      badges: ["Asma Edit"],
      shadeCount: 3,
    });
  });

  return out;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding Bisma & Asma Cosmetics…");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.homeSlide.deleteMany();
  await prisma.promoBanner.deleteMany();
  await prisma.siteSettings.deleteMany();

  await prisma.siteSettings.create({
    data: {
      id: "default",
      storeName: "Bisma & Asma Cosmetics",
      facebookUrl: "https://facebook.com/bismaasmacosmetics",
      instagramUrl: "https://instagram.com/bismaasmacosmetics",
    },
  });

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

  await prisma.homeSlide.createMany({
    data: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2000&q=90",
        title: "Luminous Beauty",
        subtitle: "Shop the viral edit",
        linkUrl: "/shop",
        sortOrder: 0,
        isActive: true,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=2000&q=90",
        title: "Soft Glam Cheeks",
        subtitle: "Blush & bronze essentials",
        linkUrl: "/shop/cheeks",
        sortOrder: 1,
        isActive: true,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=2000&q=90",
        title: "Dewy Complexion",
        subtitle: "Skin-first base & glow",
        linkUrl: "/shop/complexion",
        sortOrder: 2,
        isActive: true,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=2000&q=90",
        title: "Lip Glaze Ritual",
        subtitle: "Oils, tints & stains",
        linkUrl: "/shop/lips",
        sortOrder: 3,
        isActive: true,
      },
    ],
  });

  const categories = [
    { name: "Lips", slug: "lips", description: "Lipsticks, glosses & oils", sortOrder: 1 },
    { name: "Cheeks", slug: "cheeks", description: "Blush, bronze & glow", sortOrder: 2 },
    { name: "Complexion", slug: "complexion", description: "Base & finish", sortOrder: 3 },
    { name: "Eyes", slug: "eyes", description: "Kajal, liner & shadow", sortOrder: 4 },
    { name: "Sets", slug: "sets", description: "Curated kits", sortOrder: 5 },
    { name: "Skincare", slug: "skincare", description: "Prep & care", sortOrder: 6 },
    { name: "Tools", slug: "tools", description: "Brushes & accessories", sortOrder: 7 },
  ];

  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.name, created.id);
  }

  const catalog = buildCatalog();
  console.log(`Creating ${catalog.length} products…`);

  let i = 0;
  for (const item of catalog) {
    const categoryId = categoryMap.get(item.category)!;
    const image = IMAGES[i % IMAGES.length];
    const shadeCount = item.shadeCount ?? 3;
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: `${slugify(item.name)}-${i + 1}`,
        description: item.description,
        categoryId,
        basePricePkr: item.price,
        compareAtPkr: item.compareAt ?? null,
        images: [image],
        badges: item.badges ?? [],
        isFeatured: Boolean(item.featured),
        isActive: true,
        variants: {
          create: Array.from({ length: shadeCount }).map((_, si) => {
            const shade = SHADES[si % SHADES.length];
            return {
              shadeName: shade.name,
              shadeHex: shade.hex,
              sku: `BA-${String(i + 1).padStart(3, "0")}-${si + 1}`,
              stock: 40 + ((i + si) % 60),
            };
          }),
        },
      },
    });
    void product;
    i++;
  }

  const password = await hashPassword("Admin123!ChangeMe");
  const admin = await prisma.user.create({
    data: {
      name: "Bisma Admin",
      email: "admin@bismaasma.pk",
      emailVerified: true,
      role: Role.ADMIN,
    },
  });
  await prisma.account.create({
    data: {
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password,
    },
  });

  console.log(`Seeded ${catalog.length} products.`);
  console.log(`Admin: ${admin.email} / Admin123!ChangeMe`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
