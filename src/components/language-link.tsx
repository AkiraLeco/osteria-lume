"use client";

import Link from "next/link";
import { LOCALE_COOKIE } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Troca de idioma e guarda a escolha, para que "/" leve direto a ele nas próximas visitas. */
export function LanguageLink({ target, label }: { target: Locale; label: string }) {
  return (
    <Link
      href={`/${target}`}
      hrefLang={target === "pt" ? "pt-BR" : "en"}
      aria-label={label}
      title={label}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
      }}
      className="grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold tracking-wider uppercase transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      {target}
    </Link>
  );
}
