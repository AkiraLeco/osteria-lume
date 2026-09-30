// Cardápio de exemplo da Osteria Lume (restaurante fictício), baseado na seção 9 do PROJETO.md.
// Serve de fonte de dados enquanto o Supabase não está configurado e, depois, de seed do banco.

import type { Availability, Category, DietaryTag, Dish, Highlight, Localized, Menu, Price } from "@/lib/types";

const l = (pt: string, en: string): Localized => ({ pt, en });

/** Preço único em reais. */
const single = (reais: number): Price[] => [{ cents: reais * 100 }];

/** Preços por tamanho, ex.: sizes(["Taça", "Glass", 32], ["Garrafa", "Bottle", 140]). */
const sizes = (...entries: [string, string, number][]): Price[] =>
  entries.map(([pt, en, reais]) => ({ label: l(pt, en), cents: reais * 100 }));

type DishInput = {
  id: string;
  name: Localized;
  description: Localized;
  prices: Price[];
  tags?: DietaryTag[];
  highlight?: Highlight;
  image?: boolean;
  availability?: Availability;
};

const dish = ({ image = true, tags = [], ...rest }: DishInput): Dish => ({
  ...rest,
  tags,
  image: image ? `/images/dishes/${rest.id}.jpg` : undefined,
  isAvailable: true,
  isHidden: false,
});

