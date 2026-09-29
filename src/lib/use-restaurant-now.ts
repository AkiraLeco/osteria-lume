"use client";

import { useSyncExternalStore } from "react";
import { restaurantTime, type LocalTime } from "./availability";

let cachedMinute = -1;
let cached: LocalTime | null = null;

// Mesmo objeto enquanto o minuto não muda, para o React não re-renderizar à toa.
function getSnapshot() {
  const minute = Math.floor(Date.now() / 60_000);
  if (minute !== cachedMinute) {
    cachedMinute = minute;
    cached = restaurantTime(new Date());
  }
  return cached;
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/**
 * Hora atual no fuso do restaurante, atualizada a cada minuto.
 * No servidor é `null`, porque ele não sabe quando a página será vista:
 * o que depende do horário só aparece quando o navegador assume.
 */
export const useRestaurantNow = (): LocalTime | null =>
  useSyncExternalStore(subscribe, getSnapshot, () => null);
