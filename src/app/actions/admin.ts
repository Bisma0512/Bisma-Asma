"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function upsertCategory(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  if (!name) throw new Error("Name required");
  const slug = slugify(name);

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { name, slug, description, sortOrder },
    });
  } else {
    await prisma.category.create({
      data: { name, slug, description, sortOrder },
    });
  }
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function upsertProduct(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const basePricePkr = Number(formData.get("basePricePkr") || 0);
  const compareAtPkrRaw = String(formData.get("compareAtPkr") || "");
  const compareAtPkr = compareAtPkrRaw ? Number(compareAtPkrRaw) : null;
  const images = String(formData.get("images") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const badges = String(formData.get("badges") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") !== "off";
  const variantsJson = String(formData.get("variantsJson") || "[]");

  if (!name || !categoryId || !basePricePkr) throw new Error("Missing fields");
  const slug = slugify(name);

  type VariantInput = {
    shadeName: string;
    shadeHex: string;
    sku: string;
    stock: number;
    priceOverridePkr?: number | null;
  };
  let variants: VariantInput[] = [];
  try {
    variants = JSON.parse(variantsJson) as VariantInput[];
  } catch {
    variants = [];
  }

  if (id) {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          categoryId,
          basePricePkr,
          compareAtPkr,
          images,
          badges,
          isFeatured,
          isActive,
        },
      });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length) {
        await tx.productVariant.createMany({
          data: variants.map((v) => ({
            productId: id,
            shadeName: v.shadeName,
            shadeHex: v.shadeHex || "#85513f",
            sku: v.sku,
            stock: Number(v.stock) || 0,
            priceOverridePkr: v.priceOverridePkr ?? null,
          })),
        });
      }
    });
  } else {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        basePricePkr,
        compareAtPkr,
        images,
        badges,
        isFeatured,
        isActive,
        variants: {
          create: variants.map((v) => ({
            shadeName: v.shadeName,
            shadeHex: v.shadeHex || "#85513f",
            sku: v.sku,
            stock: Number(v.stock) || 0,
            priceOverridePkr: v.priceOverridePkr ?? null,
          })),
        },
      },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  const trackingNote =
    String(formData.get("trackingNote") || "").trim() || null;
  await prisma.order.update({
    where: { id },
    data: { status, trackingNote },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/account");
  revalidatePath("/track");
}

export async function updateSiteSettings(formData: FormData) {
  await assertAdmin();
  const storeName =
    String(formData.get("storeName") || "").trim() ||
    "Bisma & Asma Cosmetics";
  const logoUrl = String(formData.get("logoUrl") || "").trim() || null;
  const facebookUrl = String(formData.get("facebookUrl") || "").trim() || null;
  const instagramUrl =
    String(formData.get("instagramUrl") || "").trim() || null;

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      storeName,
      logoUrl,
      facebookUrl,
      instagramUrl,
    },
    update: { storeName, logoUrl, facebookUrl, instagramUrl },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
}

export async function updateAdminProfile(formData: FormData) {
  const session = await assertAdmin();
  const name = String(formData.get("name") || "").trim();
  const image = String(formData.get("image") || "").trim() || null;
  if (!name) throw new Error("Name required");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, image },
  });
  revalidatePath("/admin/profile");
  revalidatePath("/admin");
}

export async function changeAdminPassword(formData: FormData) {
  await assertAdmin();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hdrs = await headers();
  await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
    },
    headers: hdrs,
  });
  revalidatePath("/admin/profile");
}

export async function upsertPromoBanner(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const text = String(formData.get("text") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";
  if (!text) throw new Error("Text required");

  if (id) {
    await prisma.promoBanner.update({
      where: { id },
      data: { text, sortOrder, isActive },
    });
  } else {
    await prisma.promoBanner.create({
      data: { text, sortOrder, isActive },
    });
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deletePromoBanner(formData: FormData) {
  await assertAdmin();
  await prisma.promoBanner.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function upsertHomeSlide(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const title = String(formData.get("title") || "").trim() || null;
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const linkUrl = String(formData.get("linkUrl") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";
  if (!imageUrl) throw new Error("Image required");

  if (id) {
    await prisma.homeSlide.update({
      where: { id },
      data: { imageUrl, title, subtitle, linkUrl, sortOrder, isActive },
    });
  } else {
    await prisma.homeSlide.create({
      data: { imageUrl, title, subtitle, linkUrl, sortOrder, isActive },
    });
  }
  revalidatePath("/admin/slides");
  revalidatePath("/");
  redirect("/admin/slides");
}

export async function deleteHomeSlide(formData: FormData) {
  await assertAdmin();
  await prisma.homeSlide.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/slides");
  revalidatePath("/");
}
