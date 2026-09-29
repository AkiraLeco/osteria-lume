import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale } from "@/lib/i18n";

/** Quem acessa "/" vai para o idioma escolhido antes, ou para o idioma do navegador. */
export function proxy(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const browser = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const prefersEnglish = browser.startsWith("en") || (!browser.startsWith("pt") && browser.includes("en"));

  const locale = saved && hasLocale(saved) ? saved : prefersEnglish ? "en" : DEFAULT_LOCALE;
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
