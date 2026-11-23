import Link from "next/link";
import { shopHref, type ShopSort } from "@/lib/shop-query";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  q: string;
  sort: ShopSort;
  featuredOnly: boolean;
};

export function ShopPagination({
  basePath,
  page,
  totalPages,
  q,
  sort,
  featuredOnly,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = visiblePages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <PageLink
        href={shopHref(basePath, {
          q,
          sort,
          featuredOnly,
          page: page - 1,
        })}
        disabled={page <= 1}
        label="Previous"
      />
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-taupe">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={shopHref(basePath, { q, sort, featuredOnly, page: p })}
            aria-current={p === page ? "page" : undefined}
            className={`inline-flex min-w-10 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition ${
              p === page
                ? "bg-espresso text-white"
                : "border border-outline bg-white text-espresso hover:border-primary"
            }`}
          >
            {p}
          </Link>
        ),
      )}
      <PageLink
        href={shopHref(basePath, {
          q,
          sort,
          featuredOnly,
          page: page + 1,
        })}
        disabled={page >= totalPages}
        label="Next"
      />
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed rounded-lg border border-outline/50 px-3 py-2 text-sm text-taupe/60">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex rounded-lg border border-outline bg-white px-3 py-2 text-sm font-medium text-espresso transition hover:border-primary"
    >
      {label}
    </Link>
  );
}

function visiblePages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    set.add(2);
    set.add(3);
    set.add(4);
  }
  if (current >= total - 2) {
    set.add(total - 1);
    set.add(total - 2);
    set.add(total - 3);
  }
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}
