"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cartKey, getCart, setCart, type CartItem } from "@/lib/cart";

export async function addToCart(input: {
  productId: string;
  variantId?: string | null;
  qty?: number;
}) {
  const product = await prisma.product.findUnique({
    where: { id: input.productId, isActive: true },
    include: { variants: true },
  });
  if (!product) throw new Error("Product not found");

  const variant = input.variantId
    ? product.variants.find((v) => v.id === input.variantId)
    : product.variants[0] ?? null;

  const unitPricePkr = variant?.priceOverridePkr ?? product.basePricePkr;
  const qty = Math.max(1, input.qty ?? 1);

  const cart = await getCart();
  const key = cartKey({
    productId: product.id,
    variantId: variant?.id ?? null,
  });
  const existing = cart.find(
    (i) => cartKey(i) === key
  );

  let next: CartItem[];
  if (existing) {
    next = cart.map((i) =>
      cartKey(i) === key ? { ...i, qty: i.qty + qty } : i
    );
  } else {
    next = [
      ...cart,
      {
        productId: product.id,
        variantId: variant?.id ?? null,
        name: product.name,
        shadeName: variant?.shadeName ?? null,
        shadeHex: variant?.shadeHex ?? null,
        unitPricePkr,
        qty,
        image: product.images[0] ?? null,
        slug: product.slug,
      },
    ];
  }

  await setCart(next);
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function updateCartQty(
  productId: string,
  variantId: string | null,
  qty: number
) {
  const cart = await getCart();
  const key = cartKey({ productId, variantId });
  const next =
    qty <= 0
      ? cart.filter((i) => cartKey(i) !== key)
      : cart.map((i) => (cartKey(i) === key ? { ...i, qty } : i));
  await setCart(next);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeFromCart(
  productId: string,
  variantId: string | null
) {
  const cart = await getCart();
  const key = cartKey({ productId, variantId });
  await setCart(cart.filter((i) => cartKey(i) !== key));
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function clearCart() {
  await setCart([]);
  revalidatePath("/cart");
}
