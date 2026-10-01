import Image from "next/image";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Dish, Locale } from "@/lib/types";
import { DietaryTags, HighlightBadge } from "./dish-badges";

type Props = { dish: Dish; locale: Locale; dict: Dictionary; onOpen: () => void };

export function DishPhoto({ dish, locale, sizes }: { dish: Dish; locale: Locale; sizes: string }) {
  if (!dish.image) {
    return (
      <div className="grid size-full place-items-center bg-surface-2" aria-hidden>
        <span className="font-serif text-5xl text-accent/70 italic">{dish.name[locale].charAt(0)}</span>
      </div>
    );
  }
  return <Image src={dish.image} alt={dish.name[locale]} fill sizes={sizes} className="object-cover" />;
}

export function Prices({ dish, locale }: { dish: Dish; locale: Locale }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
      {dish.prices.map((price, i) => (
        <span key={i} className="whitespace-nowrap">
          {price.label && <span className="mr-1 text-muted">{price.label[locale]}</span>}
          <span className="font-semibold tabular-nums">{formatPrice(price.cents, locale)}</span>
        </span>
      ))}
    </p>
  );
}

export function DishCard({ dish, locale, dict, onOpen }: Props) {
  const soldOut = !dish.isAvailable;

  return (
    <article
      className={`group relative flex w-full gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-3 transition hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 sm:flex-col sm:gap-0 sm:p-0 ${soldOut ? "opacity-60" : ""}`}
    >
      <div className="relative order-2 aspect-square w-28 shrink-0 overflow-hidden rounded-xl sm:order-none sm:aspect-[4/3] sm:w-full sm:rounded-none">
        <DishPhoto dish={dish} locale={locale} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 112px" />
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-xs font-semibold tracking-wide text-white uppercase">
            {dict.menu.soldOut}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:p-4">
        {dish.highlight && (
          <div>
            <HighlightBadge highlight={dish.highlight} dict={dict} />
          </div>
        )}
        {dish.region && (
          <p className="-mb-1 text-xs font-medium tracking-wider text-muted uppercase">{dish.region[locale]}</p>
        )}
        <h3 className="font-serif text-xl leading-tight font-semibold">
          {/* O botão cobre o card inteiro: um só alvo de toque, sem aninhar conteúdo de bloco dentro de <button>. */}
          <button
            type="button"
            onClick={onOpen}
            className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {dish.name[locale]}
          </button>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{dish.description[locale]}</p>
        <DietaryTags tags={dish.tags} dict={dict} />
        <div className="mt-auto pt-1">
          <Prices dish={dish} locale={locale} />
        </div>
      </div>
    </article>
  );
}
