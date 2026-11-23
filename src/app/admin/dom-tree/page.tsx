import { DomTreeLegend, DomTreeView } from "@/components/admin/DomTreeView";
import { WEBSITE_DOM_TREE } from "@/lib/dom-tree-data";

export default function AdminDomTreePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-espresso">
          DOM Tree — Bisma &amp; Asma Cosmetics
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-taupe">
          Structural map of the live website: document → html → head/body →
          storefront layout, homepage sections, admin sidebar, and customer
          account dashboard. Scroll horizontally to explore branches.
        </p>
      </div>

      <DomTreeLegend />

      <DomTreeView root={WEBSITE_DOM_TREE} />

      <div className="rounded-2xl border border-outline/40 bg-white p-5 text-sm text-taupe">
        <p className="font-semibold text-espresso">Key points</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            CSS rules live inside <code className="text-espresso">globals.css</code>{" "}
            / Next font loaders — not separate DOM nodes.
          </li>
          <li>
            Store shell: <code className="text-espresso">header</code> +{" "}
            <code className="text-espresso">main</code> +{" "}
            <code className="text-espresso">footer</code>.
          </li>
          <li>
            Admin shell: <code className="text-espresso">aside.sidebar</code> +
            content pane (this page is linked from that sidebar).
          </li>
          <li>
            Customer dashboard at{" "}
            <code className="text-espresso">/account</code> shows orders + log
            out.
          </li>
        </ul>
      </div>
    </div>
  );
}
