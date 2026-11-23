import { prisma } from "@/lib/prisma";
import { deleteCategory, upsertCategory } from "@/app/actions/admin";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-espresso">Categories</h1>
        <p className="mt-1 text-taupe">Organize the storefront menus</p>
      </div>

      <form
        action={upsertCategory}
        className="grid gap-3 rounded-2xl border border-outline/40 bg-white p-5 md:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Name"
          required
          className="rounded-xl border border-outline px-3 py-2"
        />
        <input
          name="description"
          placeholder="Description"
          className="rounded-xl border border-outline px-3 py-2 md:col-span-2"
        />
        <div className="flex gap-2">
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="w-24 rounded-xl border border-outline px-3 py-2"
          />
          <button className="rounded-full bg-espresso px-4 text-sm font-semibold text-white">
            Add
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-outline/40 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-outline/40 bg-surface-low text-xs uppercase tracking-wide text-taupe">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-outline/30 align-top">
                <td className="px-4 py-3" colSpan={5}>
                  <form action={upsertCategory} className="grid gap-2 md:grid-cols-5">
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="name"
                      defaultValue={c.name}
                      className="rounded-lg border border-outline px-2 py-1.5"
                    />
                    <p className="px-2 py-1.5 text-taupe">{c.slug}</p>
                    <p className="px-2 py-1.5">{c._count.products}</p>
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={c.sortOrder}
                      className="rounded-lg border border-outline px-2 py-1.5"
                    />
                    <div className="flex gap-2">
                      <input
                        type="hidden"
                        name="description"
                        value={c.description ?? ""}
                      />
                      <button className="rounded-full bg-champagne px-3 py-1.5 text-xs font-semibold">
                        Save
                      </button>
                    </div>
                  </form>
                  <form action={deleteCategory} className="mt-2">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-xs font-semibold text-critical">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
