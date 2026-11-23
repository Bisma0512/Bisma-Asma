import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SlideForm } from "@/components/admin/SlideForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditSlidePage({ params }: Props) {
  const { id } = await params;
  const slide = await prisma.homeSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-espresso">Edit slide</h1>
      <SlideForm
        slide={{
          id: slide.id,
          imageUrl: slide.imageUrl,
          title: slide.title,
          subtitle: slide.subtitle,
          linkUrl: slide.linkUrl,
          sortOrder: slide.sortOrder,
          isActive: slide.isActive,
        }}
      />
    </div>
  );
}
