"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  defaultOrder?: string;
  defaultPhone?: string;
};

export function TrackForm({ defaultOrder = "", defaultPhone = "" }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState(defaultOrder);
  const [phone, setPhone] = useState(defaultPhone);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      order: order.trim(),
      phone: phone.trim(),
    });
    router.push(`/track?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-outline/40 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"
    >
      <input
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        placeholder="BA-12345"
        required
        className="rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        required
        className="rounded-xl border border-outline bg-surface px-3 py-2.5 outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white"
      >
        Track
      </button>
    </form>
  );
}
