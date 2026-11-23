import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-espresso">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
