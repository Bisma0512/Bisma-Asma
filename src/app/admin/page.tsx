import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [orderAgg, orderCount, pendingCount, lowStock, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPkr: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ["PLACED", "CONFIRMED", "PACKED"] } },
      }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 20 } },
        include: { product: true },
        take: 8,
        orderBy: { stock: "asc" },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

  const revenue = orderAgg._sum.totalPkr ?? 0;
  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-espresso">
          Executive Operations
        </h1>
        <p className="mt-1 text-taupe">Bisma & Asma Cosmetics overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Gross Revenue", formatPkr(revenue)],
          ["Total Orders", String(orderCount)],
          ["Pending Fulfillment", String(pendingCount)],
          ["Average Order Value", formatPkr(aov)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-outline/40 bg-white p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-taupe">
              {label}
            </p>
            <p className="mt-3 font-display text-3xl text-espresso">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-outline/40 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Low stock</h2>
            <Link href="/admin/products" className="text-sm text-primary">
              Manage
            </Link>
          </div>
          <ul className="space-y-3 text-sm">
            {lowStock.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-3 border-b border-outline/30 pb-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-outline"
                    style={{ backgroundColor: v.shadeHex }}
                  />
                  <span>
                    {v.product.name} · {v.shadeName}
                  </span>
                </div>
                <span
                  className={
                    v.stock <= 10 ? "font-bold text-critical" : "text-warning"
                  }
                >
                  {v.stock} left
                </span>
              </li>
            ))}
            {lowStock.length === 0 ? (
              <li className="text-taupe">Inventory looks healthy.</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-outline/40 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <ul className="space-y-3 text-sm">
            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 border-b border-outline/30 pb-3"
              >
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-taupe">
                    {o.shippingName} · {o.shippingCity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPkr(o.totalPkr)}</p>
                  <p className="text-xs uppercase tracking-wide text-taupe">
                    {o.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
