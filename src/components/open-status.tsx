"use client";

import { isOpen } from "@/lib/availability";
import type { OpeningHours } from "@/lib/types";
import { useRestaurantNow } from "@/lib/use-restaurant-now";

export function OpenStatus({ hours, labels }: { hours: OpeningHours; labels: { open: string; closed: string } }) {
  const now = useRestaurantNow();
  // Reserva o espaço antes de saber o horário, para o layout não pular.
  if (!now) return <span className="inline-block h-8" aria-hidden />;

  const open = isOpen(hours, now);
  return (
    <span className="inline-flex h-8 items-center gap-2 self-start rounded-full bg-black/35 px-3 text-sm backdrop-blur-sm">
      <span className={`size-2 rounded-full ${open ? "bg-emerald-400" : "bg-white/50"}`} aria-hidden />
      {open ? labels.open : labels.closed}
    </span>
  );
}
