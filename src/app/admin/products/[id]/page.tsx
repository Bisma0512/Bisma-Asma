import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-espresso">Edit product</h1>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          basePricePkr: product.basePricePkr,
          compareAtPkr: product.compareAtPkr,
          images: product.images,
          badges: product.badges,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            shadeName: v.shadeName,
            shadeHex: v.shadeHex,
            sku: v.sku,
            stock: v.stock,
            priceOverridePkr: v.priceOverridePkr,
          })),
        }}
      />
    </div>
  );
}
