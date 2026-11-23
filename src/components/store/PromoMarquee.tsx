type Banner = { id: string; text: string };

export function PromoMarquee({ banners }: { banners: Banner[] }) {
  const items =
    banners.length > 0
      ? banners
      : [
          {
            id: "fallback",
            text: "Complimentary delivery on orders over Rs 5,000 · Cash on Delivery",
          },
        ];

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden bg-primary-container text-espresso">
      <div className="marquee-track flex w-max items-center gap-10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
        {loop.map((b, i) => (
          <span key={`${b.id}-${i}`} className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-espresso/50" />
            {b.text}
          </span>
        ))}
      </div>
    </div>
  );
}
