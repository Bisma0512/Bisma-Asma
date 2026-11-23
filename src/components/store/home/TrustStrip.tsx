import { Reveal } from "@/components/Reveal";

const ITEMS = [
  ["100% Vegan", "Plant-kind formulas"],
  ["Clean Beauty", "No harsh nasties"],
  ["COD Nationwide", "Pay when you receive"],
  ["Easy Returns", "Hassle-free support"],
];

export function TrustStrip() {
  return (
    <section className="border-y border-outline/40 bg-surface-low">
      <Reveal>
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-8 lg:px-12">
          {ITEMS.map(([title, sub], i) => (
            <div
              key={title}
              className="text-center"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <p className="font-display text-xl text-espresso">{title}</p>
              <p className="mt-1 text-sm text-taupe">{sub}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
