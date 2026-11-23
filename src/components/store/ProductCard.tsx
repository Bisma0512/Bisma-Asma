import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPkr } from "@/lib/utils";
import { HD_FALLBACK_IMAGE } from "@/lib/product-images";
import { AddToCartButton } from "@/components/store/AddToCartButton";

type Variant = {
  id: string;
  shadeName: string;
  shadeHex: string;
};

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePricePkr: number;
    compareAtPkr?: number | null;
    images: string[];
    badges: string[];
    variants: Variant[];
  };
};

export function ProductCard({ product }: Props) {
  const image =
    product.images?.find((src) => Boolean(src?.trim())) || HD_FALLBACK_IMAGE;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-outline/40 bg-white shadow-sm">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-surface-container"
      >
        <div className="relative aspect-[4/5] w-full min-h-[220px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {product.badges[0] ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-espresso shadow-sm">
            {product.badges[0]}
          </span>
        ) : null}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-espresso shadow-sm">
          <Heart className="h-4 w-4" />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-center gap-1 text-primary">
          <span className="text-xs">★★★★★</span>
          <span className="text-xs font-semibold text-espresso">4.9</span>
          <span className="text-xs text-taupe">(1,230)</span>
        </div>
        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="font-display text-lg leading-snug text-espresso">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-taupe">
            {product.description}
          </p>
        </Link>
        {product.variants.length > 0 ? (
          <div className="mt-3 flex gap-1.5">
            {product.variants.slice(0, 5).map((v) => (
              <span
                key={v.id}
                title={v.shadeName}
                className="h-4 w-4 rounded-full border border-outline shadow-sm"
                style={{ backgroundColor: v.shadeHex }}
              />
            ))}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <div>
            <p className="text-base font-bold text-espresso">
              {formatPkr(product.basePricePkr)}
            </p>
            {product.compareAtPkr ? (
              <p className="text-xs text-taupe line-through">
                {formatPkr(product.compareAtPkr)}
              </p>
            ) : null}
          </div>
          <AddToCartButton
            productId={product.id}
            variantId={product.variants[0]?.id}
            label="Quick Add"
          />
        </div>
      </div>
    </article>
  );
}
