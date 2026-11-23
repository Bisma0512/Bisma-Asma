import { cn } from "@/lib/utils";

const STEPS = [
  { key: "PLACED", label: "Order Placed" },
  { key: "PACKED", label: "Formulated & Packed" },
  { key: "SHIPPED", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

const ORDER: Record<string, number> = {
  PLACED: 0,
  CONFIRMED: 0,
  PACKED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

type Props = {
  status: string;
};

export function OrderStepper({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-lg bg-critical/10 px-4 py-3 text-sm font-semibold text-critical">
        This order was cancelled.
      </p>
    );
  }

  const current = ORDER[status] ?? 0;

  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {STEPS.map((step, index) => {
        const done = index <= current;
        const active = index === current;
        return (
          <li
            key={step.key}
            className={cn(
              "rounded-xl border px-3 py-3 text-sm",
              done
                ? "border-primary/40 bg-champagne text-espresso"
                : "border-outline/50 bg-white text-taupe",
              active && "ring-2 ring-primary/30"
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider">
              Step {index + 1}
            </p>
            <p className="mt-1 font-semibold">{step.label}</p>
          </li>
        );
      })}
    </ol>
  );
}
