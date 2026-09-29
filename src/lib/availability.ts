import type { Availability, OpeningHours, Weekday } from "./types";

export const RESTAURANT_TIME_ZONE = "America/Sao_Paulo";

export type LocalTime = { day: Weekday; minutes: number };

const weekdayIndex: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: RESTAURANT_TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Dia da semana e minuto do dia no fuso do restaurante, independente do fuso de quem acessa. */
export function restaurantTime(date: Date): LocalTime {
  const get = (type: string) => parts.formatToParts(date).find((p) => p.type === type)!.value;
  return {
    day: weekdayIndex[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const inRange = (now: LocalTime, from: string, to: string) =>
  now.minutes >= toMinutes(from) && now.minutes < toMinutes(to);

export const isWithin = (availability: Availability, now: LocalTime) =>
  availability.days.includes(now.day) && inRange(now, availability.from, availability.to);

export const isOpen = (hours: OpeningHours, now: LocalTime) =>
  (hours[now.day] ?? []).some(([from, to]) => inRange(now, from, to));
