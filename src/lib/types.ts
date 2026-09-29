// Tipos do domínio. Espelham o modelo de dados do PROJETO.md (seção 8),
// com os textos PT/EN agrupados em `Localized` para facilitar o uso na interface.

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export type Localized = Record<Locale, string>;

/** 0 = domingo … 6 = sábado (mesma convenção de `Date.getDay()`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Janela em que um item fica visível. Horários no formato "HH:MM", fuso America/Sao_Paulo. */
export type Availability = {
  days: Weekday[];
  from: string;
  to: string;
};

export const DIETARY_TAGS = ["vegetarian", "vegan", "gluten_free", "lactose_free", "spicy"] as const;
export type DietaryTag = (typeof DIETARY_TAGS)[number];

export type Highlight = "chef_suggestion" | "best_seller" | "new";

export type Price = {
  /** Vazio quando o prato tem preço único. */
  label?: Localized;
  cents: number;
};

export type Dish = {
  id: string;
  name: Localized;
  description: Localized;
  image?: string;
  prices: Price[];
  tags: DietaryTag[];
  highlight?: Highlight;
  /** false = esgotado (continua visível, esmaecido). */
  isAvailable: boolean;
  isHidden: boolean;
  availability?: Availability;
};

export type Category = {
  id: string;
  name: Localized;
  subtitle: Localized;
  isActive: boolean;
  availability?: Availability;
  dishes: Dish[];
};

/** Horário de funcionamento: dia da semana -> intervalos ["HH:MM", "HH:MM"]. */
export type OpeningHours = Partial<Record<Weekday, [string, string][]>>;

export type RestaurantInfo = {
  name: string;
  tagline: Localized;
  about: Localized;
  address: string;
  mapsUrl: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  openingHours: OpeningHours;
};

export type Menu = {
  restaurant: RestaurantInfo;
  categories: Category[];
};
