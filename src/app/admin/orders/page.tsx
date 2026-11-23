import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { updateOrderStatus } from "@/app/actions/admin";

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-espresso">Orders</h1>
        <p className="mt-1 text-taupe">Fulfillment queue · COD</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-outline/40 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl text-espresso">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-taupe">
                  {order.shippingName} · {order.shippingPhone} ·{" "}
                  {order.shippingCity}
                </p>
                <p className="mt-1 text-xs text-taupe">
                  {order.shippingAddress}
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name}
                      {item.shadeName ? ` · ${item.shadeName}` : ""} ×{item.qty}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatPkr(order.totalPkr)}</p>
                <p className="text-xs uppercase tracking-wide text-taupe">
                  {order.createdAt.toLocaleString("en-PK")}
                </p>
              </div>
            </div>
            <form
              action={updateOrderStatus}
              className="mt-4 flex flex-wrap items-end gap-3 border-t border-outline/30 pt-4"
            >
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-taupe">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={order.status}
                  className="mt-1 block rounded-xl border border-outline px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[220px] flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-taupe">
                  Tracking note
                </label>
                <input
                  name="trackingNote"
                  defaultValue={order.trackingNote ?? ""}
                  placeholder="Courier / tracking id"
                  className="mt-1 w-full rounded-xl border border-outline px-3 py-2 text-sm"
                />
              </div>
              <button className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-white">
                Update
              </button>
            </form>
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="text-taupe">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
