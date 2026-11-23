import { redirect } from "next/navigation";
import { getCart, cartTotals } from "@/lib/cart";
import { formatPkr } from "@/lib/utils";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.length === 0) redirect("/cart");
  const totals = cartTotals(cart);
  const session = await getSession();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-espresso">Checkout</h1>
      <p className="mt-2 text-taupe">
        Cash on Delivery · Total {formatPkr(totals.total)}
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <CheckoutForm
          defaultName={session?.user?.name ?? ""}
          defaultEmail={session?.user?.email ?? ""}
        />
        <aside className="h-fit rounded-2xl border border-outline/40 bg-white p-5 text-sm">
          <h2 className="font-display text-lg">Order</h2>
          <ul className="mt-3 space-y-2">
            {cart.map((i) => (
              <li key={`${i.productId}-${i.variantId}`} className="flex justify-between gap-2">
                <span className="text-taupe">
                  {i.name}
                  {i.shadeName ? ` · ${i.shadeName}` : ""} ×{i.qty}
                </span>
                <span>{formatPkr(i.unitPricePkr * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-outline/40 pt-3">
            <div className="flex justify-between">
              <span className="text-taupe">Shipping</span>
              <span>
                {totals.shipping === 0 ? "Free" : formatPkr(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total COD</span>
              <span>{formatPkr(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
