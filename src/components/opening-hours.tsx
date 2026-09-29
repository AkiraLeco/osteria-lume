"use client";

import { formatTime } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, OpeningHours, Weekday } from "@/lib/types";
import { useRestaurantNow } from "@/lib/use-restaurant-now";

// Semana começando na segunda, como se lê em cardápios e placas.
const WEEK: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function OpeningHoursTable({ hours, locale, dict }: { hours: OpeningHours; locale: Locale; dict: Dictionary }) {
  const today = useRestaurantNow()?.day;

  return (
    <table className="w-full text-sm">
      <tbody>
        {WEEK.map((day) => {
          const ranges = hours[day] ?? [];
          const isToday = day === today;
          return (
            <tr key={day} className={isToday ? "font-semibold text-text" : "text-muted"}>
              <th scope="row" className="py-1.5 pr-4 text-left font-[inherit]">
                {dict.weekdays[day]}
                {isToday && <span className="ml-2 text-xs font-medium text-accent">({dict.info.today})</span>}
              </th>
              <td className="py-1.5 text-right tabular-nums">
                {ranges.length === 0
                  ? dict.info.closed
                  : ranges.map(([from, to]) => `${formatTime(from, locale)}–${formatTime(to, locale)}`).join(" · ")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
