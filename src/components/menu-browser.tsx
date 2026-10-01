"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { isWithin } from "@/lib/availability";
import { formatTime, normalize } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { DIETARY_TAGS, type Category, type DietaryTag, type Dish, type Locale } from "@/lib/types";
import { useRestaurantNow } from "@/lib/use-restaurant-now";
import { TAG_ICONS } from "./dish-badges";
import { DishCard } from "./dish-card";
import { DishDialog } from "./dish-dialog";

type Props = { categories: Category[]; locale: Locale; dict: Dictionary };

/** Altura da faixa fixa de categorias no celular (igual a `scroll-mt-22`); as seções param logo abaixo dela. */
const STICKY_OFFSET = 88;

// Prato vegano também serve para quem filtra por vegetariano ou sem lactose.
const hasTag = (dish: Dish, tag: DietaryTag) =>
  dish.tags.includes(tag) || ((tag === "vegetarian" || tag === "lactose_free") && dish.tags.includes("vegan"));

export function MenuBrowser({ categories, locale, dict }: Props) {
  const now = useRestaurantNow();
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<DietaryTag[]>([]);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [active, setActive] = useState<string>();
  const chipsRef = useRef<HTMLUListElement>(null);

  const isFiltering = query.trim() !== "" || tags.length > 0;

  const visible = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    // Itens com horário só aparecem quando o navegador já sabe a hora (até lá, `now` é null).
    const inTime = (item: { availability?: Category["availability"] }) =>
      !item.availability || (now !== null && isWithin(item.availability, now));

    return categories
      .filter(inTime)
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) => {
          if (!inTime(dish)) return false;
          if (!tags.every((tag) => hasTag(dish, tag))) return false;
          const haystack = normalize(`${dish.name[locale]} ${dish.description[locale]} ${dish.region?.[locale] ?? ""}`);
          return terms.every((term) => haystack.includes(term));
        }),
      }))
      .filter((category) => category.dishes.length > 0);
  }, [categories, now, query, tags, locale]);

  const resultCount = visible.reduce((sum, c) => sum + c.dishes.length, 0);
  const currentId = active && visible.some((c) => c.id === active) ? active : visible[0]?.id;

  // Destaca a categoria que está no topo da tela durante a rolagem.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = visible[0]?.id;
        for (const { id } of visible) {
          const el = document.getElementById(`cat-${id}`);
          if (el && el.getBoundingClientRect().top <= STICKY_OFFSET + 40) current = id;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [visible]);

  // Mantém o chip ativo visível na faixa horizontal, sem mexer na rolagem da página.
  useEffect(() => {
    const list = chipsRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-cat="${currentId}"]`);
    if (!list || !chip) return;
    list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [currentId]);

  const toggleTag = (tag: DietaryTag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const categoryLink = (category: Category, variant: "chip" | "list") => {
    const isActive = category.id === currentId;
    const styles =
      variant === "chip"
        ? `inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition ${
            isActive ? "bg-text text-bg" : "bg-surface-2 text-text hover:bg-border"
          }`
        : `flex items-baseline justify-between gap-2 rounded-lg px-3 py-2 transition ${
            isActive ? "bg-surface-2 font-semibold text-text" : "text-muted hover:text-text"
          }`;
    return (
      <a href={`#cat-${category.id}`} aria-current={isActive ? "true" : undefined} className={styles}>
        <span className={variant === "list" ? "font-serif text-lg" : ""}>{category.name[locale]}</span>
        {variant === "list" && <span className="text-xs tabular-nums">{category.dishes.length}</span>}
      </a>
    );
  };

  return (
    <section id="cardapio" aria-label={dict.header.menu} className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div role="search" className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.menu.searchPlaceholder}
              aria-label={dict.menu.searchLabel}
              className="h-12 w-full rounded-full border border-border bg-surface pr-12 pl-12 text-base outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/25 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={dict.menu.clearSearch}
                className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-text"
              >
                <X aria-hidden className="size-5" />
              </button>
            )}
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-xs font-semibold tracking-widest text-muted uppercase">{dict.menu.filters}</legend>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => {
                const Icon = TAG_ICONS[tag];
                const on = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition ${
                      on
                        ? "border-olive bg-olive-soft font-semibold text-olive"
                        : "border-border bg-surface text-text hover:border-olive/50"
                    }`}
                  >
                    <Icon aria-hidden className="size-4" />
                    {dict.tags[tag]}
                  </button>
                );
              })}
            </div>
            {tags.length > 0 && (
              <button type="button" onClick={() => setTags([])} className="mt-3 text-sm text-accent underline-offset-4 hover:underline">
                {dict.menu.clearFilters}
              </button>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted">{dict.menu.dietaryNote}</p>
          </fieldset>

          <nav aria-label={dict.menu.categories} className="mt-8 hidden lg:block">
            <h2 className="mb-2 px-3 text-xs font-semibold tracking-widest text-muted uppercase">{dict.menu.categories}</h2>
            <ul className="flex flex-col gap-0.5">
              {visible.map((category) => (
                <li key={category.id}>{categoryLink(category, "list")}</li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <nav
            aria-label={dict.menu.categories}
            className="sticky top-0 z-20 -mx-4 mt-6 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden"
          >
            <ul ref={chipsRef} className="no-scrollbar flex gap-2 overflow-x-auto">
              {visible.map((category) => (
                <li key={category.id} data-cat={category.id}>
                  {categoryLink(category, "chip")}
                </li>
              ))}
            </ul>
          </nav>

          <p aria-live="polite" className="mt-6 text-sm text-muted lg:mt-0">
            {isFiltering &&
              resultCount > 0 &&
              (resultCount === 1 ? dict.menu.resultsOne : dict.menu.resultsMany.replace("{n}", String(resultCount)))}
          </p>

          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <p className="font-serif text-2xl">{dict.menu.noResults}</p>
              <p className="mt-2 text-muted">{dict.menu.noResultsHint}</p>
            </div>
          )}

          <div className="flex flex-col gap-14">
            {visible.map((category) => (
              <section
                key={category.id}
                id={`cat-${category.id}`}
                aria-labelledby={`cat-${category.id}-title`}
                className="scroll-mt-22 lg:scroll-mt-8"
              >
                <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
                  <h2 id={`cat-${category.id}-title`} className="font-serif text-4xl font-semibold sm:text-5xl">
                    {category.name[locale]}
                  </h2>
                  <p className="text-sm tracking-wide text-muted">
                    {category.subtitle[locale]}
                    {category.availability && (
                      <>
                        {" · "}
                        {dict.menu.availableUntil} {formatTime(category.availability.to, locale)}
                      </>
                    )}
                  </p>
                </header>
                <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {category.dishes.map((dish) => (
                    <li key={dish.id} className="flex">
                      <DishCard dish={dish} locale={locale} dict={dict} onOpen={() => setSelected(dish)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>

      <DishDialog dish={selected} locale={locale} dict={dict} onClose={() => setSelected(null)} />
    </section>
  );
}
