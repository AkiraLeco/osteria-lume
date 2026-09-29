import { ChefHat, Flame, Leaf, MilkOff, Sparkles, Sprout, Star, WheatOff, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { DietaryTag, Highlight } from "@/lib/types";

export const TAG_ICONS: Record<DietaryTag, LucideIcon> = {
  vegetarian: Leaf,
  vegan: Sprout,
  gluten_free: WheatOff,
  lactose_free: MilkOff,
  spicy: Flame,
};

const HIGHLIGHT_ICONS: Record<Highlight, LucideIcon> = {
  chef_suggestion: ChefHat,
  best_seller: Star,
  new: Sparkles,
};

/** Selos sempre com ícone e texto: a cor nunca é a única pista (PROJETO.md, seção 5). */
export function DietaryTags({ tags, dict }: { tags: DietaryTag[]; dict: Dictionary }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {tags.map((tag) => {
        const Icon = TAG_ICONS[tag];
        return (
          <li
            key={tag}
            className={`inline-flex items-center gap-1 text-xs font-medium ${tag === "spicy" ? "text-accent" : "text-olive"}`}
          >
            <Icon aria-hidden className="size-3.5" />
            {dict.tags[tag]}
          </li>
        );
      })}
    </ul>
  );
}

export function HighlightBadge({ highlight, dict }: { highlight: Highlight; dict: Dictionary }) {
  const Icon = HIGHLIGHT_ICONS[highlight];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
      <Icon aria-hidden className="size-3.5" />
      {dict.highlights[highlight]}
    </span>
  );
}
