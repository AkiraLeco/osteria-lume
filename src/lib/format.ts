import type { Locale } from "./types";

const intlLocale: Record<Locale, string> = { pt: "pt-BR", en: "en-US" };

/** Preço em reais; esconde os centavos quando são zero ("R$ 72", "R$ 12,50"). */
export const formatPrice = (cents: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

/** "18:30" -> "18h30" em português; mantém "18:30" em inglês. */
export const formatTime = (time: string, locale: Locale) =>
  locale === "pt" ? time.replace(":", "h").replace(/h00$/, "h") : time;

/** Remove acentos e caixa para comparar textos na busca. */
export const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
