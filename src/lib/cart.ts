import { cookies } from "next/headers";

export type CartItem = {
  productId: string;
  variantId: string | null;
  name: string;
  shadeName: string | null;
  shadeHex: string | null;
  unitPricePkr: number;
  qty: number;
  image: string | null;
  slug: string;
};

const CART_COOKIE = "ba_cart";

export async function getCart(): Promise<CartItem[]> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function setCart(items: CartItem[]) {
  const jar = await cookies();
  jar.set(CART_COOKIE, encodeURIComponent(JSON.stringify(items)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function cartKey(item: Pick<CartItem, "productId" | "variantId">) {
  return `${item.productId}:${item.variantId ?? "base"}`;
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPricePkr * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  return { subtotal, count, shipping, total: subtotal + shipping };
}
