"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
};

export function HomeSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[21/9] min-h-[220px] w-full md:min-h-[360px]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.imageUrl}
              alt={slide.title || "Homepage slide"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/55 via-espresso/20 to-transparent" />
          </div>
        ))}
        <div className="absolute inset-0 flex items-end p-6 md:p-12">
          <div className="max-w-xl text-white">
            {current.title ? (
              <h2 className="font-display text-3xl md:text-5xl">{current.title}</h2>
            ) : null}
            {current.subtitle ? (
              <p className="mt-2 text-sm md:text-base text-white/85">
                {current.subtitle}
              </p>
            ) : null}
            {current.linkUrl ? (
              <Link
                href={current.linkUrl}
                className="mt-5 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-espresso transition hover:bg-champagne"
              >
                Shop now
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="absolute bottom-4 right-4 flex gap-2 md:bottom-8 md:right-8">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
