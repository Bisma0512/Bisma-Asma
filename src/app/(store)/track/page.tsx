import { prisma } from "@/lib/prisma";
import { OrderStepper } from "@/components/store/OrderStepper";
import { formatPkr } from "@/lib/utils";
import { TrackForm } from "@/components/store/TrackForm";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ order?: string; phone?: string }>;
};

export default async function TrackPage({ searchParams }: Props) {
  const { order: orderNumber, phone } = await searchParams;
  let result = null as Awaited<ReturnType<typeof prisma.order.findFirst>> & {
    items?: { id: string; name: string; shadeName: string | null; qty: number }[];
  } | null;

  if (orderNumber && phone) {
    result = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
        shippingPhone: { contains: phone.trim() },
      },
      include: { items: true },
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-espresso">Track Order</h1>
      <p className="mt-2 text-taupe">
        Enter your order number and the phone used at checkout.
      </p>
      <div className="mt-8">
        <TrackForm defaultOrder={orderNumber} defaultPhone={phone} />
      </div>
      {orderNumber && phone && !result ? (
        <p className="mt-6 rounded-xl bg-critical/10 px-4 py-3 text-sm text-critical">
          No order found. Check the order number and phone.
        </p>
      ) : null}
      {result ? (
        <div className="mt-8 space-y-6 rounded-2xl border border-outline/40 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-taupe">
                Order
              </p>
              <p className="font-display text-2xl text-espresso">
                {result.orderNumber}
              </p>
            </div>
            <p className="rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              {result.status}
            </p>
          </div>
          <OrderStepper status={result.status} />
          <div>
            <p className="text-sm font-semibold text-espresso">Items</p>
            <ul className="mt-2 space-y-1 text-sm text-taupe">
              {result.items?.map((item) => (
                <li key={item.id}>
                  {item.name}
                  {item.shadeName ? ` · ${item.shadeName}` : ""} ×{item.qty}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-bold text-espresso">
              Total COD {formatPkr(result.totalPkr)}
            </p>
            {result.trackingNote ? (
              <p className="mt-2 text-sm text-taupe">{result.trackingNote}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
