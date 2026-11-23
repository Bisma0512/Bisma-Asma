import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ShopPagination } from "@/components/store/ShopPagination";
import {
  SHOP_PAGE_SIZE,
  buildShopQuery,
  parseShopParams,
  shopOrderBy,
  shopWhere,
  type ShopSearchParams,
} from "@/lib/shop-query";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<ShopSearchParams>;
};

export default async function ShopPage({ searchParams }: Props) {
  const raw = await searchParams;
  const { q, sort, featuredOnly, page, categorySlug } = parseShopParams(raw);

  if (categorySlug) {
    redirect(`/shop/${categorySlug}${buildShopQuery({ q, sort, featuredOnly, page })}`);
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  const where = shopWhere({ q, featuredOnly });
  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const products = await prisma.product.findMany({
    where,
    include: { variants: true, category: true },
    orderBy: shopOrderBy(sort),
    skip: (safePage - 1) * SHOP_PAGE_SIZE,
    take: SHOP_PAGE_SIZE,
  });

  const basePath = "/shop";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-espresso">
        {q ? "Search results" : "Shop All"}
      </h1>
      <ShopToolbar
        basePath={basePath}
        q={q}
        sort={sort}
        featuredOnly={featuredOnly}
        categories={categories}
        resultCount={total}
        page={safePage}
        totalPages={totalPages}
      />
      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-taupe">No products match these filters.</p>
      )}
      <ShopPagination
        basePath={basePath}
        page={safePage}
        totalPages={totalPages}
        q={q}
        sort={sort}
        featuredOnly={featuredOnly}
      />
    </div>
  );
}
