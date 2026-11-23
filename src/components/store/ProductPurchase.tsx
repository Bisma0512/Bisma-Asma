"use client";

import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/AddToCartButton";

type Variant = {
  id: string;
  shadeName: string;
  shadeHex: string;
  stock: number;
  priceOverridePkr: number | null;
};

type Props = {
  productId: string;
  variants: Variant[];
  basePricePkr: number;
};

export function ProductPurchase({
  productId,
  variants,
  basePricePkr,
}: Props) {
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const selected = useMemo(
    () => variants.find((v) => v.id === variantId) ?? variants[0],
    [variants, variantId]
  );
  const price = selected?.priceOverridePkr ?? basePricePkr;

  return (
    <div className="space-y-5">
      {variants.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-espresso">
            Shade: {selected?.shadeName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                title={v.shadeName}
                className={`h-9 w-9 rounded-full border-2 ${
                  v.id === selected?.id
                    ? "border-espresso"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: v.shadeHex }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-taupe">
            {selected && selected.stock > 0
              ? `${selected.stock} in stock`
              : "Out of stock"}
          </p>
        </div>
      ) : null}
      <p className="text-xl font-bold text-espresso">{formatPkr(price)}</p>
      <AddToCartButton
        productId={productId}
        variantId={selected?.id}
        label="Add to Bag"
        className="w-full py-3"
      />
    </div>
  );
}
