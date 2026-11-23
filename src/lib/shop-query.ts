import type { Prisma } from "@prisma/client";

export const SHOP_PAGE_SIZE = 12;

export type ShopSort =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "featured";

export type ShopSearchParams = {
  q?: string;
  sort?: string;
  featured?: string;
  page?: string;
  category?: string;
};

export function parseShopParams(sp: ShopSearchParams) {
  const q = (sp.q || "").trim();
  const sort = normalizeSort(sp.sort);
  const featuredOnly = sp.featured === "1" || sp.featured === "true";
  const pageRaw = Number.parseInt(sp.page || "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const categorySlug = (sp.category || "").trim().toLowerCase() || undefined;
  return { q, sort, featuredOnly, page, categorySlug };
}

function normalizeSort(value?: string): ShopSort {
  switch (value) {
    case "name-desc":
    case "price-asc":
    case "price-desc":
    case "newest":
    case "featured":
      return value;
    default:
      return "name-asc";
  }
}

export function shopOrderBy(
  sort: ShopSort,
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "name-desc":
      return [{ name: "desc" }];
    case "price-asc":
      return [{ basePricePkr: "asc" }, { name: "asc" }];
    case "price-desc":
      return [{ basePricePkr: "desc" }, { name: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "featured":
      return [{ isFeatured: "desc" }, { name: "asc" }];
    default:
      return [{ name: "asc" }];
  }
}

export function shopWhere(input: {
  q: string;
  featuredOnly: boolean;
  categoryId?: string;
}): Prisma.ProductWhereInput {
  return {
    isActive: true,
    ...(input.categoryId ? { categoryId: input.categoryId } : {}),
    ...(input.featuredOnly ? { isFeatured: true } : {}),
    ...(input.q
      ? {
          OR: [
            { name: { contains: input.q, mode: "insensitive" } },
            { description: { contains: input.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export function buildShopQuery(params: {
  q?: string;
  sort?: ShopSort;
  featuredOnly?: boolean;
  page?: number;
  categorySlug?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "name-asc") sp.set("sort", params.sort);
  if (params.featuredOnly) sp.set("featured", "1");
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.categorySlug) sp.set("category", params.categorySlug);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function shopHref(
  basePath: string,
  params: {
    q?: string;
    sort?: ShopSort;
    featuredOnly?: boolean;
    page?: number;
  },
) {
  return `${basePath}${buildShopQuery(params)}`;
}
