"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Dish, Locale } from "@/lib/types";
import { DietaryTags, HighlightBadge } from "./dish-badges";
import { DishPhoto, Prices } from "./dish-card";

type Props = { dish: Dish | null; locale: Locale; dict: Dictionary; onClose: () => void };

/**
 * Detalhe do prato com <dialog> nativo: foco preso, Esc para fechar e leitura correta por leitores de tela.
 * No celular abre como bottom sheet; a partir de 640px, centralizado.
 */
export function DishDialog({ dish, locale, dict, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dish && dialog && !dialog.open) dialog.showModal();
  }, [dish]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clique fora do conteúdo (no fundo escurecido) fecha o detalhe.
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      aria-labelledby="dish-dialog-title"
      className="mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-surface p-0 text-text backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-xl sm:rounded-3xl"
    >
      {dish && (
        <article>
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
            <DishPhoto dish={dish} locale={locale} sizes="(min-width: 640px) 576px, 100vw" />
            <form method="dialog" className="absolute top-3 right-3">
              <button
                type="submit"
                aria-label={dict.menu.close}
                className="grid size-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <X aria-hidden className="size-5" />
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-4 p-5 pb-8 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {dish.highlight && <HighlightBadge highlight={dish.highlight} dict={dict} />}
              {!dish.isAvailable && (
                <span className="rounded-full bg-text px-2.5 py-1 text-xs font-semibold tracking-wide text-bg uppercase">
                  {dict.menu.soldOut}
                </span>
              )}
            </div>
            <h2 id="dish-dialog-title" className="font-serif text-3xl leading-tight font-semibold sm:text-4xl">
              {dish.name[locale]}
            </h2>
            <p className="text-base leading-relaxed text-muted">{dish.description[locale]}</p>
            <DietaryTags tags={dish.tags} dict={dict} />
            <div className="border-t border-border pt-4 text-base">
              <Prices dish={dish} locale={locale} />
            </div>
          </div>
        </article>
      )}
    </dialog>
  );
}
