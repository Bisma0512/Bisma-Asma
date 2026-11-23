import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteHomeSlide } from "@/app/actions/admin";

export default async function AdminSlidesPage() {
  const slides = await prisma.homeSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Home slides</h1>
          <p className="mt-1 text-taupe">
            Auto-scrolling homepage image slider
          </p>
        </div>
        <Link
          href="/admin/slides/new"
          className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
        >
          Add slide
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="overflow-hidden rounded-2xl border border-outline/40 bg-white"
          >
            <div className="relative aspect-[16/9] bg-surface-container">
              <Image
                src={slide.imageUrl}
                alt={slide.title || "Slide"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-2 p-4">
              <p className="font-semibold text-espresso">
                {slide.title || "Untitled"}
              </p>
              <p className="text-sm text-taupe">{slide.subtitle}</p>
              <p className="text-xs text-taupe">
                Sort {slide.sortOrder} · {slide.isActive ? "Active" : "Hidden"}
              </p>
              <div className="flex gap-3 pt-1">
                <Link
                  href={`/admin/slides/${slide.id}`}
                  className="text-sm font-semibold text-primary"
                >
                  Edit
                </Link>
                <form action={deleteHomeSlide}>
                  <input type="hidden" name="id" value={slide.id} />
                  <button className="text-sm font-semibold text-critical">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
