import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OrderStepper } from "@/components/store/OrderStepper";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { formatPkr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const active = orders.find(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  );

  const phone = (session.user as { phone?: string | null }).phone;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-espresso">
            Welcome back, {session.user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-taupe">{session.user.email}</p>
          {phone ? <p className="mt-1 text-sm text-taupe">{phone}</p> : null}
        </div>
        <SignOutButton label="Log out" />
      </div>

      {active ? (
        <section className="mt-10 rounded-2xl border border-outline/40 bg-white p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl text-espresso">
              Active order {active.orderNumber}
            </h2>
            <span className="rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase text-primary">
              {active.status}
            </span>
          </div>
          <OrderStepper status={active.status} />
          <ul className="mt-4 space-y-1 text-sm text-taupe">
            {active.items.map((item) => (
              <li key={item.id}>
                {item.name}
                {item.shadeName ? ` · ${item.shadeName}` : ""} ×{item.qty}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-2xl text-espresso">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-taupe">
            No orders yet.{" "}
            <Link href="/shop" className="text-primary">
              Shop now
            </Link>
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-outline/40 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-outline/40 bg-surface-low text-xs uppercase tracking-wide text-taupe">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-outline/30">
                    <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-taupe">
                      {order.createdAt.toLocaleDateString("en-PK")}
                    </td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">{formatPkr(order.totalPkr)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/track?order=${order.orderNumber}&phone=${encodeURIComponent(order.shippingPhone)}`}
                        className="text-primary"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
