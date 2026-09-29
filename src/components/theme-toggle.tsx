"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const ONE_YEAR = 60 * 60 * 24 * 365;

function currentTheme(): "light" | "dark" {
  const saved = document.documentElement.getAttribute("data-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Reaplica o tema salvo a cada navegação. Ao trocar de idioma o layout raiz é recriado,
 * o React monta um <html> novo e o `data-theme` posto pelo script inicial se perde.
 */
export function ThemeSync() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const saved = document.cookie.match(/(?:^|; )theme=(light|dark)/)?.[1];
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }, [pathname]);
  return null;
}

export function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `theme=${next}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  };

  // Os dois ícones são renderizados e o CSS mostra o certo, então não há diferença entre servidor e navegador.
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-11 place-items-center rounded-full text-current transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 dark:block" />
      <span className="sr-only dark:hidden">{labels.dark}</span>
      <span className="sr-only hidden dark:inline">{labels.light}</span>
    </button>
  );
}
