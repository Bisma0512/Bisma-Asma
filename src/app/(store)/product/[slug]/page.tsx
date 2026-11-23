import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { ProductPurchase } from "@/components/store/ProductPurchase";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { variants: true, category: true },
  });
  if (!product) notFound();

  const image =
    product.images[0] ??
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2000&q=90";

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
          unoptimized
          priority
        />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {product.category.name}
        </p>
        <h1 className="mt-2 font-display text-4xl text-espresso">
          {product.name}
        </h1>
        <p className="mt-4 text-2xl font-bold text-espresso">
          {formatPkr(product.basePricePkr)}
        </p>
        {product.compareAtPkr ? (
          <p className="text-sm text-taupe line-through">
            {formatPkr(product.compareAtPkr)}
          </p>
        ) : null}
        <p className="mt-5 leading-relaxed text-taupe">{product.description}</p>
        <div className="mt-8">
          <ProductPurchase
            productId={product.id}
            variants={product.variants.map((v) => ({
              id: v.id,
              shadeName: v.shadeName,
              shadeHex: v.shadeHex,
              stock: v.stock,
              priceOverridePkr: v.priceOverridePkr,
            }))}
            basePricePkr={product.basePricePkr}
          />
        </div>
      </div>
    </div>
  );
}
