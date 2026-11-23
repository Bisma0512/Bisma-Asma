"use client";

import { useActionState } from "react";
import { placeCodOrder, type CheckoutState } from "@/app/actions/checkout";

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Other",
];

type Props = {
  defaultName?: string;
  defaultEmail?: string;
};

export function CheckoutForm({ defaultName = "", defaultEmail = "" }: Props) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    placeCodOrder,
    {}
  );

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6">
      {state.error ? (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">
          {state.error}
        </p>
      ) : null}
      <div>
        <label className="text-sm font-semibold text-espresso">Full name *</label>
        <input
          name="shippingName"
          required
          defaultValue={defaultName}
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-espresso">Phone *</label>
        <input
          name="shippingPhone"
          required
          placeholder="03XX-XXXXXXX"
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-espresso">Email</label>
        <input
          name="guestEmail"
          type="email"
          defaultValue={defaultEmail}
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-espresso">City *</label>
        <select
          name="shippingCity"
          required
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
          defaultValue="Karachi"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-espresso">Address *</label>
        <textarea
          name="shippingAddress"
          required
          rows={3}
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-espresso">Notes</label>
        <textarea
          name="shippingNotes"
          rows={2}
          className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-espresso py-3 text-sm font-semibold text-white hover:bg-primary disabled:opacity-60"
      >
        {pending ? "Placing order…" : "Place COD Order"}
      </button>
    </form>
  );
}
