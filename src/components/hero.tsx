import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, RestaurantInfo } from "@/lib/types";
import { LanguageLink } from "./language-link";
import { OpenStatus } from "./open-status";
import { ThemeToggle } from "./theme-toggle";

type Props = { restaurant: RestaurantInfo; locale: Locale; dict: Dictionary };

export function Hero({ restaurant, locale, dict }: Props) {
  return (
    <header className="relative isolate flex h-[72svh] min-h-[520px] max-h-[860px] flex-col text-white">
      <Image
        src="/images/dishes/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/35 to-black/75" aria-hidden />

      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-3 sm:px-6">
        <span className="font-serif text-xl font-semibold tracking-wide">{restaurant.name}</span>
        <div className="flex items-center gap-1">
          <LanguageLink target={locale === "pt" ? "en" : "pt"} label={dict.header.switchLanguage} />
          <ThemeToggle labels={{ light: dict.header.themeLight, dark: dict.header.themeDark }} />
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pb-12 sm:px-6 md:pb-16">
        <OpenStatus hours={restaurant.openingHours} labels={{ open: dict.hero.openNow, closed: dict.hero.closedNow }} />
        <h1 className="mt-4 font-serif text-5xl leading-none font-semibold sm:text-7xl md:text-8xl">
          {restaurant.name}
        </h1>
        <p className="mt-3 font-serif text-2xl italic sm:text-3xl">{restaurant.tagline[locale]}</p>
        <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">{restaurant.about[locale]}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#cardapio"
            className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-on-accent transition hover:bg-accent-hover"
          >
            {dict.hero.seeMenu}
          </a>
          <a
            href="#info"
            className="inline-flex h-12 items-center rounded-full border border-white/50 px-6 font-medium transition hover:bg-white/10"
          >
            {dict.header.info}
          </a>
        </div>
      </div>
    </header>
  );
}
