"use client";

import { useTransition } from "react";
import { removeFromCart, updateCartQty } from "@/app/actions/cart";

type Props = {
  productId: string;
  variantId: string | null;
  qty: number;
};

export function CartControls({ productId, variantId, qty }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-outline">
        <button
          type="button"
          disabled={pending}
          className="px-3 py-1 text-sm"
          onClick={() =>
            startTransition(() =>
              updateCartQty(productId, variantId, qty - 1)
            )
          }
        >
          −
        </button>
        <span className="px-2 text-sm font-semibold">{qty}</span>
        <button
          type="button"
          disabled={pending}
          className="px-3 py-1 text-sm"
          onClick={() =>
            startTransition(() =>
              updateCartQty(productId, variantId, qty + 1)
            )
          }
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={pending}
        className="text-xs font-semibold text-critical"
        onClick={() =>
          startTransition(() => removeFromCart(productId, variantId))
        }
      >
        Remove
      </button>
    </div>
  );
}
