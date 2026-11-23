import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-success">
        Order placed
      </p>
      <h1 className="mt-3 font-display text-4xl text-espresso">
        Thank you, {order.shippingName}
      </h1>
      <p className="mt-4 text-taupe">
        Your COD order <strong className="text-espresso">{order.orderNumber}</strong>{" "}
        totals {formatPkr(order.totalPkr)}. We&apos;ll call to confirm before
        dispatch.
      </p>
      <ul className="mt-8 space-y-2 rounded-2xl border border-outline/40 bg-white p-5 text-left text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span>
              {item.name}
              {item.shadeName ? ` · ${item.shadeName}` : ""} ×{item.qty}
            </span>
            <span>{formatPkr(item.unitPricePkr * item.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track?order=${order.orderNumber}&phone=${encodeURIComponent(order.shippingPhone)}`}
          className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
        >
          Track order
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-outline px-5 py-2.5 text-sm font-semibold"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
