"use client";

import { useMemo, useState } from "react";
import { upsertProduct } from "@/app/actions/admin";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

type Category = { id: string; name: string };
type Variant = {
  shadeName: string;
  shadeHex: string;
  sku: string;
  stock: number;
  priceOverridePkr?: number | null;
};

type Product = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  basePricePkr: number;
  compareAtPkr?: number | null;
  images: string[];
  badges: string[];
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
};

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length
      ? product.variants
      : [
          {
            shadeName: "Classic",
            shadeHex: "#85513f",
            sku: `SKU-${Date.now()}`,
            stock: 50,
          },
        ]
  );

  const variantsJson = useMemo(() => JSON.stringify(variants), [variants]);

  return (
    <form action={upsertProduct} className="space-y-5 rounded-2xl border border-outline/40 bg-white p-6">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="variantsJson" value={variantsJson} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Name</label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Category</label>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId || categories[0]?.id}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Price (PKR)</label>
          <input
            name="basePricePkr"
            type="number"
            required
            defaultValue={product?.basePricePkr ?? 1999}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Compare at (PKR)</label>
          <input
            name="compareAtPkr"
            type="number"
            defaultValue={product?.compareAtPkr ?? undefined}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
      </div>

      <MultiImageUpload
        name="images"
        label="Product images (upload)"
        defaultUrls={product?.images ?? []}
      />

      <div>
        <label className="text-sm font-semibold">Badges (comma separated)</label>
        <input
          name="badges"
          defaultValue={product?.badges?.join(", ")}
          className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
        />
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="hidden" name="isActive" value="off" />
          <input
            type="checkbox"
            name="isActive"
            value="on"
            defaultChecked={product?.isActive ?? true}
          />
          Active
        </label>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Shade variants</h3>
          <button
            type="button"
            className="text-sm text-primary"
            onClick={() =>
              setVariants((v) => [
                ...v,
                {
                  shadeName: "New shade",
                  shadeHex: "#c88a75",
                  sku: `SKU-${Date.now()}`,
                  stock: 40,
                },
              ])
            }
          >
            + Add shade
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="grid gap-2 rounded-xl border border-outline/50 p-3 md:grid-cols-5"
            >
              <input
                value={v.shadeName}
                onChange={(e) => {
                  const next = [...variants];
                  next[idx] = { ...v, shadeName: e.target.value };
                  setVariants(next);
                }}
                placeholder="Shade name"
                className="rounded-lg border border-outline px-2 py-1.5"
              />
              <input
                value={v.shadeHex}
                onChange={(e) => {
                  const next = [...variants];
                  next[idx] = { ...v, shadeHex: e.target.value };
                  setVariants(next);
                }}
                placeholder="#hex"
                className="rounded-lg border border-outline px-2 py-1.5"
              />
              <input
                value={v.sku}
                onChange={(e) => {
                  const next = [...variants];
                  next[idx] = { ...v, sku: e.target.value };
                  setVariants(next);
                }}
                placeholder="SKU"
                className="rounded-lg border border-outline px-2 py-1.5"
              />
              <input
                type="number"
                value={v.stock}
                onChange={(e) => {
                  const next = [...variants];
                  next[idx] = { ...v, stock: Number(e.target.value) };
                  setVariants(next);
                }}
                placeholder="Stock"
                className="rounded-lg border border-outline px-2 py-1.5"
              />
              <button
                type="button"
                className="text-left text-xs text-critical md:text-center"
                onClick={() =>
                  setVariants((list) => list.filter((_, i) => i !== idx))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-white">
        Save product
      </button>
    </form>
  );
}
