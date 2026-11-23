import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ShopPagination } from "@/components/store/ShopPagination";
import {
  SHOP_PAGE_SIZE,
  parseShopParams,
  shopOrderBy,
  shopWhere,
  type ShopSearchParams,
} from "@/lib/shop-query";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<ShopSearchParams>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { q, sort, featuredOnly, page } = parseShopParams(await searchParams);

  const category = await prisma.category.findUnique({
    where: { slug },
  });
  if (!category) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  const where = shopWhere({
    q,
    featuredOnly,
    categoryId: category.id,
  });
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

  const basePath = `/shop/${category.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-espresso">{category.name}</h1>
      {category.description ? (
        <p className="mt-2 max-w-2xl text-taupe">{category.description}</p>
      ) : null}
      <ShopToolbar
        basePath={basePath}
        q={q}
        sort={sort}
        featuredOnly={featuredOnly}
        categories={categories}
        lockedCategorySlug={category.slug}
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
