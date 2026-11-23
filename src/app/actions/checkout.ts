"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCart, cartTotals, setCart } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/utils";
import { getSession } from "@/lib/session";

export type CheckoutState = { error?: string };

export async function placeCodOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const cart = await getCart();
  if (cart.length === 0) return { error: "Your bag is empty." };

  const shippingName = String(formData.get("shippingName") || "").trim();
  const shippingPhone = String(formData.get("shippingPhone") || "").trim();
  const shippingCity = String(formData.get("shippingCity") || "").trim();
  const shippingAddress = String(formData.get("shippingAddress") || "").trim();
  const guestEmail = String(formData.get("guestEmail") || "").trim() || null;
  const shippingNotes = String(formData.get("shippingNotes") || "").trim() || null;

  if (!shippingName || !shippingPhone || !shippingCity || !shippingAddress) {
    return { error: "Please fill all required shipping fields." };
  }

  const session = await getSession();
  const { subtotal, shipping, total } = cartTotals(cart);

  let orderNumber = generateOrderNumber();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { orderNumber } });
    if (!exists) break;
    orderNumber = generateOrderNumber();
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of cart) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });
          if (!variant || variant.stock < item.qty) {
            throw new Error(`Insufficient stock for ${item.name}`);
          }
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.qty } },
          });
        }
      }

      await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id ?? null,
          guestEmail,
          guestPhone: shippingPhone,
          shippingName,
          shippingPhone,
          shippingCity,
          shippingAddress,
          shippingNotes,
          status: "PLACED",
          paymentMethod: "COD",
          subtotalPkr: subtotal,
          shippingPkr: shipping,
          totalPkr: total,
          items: {
            create: cart.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              shadeName: item.shadeName,
              unitPricePkr: item.unitPricePkr,
              qty: item.qty,
              image: item.image,
            })),
          },
        },
      });
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not place order.",
    };
  }

  await setCart([]);
  redirect(`/order-confirmation/${orderNumber}`);
}