const categories: Category[] = [
  {
    id: "pranzo",
    name: l("Almoço Executivo", "Set Lunch"),
    subtitle: l("Pranzo Esecutivo · seg a sex", "Pranzo Esecutivo · Mon–Fri"),
    isActive: true,
    availability: { days: [1, 2, 3, 4, 5], from: "11:30", to: "15:00" },
    dishes: [
      dish({
        id: "pranzo-esecutivo",
        image: false,
        name: l("Pranzo del Giorno", "Pranzo del Giorno"),
        description: l(
          "Entrada, prato principal e sobremesa do dia, escolhidos pelo chef conforme a estação. Pergunte ao garçom as opções de hoje.",
          "Starter, main course and dessert of the day, chosen by the chef with seasonal produce. Ask your server for today's options.",
        ),
        prices: single(69),
        highlight: "chef_suggestion",
      }),
    ],
  },
  {
    id: "antipasti",
    name: l("Entradas", "Starters"),
    subtitle: l("Antipasti", "Antipasti"),
    isActive: true,
    dishes: [
      dish({
        id: "bruschetta-pomodoro",
        name: l("Bruschetta al Pomodoro", "Bruschetta al Pomodoro"),
        description: l(
          "Pão rústico tostado com tomate fresco, alho, manjericão e azeite extravirgem.",
          "Toasted rustic bread with fresh tomato, garlic, basil and extra virgin olive oil.",
        ),
        prices: single(34),
        tags: ["vegan"],
      }),
      dish({
        id: "burrata-pugliese",
        name: l("Burrata Pugliese", "Burrata Pugliese"),
        description: l(
          "Burrata cremosa com tomates confitados, pesto de manjericão e focaccia da casa.",
          "Creamy burrata with confit tomatoes, basil pesto and house focaccia.",
        ),
        prices: single(62),
        tags: ["vegetarian"],
        highlight: "chef_suggestion",
      }),
      dish({
        id: "carpaccio-manzo",
        name: l("Carpaccio di Manzo", "Carpaccio di Manzo"),
        description: l(
          "Lâminas finas de filé-mignon, rúcula, lascas de parmesão, alcaparras e molho de mostarda.",
          "Thinly sliced beef tenderloin, arugula, shaved parmesan, capers and mustard dressing.",
        ),
        prices: single(58),
        tags: ["gluten_free"],
      }),
      dish({
        id: "focaccia-casa",
        name: l("Focaccia della Casa", "Focaccia della Casa"),
        description: l(
          "Focaccia de fermentação natural com alecrim, sal grosso e azeite.",
          "Sourdough focaccia with rosemary, sea salt and olive oil.",
        ),
        prices: single(24),
        tags: ["vegan"],
      }),
    ],
  },
  {
    id: "primi",
    name: l("Massas e Risotos", "Pasta & Risotto"),
    subtitle: l("Primi", "Primi"),
    isActive: true,
    dishes: [
      dish({
        id: "spaghetti-carbonara",
        name: l("Spaghetti alla Carbonara", "Spaghetti alla Carbonara"),
        description: l(
          "A receita romana: guanciale crocante, gema, pecorino romano e pimenta-do-reino moída na hora.",
          "The Roman classic: crispy guanciale, egg yolk, pecorino romano and freshly ground black pepper.",
        ),
        prices: single(72),
        highlight: "best_seller",
      }),
      dish({
        id: "tagliatelle-ragu",
        name: l("Tagliatelle al Ragù", "Tagliatelle al Ragù"),
        description: l(
          "Tagliatelle fresco com ragù bolonhesa cozido lentamente por seis horas.",
          "Fresh tagliatelle with Bolognese ragù slow-cooked for six hours.",
        ),
        prices: single(76),
      }),
      dish({
        id: "gnocchi-pomodoro",
        name: l("Gnocchi al Pomodoro", "Gnocchi al Pomodoro"),
        description: l(
          "Nhoque de batata artesanal com molho de tomate San Marzano, manjericão e parmesão.",
          "Handmade potato gnocchi with San Marzano tomato sauce, basil and parmesan.",
        ),
        prices: single(64),
        tags: ["vegetarian"],
      }),
      dish({
        id: "risotto-funghi",
        name: l("Risotto ai Funghi", "Risotto ai Funghi"),
        description: l(
          "Arroz carnaroli com funghi porcini, manteiga e parmesão Reggiano.",
          "Carnaroli rice with porcini mushrooms, butter and Parmigiano Reggiano.",
        ),
        prices: single(82),
        tags: ["vegetarian", "gluten_free"],
      }),
      dish({
        id: "lasagna-nonna",
        name: l("Lasagna della Nonna", "Lasagna della Nonna"),
        description: l(
          "Camadas de massa fresca, ragù de carne, molho bechamel e parmesão gratinado.",
          "Layers of fresh pasta, meat ragù, béchamel and gratinated parmesan.",
        ),
        prices: single(74),
      }),
      dish({
        id: "penne-arrabbiata",
        name: l("Penne all'Arrabbiata", "Penne all'Arrabbiata"),
        description: l(
          "Penne com molho de tomate, alho e pimenta calabresa. Para quem gosta de ardência.",
          "Penne in a tomato, garlic and chilli sauce. For those who like the heat.",
        ),
        prices: single(58),
        tags: ["vegan", "spicy"],
      }),
    ],
  },
  {
    id: "secondi",
    name: l("Pratos Principais", "Main Courses"),
    subtitle: l("Secondi · carnes e peixes", "Secondi · meat and fish"),
    isActive: true,
    dishes: [
      dish({
        id: "ossobuco-milanese",
        name: l("Ossobuco alla Milanese", "Ossobuco alla Milanese"),
        description: l(
          "Ossobuco de vitela braseado com gremolata, servido com risoto de açafrão.",
          "Braised veal shank with gremolata, served with saffron risotto.",
        ),
        prices: single(118),
      }),
      dish({
        id: "filetto-gorgonzola",
        name: l("Filetto al Gorgonzola", "Filetto al Gorgonzola"),
        description: l(
          "Medalhão de filé-mignon ao molho de gorgonzola, com purê de batatas e legumes salteados.",
          "Beef tenderloin medallion in gorgonzola sauce, with mashed potatoes and sautéed vegetables.",
        ),
        prices: single(112),
        tags: ["gluten_free"],
      }),
      dish({
        id: "salmone-limone",
        name: l("Salmone al Limone", "Salmone al Limone"),
        description: l(
          "Salmão grelhado com molho de limão-siciliano, aspargos, tomate assado e arroz de açafrão.",
          "Grilled salmon with lemon sauce, asparagus, roasted tomato and saffron rice.",
        ),
        prices: single(98),
        tags: ["gluten_free", "lactose_free"],
      }),
      dish({
        id: "pollo-parmigiana",
        name: l("Pollo alla Parmigiana", "Pollo alla Parmigiana"),
        description: l(
          "Filé de frango empanado, molho de tomate e muçarela gratinada, com batatas fritas e salada verde.",
          "Breaded chicken breast, tomato sauce and melted mozzarella, with fries and green salad.",
        ),
        prices: single(79),
      }),
    ],
  },
  {
    id: "pizze",
    name: l("Pizzas", "Pizzas"),
    subtitle: l("Pizze · massa de longa fermentação, forno a lenha", "Pizze · long-fermented dough, wood-fired"),
    isActive: true,
    dishes: [
      dish({
        id: "pizza-margherita",
        name: l("Margherita", "Margherita"),
        description: l(
          "Molho de tomate San Marzano, muçarela fior di latte, manjericão e azeite.",
          "San Marzano tomato sauce, fior di latte mozzarella, basil and olive oil.",
        ),
        prices: sizes(["Broto", "Small", 42], ["Grande", "Large", 64]),
        tags: ["vegetarian"],
      }),
      dish({
        id: "pizza-diavola",
        name: l("Diavola", "Diavola"),
        description: l(
          "Molho de tomate, muçarela e salame picante calabrês.",
          "Tomato sauce, mozzarella and spicy Calabrian salami.",
        ),
        prices: sizes(["Broto", "Small", 48], ["Grande", "Large", 72]),
        tags: ["spicy"],
      }),
      dish({
        id: "pizza-quattro-formaggi",
        name: l("Quattro Formaggi", "Quattro Formaggi"),
        description: l(
          "Muçarela, gorgonzola, parmesão e provolone defumado.",
          "Mozzarella, gorgonzola, parmesan and smoked provolone.",
        ),
        prices: sizes(["Broto", "Small", 50], ["Grande", "Large", 76]),
        tags: ["vegetarian"],
      }),
      dish({
        id: "pizza-parma-rucola",
        name: l("Parma e Rucola", "Parma e Rucola"),
        description: l(
          "Muçarela, presunto de Parma, rúcula fresca e lascas de parmesão.",
          "Mozzarella, Parma ham, fresh arugula and shaved parmesan.",
        ),
        prices: sizes(["Broto", "Small", 54], ["Grande", "Large", 82]),
        highlight: "new",
      }),
    ],
  },
  {
    id: "dolci",
    name: l("Sobremesas", "Desserts"),
    subtitle: l("Dolci", "Dolci"),
    isActive: true,
    dishes: [
      dish({
        id: "tiramisu",
        name: l("Tiramisù", "Tiramisù"),
        description: l(
          "Biscoitos savoiardi embebidos em café, creme de mascarpone e cacau.",
          "Coffee-soaked savoiardi, mascarpone cream and cocoa.",
        ),
        prices: single(36),
        tags: ["vegetarian"],
        highlight: "best_seller",
      }),
      dish({
        id: "panna-cotta",
        name: l("Panna Cotta ai Frutti Rossi", "Panna Cotta ai Frutti Rossi"),
        description: l(
          "Creme de baunilha com frutas vermelhas frescas e calda de mel.",
          "Vanilla cream with fresh berries and honey syrup.",
        ),
        prices: single(32),
        tags: ["vegetarian", "gluten_free"],
      }),
      dish({
        id: "cannoli",
        name: l("Cannoli Siciliani", "Cannoli Siciliani"),
        description: l(
          "Massa crocante recheada com ricota doce, pistache e cereja cristalizada.",
          "Crisp pastry shells filled with sweet ricotta, pistachio and candied cherry.",
        ),
        prices: single(34),
        tags: ["vegetarian"],
      }),
      dish({
        id: "affogato",
        name: l("Affogato al Caffè", "Affogato al Caffè"),
        description: l(
          "Sorvete de creme \"afogado\" em uma dose de espresso quente.",
          "Vanilla gelato \"drowned\" in a shot of hot espresso.",
        ),
        prices: single(26),
        tags: ["vegetarian", "gluten_free"],
      }),
    ],
  },
  {
    id: "bevande",
    name: l("Bebidas", "Drinks"),
    subtitle: l("Bevande · vinhos, drinks e cafés", "Bevande · wine, drinks and coffee"),
    isActive: true,
    dishes: [
      dish({
        id: "chianti-classico",
        name: l("Chianti Classico DOCG", "Chianti Classico DOCG"),
        description: l(
          "Tinto toscano de Sangiovese, com notas de cereja e especiarias. Acompanha bem massas com ragù.",
          "Tuscan Sangiovese red with notes of cherry and spice. A natural match for ragù pastas.",
        ),
        prices: sizes(["Taça", "Glass", 38], ["Garrafa", "Bottle", 180]),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "prosecco",
        name: l("Prosecco DOC", "Prosecco DOC"),
        description: l(
          "Espumante do Vêneto, leve e frutado.",
          "Light, fruity sparkling wine from Veneto.",
        ),
        prices: sizes(["Taça", "Glass", 32], ["Garrafa", "Bottle", 140]),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "aperol-spritz",
        name: l("Aperol Spritz", "Aperol Spritz"),
        description: l(
          "Aperol, prosecco, água com gás e uma fatia de laranja.",
          "Aperol, prosecco, soda water and an orange slice.",
        ),
        prices: single(42),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "limonata-casa",
        name: l("Limonata della Casa", "Limonata della Casa"),
        description: l(
          "Limonada siciliana feita na hora, com hortelã.",
          "Freshly made Sicilian lemonade with mint.",
        ),
        prices: single(16),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "acqua-minerale",
        name: l("Acqua Minerale", "Acqua Minerale"),
        description: l("Água mineral com ou sem gás, 500 ml.", "Still or sparkling mineral water, 500 ml."),
        prices: single(8),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "espresso",
        name: l("Espresso", "Espresso"),
        description: l("Café espresso de torra italiana.", "Italian-roast espresso."),
        prices: single(9),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "cappuccino",
        name: l("Cappuccino", "Cappuccino"),
        description: l(
          "Espresso com leite vaporizado e espuma cremosa.",
          "Espresso with steamed milk and velvety foam.",
        ),
        prices: single(14),
        tags: ["vegetarian", "gluten_free"],
      }),
    ],
  },
];

export const sampleMenu: Menu = {
  restaurant: {
    name: "Osteria Lume",
    tagline: l("Cucina italiana, con calma.", "Italian cooking, unhurried."),
    about: l(
      "Massas frescas feitas todas as manhãs, pizzas de fermentação lenta e uma carta de vinhos italianos. Sem pressa.",
      "Fresh pasta made every morning, slow-fermented pizza and an Italian wine list. No rush.",
    ),
    address: "Rua das Oliveiras, 120 · Vila Madalena, São Paulo – SP",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vila+Madalena+S%C3%A3o+Paulo",
    phone: "+55 11 3000-0000",
    whatsapp: "+55 11 90000-0000",
    instagram: "osterialume",
    openingHours: {
      0: [["12:00", "17:00"]],
      1: [["11:30", "15:00"], ["18:30", "23:00"]],
      2: [["11:30", "15:00"], ["18:30", "23:00"]],
      3: [["11:30", "15:00"], ["18:30", "23:00"]],
      4: [["11:30", "15:00"], ["18:30", "23:00"]],
      5: [["11:30", "15:00"], ["18:30", "23:30"]],
      6: [["12:00", "16:00"], ["18:30", "23:30"]],
    },
  },
  categories,
};
