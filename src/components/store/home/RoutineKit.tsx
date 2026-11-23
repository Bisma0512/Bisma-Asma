"use client";

import { useMemo, useState, useTransition } from "react";
import { Reveal } from "@/components/Reveal";
import { formatPkr } from "@/lib/utils";
import { addToCart } from "@/app/actions/cart";

type Variant = { id: string; shadeName: string; shadeHex: string };
type Product = {
  id: string;
  name: string;
  basePricePkr: number;
  variants: Variant[];
};

export function RoutineKit({
  lip,
  blush,
  complexion,
}: {
  lip: Product | null;
  blush: Product | null;
  complexion: Product | null;
}) {
  const [lipVar, setLipVar] = useState(lip?.variants[0]?.id ?? "");
  const [blushVar, setBlushVar] = useState(blush?.variants[0]?.id ?? "");
  const [compVar, setCompVar] = useState(complexion?.variants[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const total = useMemo(() => {
    return (
      (lip?.basePricePkr ?? 0) +
      (blush?.basePricePkr ?? 0) +
      (complexion?.basePricePkr ?? 0)
    );
  }, [lip, blush, complexion]);

  const save = Math.round(total * 0.18);
  const kitPrice = total - save;

  function addKit() {
    startTransition(async () => {
      if (lip) await addToCart({ productId: lip.id, variantId: lipVar || undefined });
      if (blush)
        await addToCart({ productId: blush.id, variantId: blushVar || undefined });
      if (complexion)
        await addToCart({
          productId: complexion.id,
          variantId: compVar || undefined,
        });
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }

  if (!lip && !blush && !complexion) return null;

  return (
    <section className="w-full bg-surface-low py-16 md:py-24">
      <Reveal>
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                Curated Set
              </p>
              <h2 className="mt-3 font-display text-3xl text-espresso md:text-5xl">
                The Glaze Routine Kit
              </h2>
              <p className="mt-4 max-w-md text-taupe">
                Build your 3-step glow: lip glaze, cream blush, and skin
                perfecter. Save when you take the complete ritual.
              </p>
              <div className="mt-6 flex items-end gap-3">
                <p className="font-display text-3xl font-semibold text-espresso">
                  {formatPkr(kitPrice)}
                </p>
                <p className="pb-1 text-sm text-taupe line-through">
                  {formatPkr(total)}
                </p>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase text-primary">
                  Save {formatPkr(save)}
                </span>
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6">
              {[
                { label: "Step 1 · Lip Oil", product: lip, value: lipVar, set: setLipVar },
                {
                  label: "Step 2 · Cream Blush",
                  product: blush,
                  value: blushVar,
                  set: setBlushVar,
                },
                {
                  label: "Step 3 · Skin Perfector",
                  product: complexion,
                  value: compVar,
                  set: setCompVar,
                },
              ].map((step) => (
                <div key={step.label}>
                  <label className="text-xs font-bold uppercase tracking-wide text-taupe">
                    {step.label}
                  </label>
                  <select
                    value={step.value}
                    onChange={(e) => step.set(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 text-sm"
                    disabled={!step.product}
                  >
                    {(step.product?.variants ?? []).map((v) => (
                      <option key={v.id} value={v.id}>
                        {step.product?.name} — {v.shadeName}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                type="button"
                disabled={pending}
                onClick={addKit}
                className="w-full rounded-lg bg-espresso py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending
                  ? "Adding kit…"
                  : done
                    ? "Added to bag"
                    : "Add Complete Kit to Bag"}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
