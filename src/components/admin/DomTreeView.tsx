import type { DomNode, DomKind } from "@/lib/dom-tree-data";

const KIND_STYLE: Record<DomKind, string> = {
  document:
    "border-violet-400 bg-violet-100 text-violet-950 shadow-[0_0_0_1px_rgba(139,92,246,0.25)]",
  element:
    "border-sky-400/80 bg-sky-50 text-sky-950",
  text: "border-amber-300 bg-amber-50 text-amber-950 italic",
  attr: "border-emerald-300 bg-emerald-50 text-emerald-900",
};

function resolveKind(node: DomNode): DomKind {
  if (node.kind) return node.kind;
  if (node.tag === "document") return "document";
  if (node.tag.startsWith("#")) return "text";
  return "element";
}

export function DomTreeView({ root }: { root: DomNode }) {
  return (
    <div className="dom-tree-scroll overflow-x-auto rounded-2xl border border-outline/40 bg-[#f4f7fb] p-4 md:p-6">
      <div className="min-w-max">
        <DomBranch node={root} />
      </div>
    </div>
  );
}

function DomBranch({ node }: { node: DomNode }) {
  const kind = resolveKind(node);
  const kids = node.children ?? [];

  return (
    <div className="inline-flex items-center gap-0 align-middle">
      <DomBox node={node} kind={kind} />
      {kids.length > 0 ? (
        <div className="ml-1 flex items-center">
          <Arrow />
          <div className="flex flex-col gap-3 border-l-2 border-sky-300/70 pl-3">
            {kids.map((child, i) => (
              <div key={`${child.tag}-${i}`} className="flex items-center">
                <BranchTick />
                <DomBranch node={child} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DomBox({ node, kind }: { node: DomNode; kind: DomKind }) {
  const label =
    kind === "document"
      ? "document"
      : kind === "text"
        ? node.text || node.tag
        : `<${node.tag}${node.attrs ? ` ${node.attrs}` : ""}>`;

  return (
    <div
      className={`relative max-w-[240px] rounded-lg border-2 px-3 py-2 text-left shadow-sm ${KIND_STYLE[kind]}`}
    >
      <p className="font-mono text-[12px] font-bold leading-tight break-words">
        {kind === "text" ? (
          <span className="font-sans font-medium">{label}</span>
        ) : kind === "document" ? (
          <>
            {label}{" "}
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wide opacity-70">
              (Document)
            </span>
          </>
        ) : (
          label
        )}
      </p>
      {kind !== "text" && node.text ? (
        <p className="mt-1 font-sans text-[11px] leading-snug text-espresso/80">
          {node.text}
        </p>
      ) : null}
      {node.note ? (
        <p className="mt-1 rounded bg-white/70 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-taupe">
          {node.note}
        </p>
      ) : null}
    </div>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="mx-1 inline-flex h-0 w-6 items-center border-t-2 border-sky-400"
    />
  );
}

function BranchTick() {
  return (
    <span
      aria-hidden
      className="-ml-3 mr-2 inline-block h-0 w-3 border-t-2 border-sky-300/70"
    />
  );
}

export function DomTreeLegend() {
  const items: { kind: DomKind; label: string }[] = [
    { kind: "document", label: "Document node" },
    { kind: "element", label: "Element node" },
    { kind: "text", label: "Text node" },
    { kind: "attr", label: "Attributes (shown on element)" },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.kind}
          className={`inline-flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold ${KIND_STYLE[item.kind]}`}
        >
          {item.label}
        </div>
      ))}
      <div className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-3 py-1.5 text-xs text-taupe">
        → Parent → Child
      </div>
    </div>
  );
}
