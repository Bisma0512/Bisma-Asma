import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function ShadeDiagnostic() {
  return (
    <section id="shade-finder-section" className="w-full py-16 md:py-24">
      <Reveal>
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:grid-cols-2 md:px-8 lg:px-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Virtual Match
            </p>
            <h2 className="mt-3 font-display text-3xl text-espresso md:text-5xl">
              3-Minute Virtual{" "}
              <span className="italic font-normal text-primary">
                Shade Diagnostic
              </span>
            </h2>
            <p className="mt-4 max-w-md text-taupe">
              Discover undertone-perfect shades for lips, cheeks, and complexion —
              built for Pakistani skin tones with a free shade exchange guarantee.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                ["99.4%", "Match precision"],
                ["6 Qs", "Quick undertone quiz"],
                ["Free", "First shade exchange"],
              ].map(([stat, label]) => (
                <div key={label} className="rounded-xl bg-surface-low p-4">
                  <p className="font-display text-2xl text-espresso">{stat}</p>
                  <p className="mt-1 text-xs text-taupe">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop/complexion"
                className="rounded-lg bg-espresso px-6 py-3 text-sm font-semibold text-white"
              >
                Browse complexion
              </Link>
              <Link
                href="/shop"
                className="rounded-lg bg-champagne px-6 py-3 text-sm font-semibold text-espresso"
              >
                Take undertone edit
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container">
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=2000&q=90"
              alt="Shade diagnostic inspiration"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-espresso/70 to-transparent p-6 text-white">
              <p className="text-sm font-semibold">
                Skin-first formulas · Dewy to soft-matte finishes
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
