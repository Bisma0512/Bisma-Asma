"use client";

import { upsertHomeSlide } from "@/app/actions/admin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Slide = {
  id?: string;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function SlideForm({ slide }: { slide?: Slide }) {
  return (
    <form
      action={upsertHomeSlide}
      className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-outline/40 bg-white p-6"
    >
      {slide?.id ? <input type="hidden" name="id" value={slide.id} /> : null}
      <ImageUploadField
        name="imageUrl"
        label="Slide image"
        defaultValue={slide?.imageUrl}
        required
      />
      <div>
        <label className="text-sm font-semibold">Title</label>
        <input
          name="title"
          defaultValue={slide?.title ?? ""}
          className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Subtitle</label>
        <input
          name="subtitle"
          defaultValue={slide?.subtitle ?? ""}
          className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Link URL</label>
        <input
          name="linkUrl"
          defaultValue={slide?.linkUrl ?? "/shop"}
          placeholder="/shop"
          className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <div>
          <label className="text-sm font-semibold">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={slide?.sortOrder ?? 0}
            className="mt-1 w-28 rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <label className="inline-flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={slide?.isActive ?? true}
          />
          Active
        </label>
      </div>
      <button className="rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-white">
        Save slide
      </button>
    </form>
  );
}
