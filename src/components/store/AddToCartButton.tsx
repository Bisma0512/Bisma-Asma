"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";

type Props = {
  productId: string;
  variantId?: string;
  qty?: number;
  label?: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  variantId,
  qty = 1,
  label = "Add to Bag",
  className = "",
}: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await addToCart({ productId, variantId, qty });
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className={`rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-primary hover:text-white disabled:opacity-60 ${className}`}
    >
      {pending ? "Adding…" : done ? "Added" : label}
    </button>
  );
}
