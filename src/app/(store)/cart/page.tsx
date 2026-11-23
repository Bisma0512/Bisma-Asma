import Link from "next/link";
import Image from "next/image";
import { getCart, cartTotals } from "@/lib/cart";
import { formatPkr } from "@/lib/utils";
import { CartControls } from "@/components/store/CartControls";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();
  const { subtotal, shipping, total, count } = cartTotals(cart);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-espresso">Your Bag</h1>
      <p className="mt-2 text-taupe">{count} items</p>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-outline/50 bg-white p-10 text-center">
          <p className="text-taupe">Your bag is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 rounded-2xl border border-outline/40 bg-white p-4"
              >
                <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-surface-container">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-display text-lg text-espresso"
                  >
                    {item.name}
                  </Link>
                  {item.shadeName ? (
                    <p className="text-sm text-taupe">{item.shadeName}</p>
                  ) : null}
                  <p className="mt-1 font-semibold">
                    {formatPkr(item.unitPricePkr)}
                  </p>
                  <div className="mt-auto pt-2">
                    <CartControls
                      productId={item.productId}
                      variantId={item.variantId}
                      qty={item.qty}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-2xl border border-outline/40 bg-white p-6">
            <h2 className="font-display text-xl text-espresso">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-taupe">Subtotal</dt>
                <dd>{formatPkr(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-taupe">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPkr(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-outline/40 pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatPkr(total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-taupe">Payment: Cash on Delivery</p>
            <Link
              href="/checkout"
              className="mt-5 block rounded-full bg-espresso py-3 text-center text-sm font-semibold text-white hover:bg-primary"
            >
              Checkout COD
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
