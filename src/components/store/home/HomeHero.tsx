"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPkr } from "@/lib/utils";
import { HD_FALLBACK_IMAGE } from "@/lib/product-images";
import { AddToCartButton } from "@/components/store/AddToCartButton";

type Variant = {
  id: string;
  shadeName: string;
  shadeHex: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePricePkr: number;
  images: string[];
  variants: Variant[];
};

export function HomeHero({ product }: { product: Product | null }) {
  const shades = product?.variants?.slice(0, 4) ?? [];
  const [shadeId, setShadeId] = useState(shades[0]?.id);
  const selected = useMemo(
    () => shades.find((s) => s.id === shadeId) ?? shades[0],
    [shades, shadeId]
  );

  const image =
    product?.images?.find((src) => Boolean(src?.trim())) || HD_FALLBACK_IMAGE;

  return (
    <section className="relative w-full overflow-hidden pb-16">
      <div className="mx-auto max-w-[1440px] px-5 pt-6 md:px-8 lg:px-12 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="animate-fade-up lg:col-span-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-champagne px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-espresso shadow-sm">
              <span className="h-2 w-2 animate-soft-pulse rounded-full bg-primary" />
              Pakistani Atelier Formulation · Spring Capsule
            </div>
            <h1 className="font-display text-4xl leading-[1.08] text-espresso md:text-6xl">
              Luminous Beauty,{" "}
              <span className="italic font-normal text-primary">Redefined.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-taupe md:text-lg">
              Sculpted skin, dewy lip glazes, and ethereal silk flushes engineered
              for everyday radiance. Clean formulas, COD across Pakistan.
            </p>

            {product && shades.length > 0 ? (
              <div className="mt-6 rounded-xl bg-surface-low p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-taupe">
                    Featured shade:{" "}
                    <span className="text-espresso">{selected?.shadeName}</span>
                  </span>
                  <span className="font-bold text-primary">
                    {formatPkr(product.basePricePkr)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shades.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShadeId(s.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shadow-sm transition ${
                        s.id === selected?.id
                          ? "scale-105 bg-white text-espresso"
                          : "bg-white/70 text-taupe hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full shadow-inner"
                        style={{ backgroundColor: s.shadeHex }}
                      />
                      {s.shadeName}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#trending-section"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-espresso px-8 text-sm font-semibold text-white shadow-md transition hover:bg-primary"
              >
                Shop The Viral Edit
              </Link>
              <Link
                href="#shade-finder-section"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-champagne px-7 text-sm font-semibold text-espresso shadow-sm transition hover:bg-surface-container"
              >
                Find Your Shade Match
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-5">
              <div className="flex -space-x-2">
                {["B", "A", "S"].map((letter, i) => (
                  <div
                    key={letter}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-sm"
                    style={{
                      backgroundColor: ["#c88a75", "#ce8871", "#ebe0da"][i],
                      color: i === 2 ? "#1a1615" : "#fff",
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-espresso">4.92 / 5</p>
                <p className="text-sm text-taupe">42,000+ glowing daily</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up-delay lg:col-span-6">
            <div className="relative isolate min-h-[420px] w-full overflow-hidden rounded-xl bg-surface-container shadow-xl aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={product?.name || "Bisma & Asma Cosmetics"}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
              />
              <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-espresso shadow-md backdrop-blur">
                Clean · Vegan
              </div>
              {product ? (
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between gap-3 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                      Viral Edit
                    </p>
                    <h4 className="truncate font-display text-lg font-semibold text-espresso">
                      {product.name}
                    </h4>
                    <p className="truncate text-sm text-taupe">
                      {selected?.shadeName || product.description}
                    </p>
                  </div>
                  <AddToCartButton
                    productId={product.id}
                    variantId={selected?.id}
                    label="+"
                    className="!rounded-full !px-0 h-11 w-11 shrink-0 !py-0"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
