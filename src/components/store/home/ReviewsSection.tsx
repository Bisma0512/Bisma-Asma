import { Reveal } from "@/components/Reveal";

const REVIEWS = [
  {
    name: "Ayesha K.",
    city: "Karachi, PK",
    quote:
      "The lip glaze is an absolute holy grail. Most oils dry out my lips after an hour, but this stays plump through lunch. Already ordered backups.",
    wearing: "Dew Glaze Lip Oil · Honey Glaze",
  },
  {
    name: "Sara M.",
    city: "Lahore, PK",
    quote:
      "Found my undertone match for complexion — it blurs redness without feeling like face paint. Soft, breathable, perfect for humid days.",
    wearing: "Skin Tint · Warm Honey",
  },
  {
    name: "Noor R.",
    city: "Islamabad, PK",
    quote:
      "The cream blush melts into skin and lasts through office AC and evening chai. Looks like I just pinched my cheeks — in the best way.",
    wearing: "Cloud Blush · Terracotta",
  },
];

export function ReviewsSection() {
  return (
    <section className="w-full py-16 md:py-24">
      <Reveal>
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="mb-10 max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Social Proof
            </p>
            <h2 className="mt-3 font-display text-3xl text-espresso md:text-4xl">
              Loved by glowing girls nationwide
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delayMs={i * 80}>
                <article className="h-full rounded-2xl border border-outline/40 bg-white p-6">
                  <div className="flex items-center gap-2 text-primary">
                    {"★★★★★".split("").map((s, idx) => (
                      <span key={idx} className="text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-taupe">
                    “{r.quote}”
                  </p>
                  <div className="mt-6 border-t border-outline/40 pt-4">
                    <p className="font-semibold text-espresso">
                      {r.name}{" "}
                      <span className="text-xs font-normal text-primary">
                        · Verified Buyer
                      </span>
                    </p>
                    <p className="text-xs text-taupe">{r.city}</p>
                    <p className="mt-2 text-xs font-medium text-espresso">
                      Wearing: {r.wearing}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
