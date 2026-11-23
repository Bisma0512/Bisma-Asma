import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Customers</h1>
          <p className="mt-1 text-taupe">{customers.length} registered shoppers</p>
        </div>
        <Link
          href="/admin/customers/new"
          className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
        >
          Create customer
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline/40 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-outline/40 bg-surface-low text-xs uppercase tracking-wide text-taupe">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-taupe">
                  No customers yet.{" "}
                  <Link href="/admin/customers/new" className="text-primary">
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-outline/30">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3 text-taupe">{c.phone || "—"}</td>
                  <td className="px-4 py-3">{c._count.orders}</td>
                  <td className="px-4 py-3 text-taupe">
                    {c.createdAt.toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
