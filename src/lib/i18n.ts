import { LOCALES, type DietaryTag, type Highlight, type Locale } from "./types";

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "lang";

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

const pt = {
  meta: {
    title: "Osteria Lume · Cardápio",
    description: "Cardápio da Osteria Lume: massas frescas, pizzas de fermentação lenta e vinhos italianos.",
  },
  header: {
    menu: "Cardápio",
    info: "Informações",
    switchLanguage: "View in English",
    themeLight: "Usar tema claro",
    themeDark: "Usar tema escuro",
  },
  hero: {
    openNow: "Aberto agora",
    closedNow: "Fechado agora",
    seeMenu: "Ver cardápio",
  },
  menu: {
    categories: "Categorias",
    searchPlaceholder: "Buscar no cardápio",
    searchLabel: "Buscar prato, ingrediente ou região",
    clearSearch: "Limpar busca",
    filters: "Filtrar por",
    clearFilters: "Limpar filtros",
    dietaryNote:
      "Os selos descrevem as receitas. Nossa cozinha manipula trigo, leite e frutos do mar: em caso de doença celíaca ou alergia, fale com o garçom.",
    noResults: "Nenhum prato encontrado.",
    noResultsHint: "Tente outra palavra ou remova algum filtro.",
    soldOut: "Esgotado",
    close: "Fechar",
    availableUntil: "Disponível até",
    resultsOne: "1 prato encontrado",
    resultsMany: "{n} pratos encontrados",
  },
  tags: {
    vegetarian: "Vegetariano",
    vegan: "Vegano",
    gluten_free: "Sem glúten",
    lactose_free: "Sem lactose",
    spicy: "Picante",
  } satisfies Record<DietaryTag, string>,
  highlights: {
    chef_suggestion: "Sugestão do chef",
    best_seller: "Mais pedido",
    new: "Novidade",
  } satisfies Record<Highlight, string>,
  info: {
    title: "Visite-nos",
    address: "Endereço",
    openMap: "Abrir no mapa",
    hours: "Horário de funcionamento",
    closed: "Fechado",
    today: "hoje",
    contact: "Contato",
    phone: "Telefone",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  },
  weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  footer: {
    fictional: "Restaurante fictício · projeto de portfólio.",
    credits: "Créditos das fotos",
    priceNote: "Preços em reais. Serviço não incluso.",
  },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    title: "Osteria Lume · Menu",
    description: "Osteria Lume's menu: fresh pasta, slow-fermented pizza and Italian wines.",
  },
  header: {
    menu: "Menu",
    info: "Visit",
    switchLanguage: "Ver em português",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
  },
  hero: {
    openNow: "Open now",
    closedNow: "Closed now",
    seeMenu: "See the menu",
  },
  menu: {
    categories: "Categories",
    searchPlaceholder: "Search the menu",
    searchLabel: "Search for a dish, ingredient or region",
    clearSearch: "Clear search",
    filters: "Filter by",
    clearFilters: "Clear filters",
    dietaryNote:
      "Labels describe the recipes. Our kitchen handles wheat, dairy and shellfish: if you have coeliac disease or an allergy, please tell your server.",
    noResults: "No dishes found.",
    noResultsHint: "Try another word or remove a filter.",
    soldOut: "Sold out",
    close: "Close",
    availableUntil: "Available until",
    resultsOne: "1 dish found",
    resultsMany: "{n} dishes found",
  },
  tags: {
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    gluten_free: "Gluten-free",
    lactose_free: "Lactose-free",
    spicy: "Spicy",
  },
  highlights: {
    chef_suggestion: "Chef's pick",
    best_seller: "Best seller",
    new: "New",
  },
  info: {
    title: "Visit us",
    address: "Address",
    openMap: "Open in maps",
    hours: "Opening hours",
    closed: "Closed",
    today: "today",
    contact: "Contact",
    phone: "Phone",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  },
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  footer: {
    fictional: "Fictional restaurant · portfolio project.",
    credits: "Photo credits",
    priceNote: "Prices in Brazilian reais. Service not included.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { pt, en };
