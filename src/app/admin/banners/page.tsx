import { prisma } from "@/lib/prisma";
import { deletePromoBanner, upsertPromoBanner } from "@/app/actions/admin";

export default async function AdminBannersPage() {
  const banners = await prisma.promoBanner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-espresso">Promo banners</h1>
        <p className="mt-1 text-taupe">
          Scrolling announcement texts at the top of the storefront
        </p>
      </div>

      <form
        action={upsertPromoBanner}
        className="grid gap-3 rounded-2xl border border-outline/40 bg-white p-5 md:grid-cols-[1fr_100px_auto_auto]"
      >
        <input
          name="text"
          required
          placeholder="Banner message in English"
          className="rounded-xl border border-outline px-3 py-2.5"
        />
        <input
          name="sortOrder"
          type="number"
          defaultValue={0}
          className="rounded-xl border border-outline px-3 py-2.5"
        />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked />
          Active
        </label>
        <button className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white">
          Add banner
        </button>
      </form>

      <div className="space-y-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-outline/40 bg-white p-4"
          >
            <form
              action={upsertPromoBanner}
              className="grid gap-3 md:grid-cols-[1fr_100px_auto_auto]"
            >
              <input type="hidden" name="id" value={b.id} />
              <input
                name="text"
                defaultValue={b.text}
                className="rounded-xl border border-outline px-3 py-2"
              />
              <input
                name="sortOrder"
                type="number"
                defaultValue={b.sortOrder}
                className="rounded-xl border border-outline px-3 py-2"
              />
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={b.isActive}
                />
                Active
              </label>
              <button className="rounded-full bg-champagne px-4 py-2 text-sm font-semibold">
                Save
              </button>
            </form>
            <form action={deletePromoBanner} className="mt-2">
              <input type="hidden" name="id" value={b.id} />
              <button className="text-xs font-semibold text-critical">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
