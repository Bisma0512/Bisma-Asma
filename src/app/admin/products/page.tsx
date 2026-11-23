import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { deleteProduct } from "@/app/actions/admin";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Products</h1>
          <p className="mt-1 text-taupe">{products.length} SKUs</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline/40 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-outline/40 bg-surface-low text-xs uppercase tracking-wide text-taupe">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-outline/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-taupe">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">{p.category.name}</td>
                  <td className="px-4 py-3">{formatPkr(p.basePricePkr)}</td>
                  <td className="px-4 py-3">{stock}</td>
                  <td className="px-4 py-3 text-xs">
                    {p.isFeatured ? "Featured · " : ""}
                    {p.isActive ? "Active" : "Hidden"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-primary"
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-critical">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
