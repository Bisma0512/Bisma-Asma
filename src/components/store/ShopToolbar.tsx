"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ShopSort } from "@/lib/shop-query";

type CategoryOption = { slug: string; name: string };

type Props = {
  basePath: string;
  q: string;
  sort: ShopSort;
  featuredOnly: boolean;
  categories: CategoryOption[];
  /** When set, category is locked to the route (e.g. /shop/lips). */
  lockedCategorySlug?: string;
  resultCount: number;
  page: number;
  totalPages: number;
};

const SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured first" },
];

export function ShopToolbar({
  basePath,
  q,
  sort,
  featuredOnly,
  categories,
  lockedCategorySlug,
  resultCount,
  page,
  totalPages,
}: Props) {
  const router = useRouter();

  function onCategoryChange(slug: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort !== "name-asc") params.set("sort", sort);
    if (featuredOnly) params.set("featured", "1");
    const qs = params.toString();
    const path = slug ? `/shop/${slug}` : "/shop";
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <div className="mt-6 space-y-4">
      <form
        action={basePath}
        method="get"
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        <label className="relative min-w-0 flex-1 md:max-w-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-taupe">
            Search
          </span>
          <Search className="pointer-events-none absolute bottom-2.5 left-3 h-4 w-4 text-taupe" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="w-full rounded-lg border border-outline bg-white py-2.5 pl-9 pr-3 text-sm text-espresso outline-none focus:border-primary"
          />
        </label>

        <label className="w-full md:w-44">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-taupe">
            Category
          </span>
          <select
            value={lockedCategorySlug || ""}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-espresso outline-none focus:border-primary"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="w-full md:w-48">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-taupe">
            Sort
          </span>
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-espresso outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 pb-2.5 text-sm text-espresso md:pb-3">
          <input
            type="checkbox"
            name="featured"
            value="1"
            defaultChecked={featuredOnly}
            className="size-4 rounded border-outline accent-primary"
          />
          Featured only
        </label>

        <button
          type="submit"
          className="rounded-lg bg-espresso px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
        >
          Apply
        </button>
      </form>

      <p className="text-sm text-taupe">
        {resultCount} product{resultCount === 1 ? "" : "s"}
        {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : null}
        {q ? (
          <>
            {" "}
            for “{q}”
          </>
        ) : null}
      </p>
    </div>
  );
}
