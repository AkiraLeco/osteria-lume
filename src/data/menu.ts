// Cardápio de exemplo da Osteria Lume (restaurante fictício): 80 pratos regionais italianos,
// organizados por tipo de prato, mais o almoço executivo e as bebidas.
// Serve de fonte de dados enquanto o Supabase não está configurado e, depois, de seed do banco.
//
// Selos: valem para a versão servida aqui. Quando a receita tradicional varia (ex.: com ou sem
// anchova), a descrição diz qual versão é a da casa e o selo só entra se valer para ela.
// "Vegano" já implica vegetariano e sem lactose (ver `hasTag` em components/menu-browser.tsx).

import type { Availability, Category, DietaryTag, Dish, Highlight, Localized, Menu, Price } from "@/lib/types";

const l = (pt: string, en: string): Localized => ({ pt, en });

/** Nome italiano, igual nos dois idiomas. */
const it = (name: string) => l(name, name);

/** Preço único em reais. */
const single = (reais: number): Price[] => [{ cents: reais * 100 }];

/** Preços por tamanho, ex.: sizes(["Taça", "Glass", 32], ["Garrafa", "Bottle", 140]). */
const sizes = (...entries: [string, string, number][]): Price[] =>
  entries.map(([pt, en, reais]) => ({ label: l(pt, en), cents: reais * 100 }));

const pizzaSizes = (small: number, large: number) => sizes(["Broto", "Small", small], ["Grande", "Large", large]);

const R = {
  valdaosta: l("Valle d'Aosta", "Aosta Valley"),
  piemonte: l("Piemonte", "Piedmont"),
  liguria: l("Ligúria", "Liguria"),
  lombardia: l("Lombardia", "Lombardy"),
  trentino: l("Trentino-Alto Ádige", "Trentino-South Tyrol"),
  veneto: l("Vêneto", "Veneto"),
  emilia: l("Emilia-Romagna", "Emilia-Romagna"),
  marche: l("Marche", "Marche"),
  toscana: l("Toscana", "Tuscany"),
  umbria: l("Úmbria", "Umbria"),
  lazio: l("Lazio", "Lazio"),
  campania: l("Campania", "Campania"),
  puglia: l("Puglia", "Apulia"),
  basilicata: l("Basilicata", "Basilicata"),
  calabria: l("Calabria", "Calabria"),
  sicilia: l("Sicília", "Sicily"),
  sardegna: l("Sardenha", "Sardinia"),
  venetoFriuli: l("Vêneto e Friuli", "Veneto and Friuli"),
};

type DishInput = {
  id: string;
  name: Localized;
  description: Localized;
  region?: Localized;
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
        id: "bagna-cauda",
        name: it("Bagna Càuda"),
        region: R.piemonte,
        description: l(
          "Molho quente de alho, anchova e azeite, servido no réchaud com legumes crus e cozidos para mergulhar.",
          "Warm dip of garlic, anchovy and olive oil, served over a burner with raw and cooked vegetables for dipping.",
        ),
        prices: single(48),
        tags: ["gluten_free", "lactose_free"],
      }),
      dish({
        id: "vitello-tonnato",
        name: it("Vitello Tonnato"),
        region: R.piemonte,
        description: l(
          "Lâminas de vitela cozida com molho cremoso de atum, anchova, alcaparras e gema.",
          "Thin slices of poached veal with a creamy sauce of tuna, anchovy, capers and egg yolk.",
        ),
        prices: single(64),
        tags: ["gluten_free", "lactose_free"],
        highlight: "chef_suggestion",
      }),
      dish({
        id: "farinata-ceci",
        name: it("Farinata di Ceci"),
        region: R.liguria,
        description: l(
          "Torta fina de farinha de grão-de-bico, água, azeite e sal, assada até dourar.",
          "Thin chickpea-flour flatbread with water, olive oil and salt, baked until golden.",
        ),
        prices: single(32),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "sarde-in-saor",
        name: it("Sarde in Saor"),
        region: R.veneto,
        description: l(
          "Sardinhas enfarinhadas e fritas, marinadas com cebola, vinagre, uvas-passas e pinoli.",
          "Floured, fried sardines marinated with onion, vinegar, raisins and pine nuts.",
        ),
        prices: single(52),
        tags: ["lactose_free"],
      }),
      dish({
        id: "gnocco-fritto",
        name: it("Gnocco Fritto"),
        region: R.emilia,
        description: l(
          "Massa de trigo frita, leve e estufada, servida com embutidos e queijos da Emilia.",
          "Puffy fried wheat dough, served with Emilian cured meats and cheeses.",
        ),
        prices: single(58),
      }),
      dish({
        id: "olive-ascolana",
        name: it("Olive all'Ascolana"),
        region: R.marche,
        description: l(
          "Azeitonas verdes recheadas com carne, empanadas e fritas.",
          "Green olives stuffed with meat, breaded and fried.",
        ),
        prices: single(42),
      }),
      dish({
        id: "panzanella",
        name: it("Panzanella"),
        region: R.toscana,
        description: l(
          "Salada de pão toscano amanhecido, tomate, cebola roxa, manjericão, azeite e vinagre.",
          "Salad of day-old Tuscan bread, tomato, red onion, basil, olive oil and vinegar.",
        ),
        prices: single(44),
        tags: ["vegan"],
      }),
      dish({
        id: "carciofi-romana",
        name: it("Carciofi alla Romana"),
        region: R.lazio,
        description: l(
          "Alcachofras recheadas com alho, salsinha e mentuccia, cozidas lentamente no azeite.",
          "Artichokes stuffed with garlic, parsley and wild mint, slowly braised in olive oil.",
        ),
        prices: single(46),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "carciofi-giudia",
        name: it("Carciofi alla Giudia"),
        region: R.lazio,
        description: l(
          "Alcachofra aberta como uma flor e frita até ficar crocante, clássico judaico-romano.",
          "Artichoke opened like a flower and fried until crisp, a Roman-Jewish classic.",
        ),
        prices: single(48),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "suppli",
        name: it("Supplì al Telefono"),
        region: R.lazio,
        description: l(
          "Croquete de arroz ao molho de tomate com coração de muçarela que \"estica como fio de telefone\".",
          "Rice croquette in tomato sauce with a mozzarella heart that stretches like a telephone cord.",
        ),
        prices: single(36),
        tags: ["vegetarian"],
      }),
      dish({
        id: "frittata-pasta",
        name: it("Frittata di Pasta"),
        region: R.campania,
        description: l(
          "Massa cozida misturada com ovos e queijo, dourada na frigideira. Aproveitamento napolitano.",
          "Cooked pasta bound with eggs and cheese, browned in the pan. A Neapolitan home classic.",
        ),
        prices: single(38),
        tags: ["vegetarian"],
      }),
      dish({
        id: "fave-cicoria",
        image: false,
        name: it("Fave e Cicoria"),
        region: R.puglia,
        description: l(
          "Purê rústico de favas secas com chicória amarga refogada, azeite e sal.",
          "Rustic purée of dried fava beans with sautéed bitter chicory, olive oil and salt.",
        ),
        prices: single(42),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "pane-pomodoro",
        name: it("Pane e Pomodoro"),
        region: R.basilicata,
        description: l(
          "Pão rústico com tomate fresco, azeite, sal e orégano. Simples como no campo.",
          "Rustic bread with fresh tomato, olive oil, salt and oregano. Simple, country-style.",
        ),
        prices: single(28),
        tags: ["vegan"],
      }),
      dish({
        id: "arancini",
        name: it("Arancini"),
        region: R.sicilia,
        description: l(
          "Bolinhos de arroz com açafrão, recheados de ragù de carne e ervilhas, empanados e fritos.",
          "Saffron rice balls filled with meat ragù and peas, breaded and fried.",
        ),
        prices: single(38),
      }),
      dish({
        id: "panelle",
        name: it("Panelle"),
        region: R.sicilia,
        description: l(
          "Lâminas fritas de massa de grão-de-bico com salsinha, petisco de rua de Palermo.",
          "Fried chickpea-flour fritters with parsley, Palermo street food.",
        ),
        prices: single(32),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "erbazzone",
        name: it("Erbazzone"),
        region: R.emilia,
        description: l(
          "Torta salgada de acelga e espinafre com Parmigiano Reggiano e pancetta, em massa fina.",
          "Savory pie of chard and spinach with Parmigiano Reggiano and pancetta, in thin pastry.",
        ),
        prices: single(40),
      }),
    ],
  },
  {
    id: "zuppe",
    name: l("Sopas", "Soups"),
    subtitle: l("Zuppe e minestre", "Zuppe e minestre"),
    isActive: true,
    dishes: [
      dish({
        id: "tortellini-brodo",
        name: it("Tortellini in Brodo"),
        region: R.emilia,
        description: l(
          "Tortellini recheados de carnes e Parmigiano, servidos em caldo de carne.",
          "Tortellini filled with meats and Parmigiano, served in meat broth.",
        ),
        prices: single(68),
      }),
      dish({
        id: "cappelletti-brodo",
        name: it("Cappelletti in Brodo"),
        region: R.emilia,
        description: l(
          "Massa recheada em forma de chapeuzinho, servida em caldo de carne.",
          "Little hat-shaped filled pasta, served in meat broth.",
        ),
        prices: single(64),
      }),
      dish({
        id: "ribollita",
        name: it("Ribollita"),
        region: R.toscana,
        description: l(
          "Sopa espessa de feijão, couve-negra e legumes com pão toscano, \"refervida\" no dia seguinte.",
          "Thick soup of beans, cavolo nero and vegetables with Tuscan bread, reboiled the next day.",
        ),
        prices: single(48),
        tags: ["vegan"],
      }),
      dish({
        id: "pappa-pomodoro",
        name: it("Pappa al Pomodoro"),
        region: R.toscana,
        description: l(
          "Papa rústica de pão, tomate, alho, manjericão e azeite.",
          "Rustic bread and tomato porridge with garlic, basil and olive oil.",
        ),
        prices: single(44),
        tags: ["vegan"],
      }),
      dish({
        id: "acquacotta",
        name: it("Acquacotta"),
        region: R.toscana,
        description: l(
          "Sopa camponesa da Maremma: legumes, pão tostado, ovo pochê e pecorino.",
          "Maremma peasant soup: vegetables, toasted bread, poached egg and pecorino.",
        ),
        prices: single(46),
        tags: ["vegetarian"],
      }),
      dish({
        id: "pappa-cavolo-nero",
        name: it("Pappa al Cavolo Nero"),
        region: R.toscana,
        description: l(
          "Papa de pão com couve-negra, legumes, alho e azeite novo.",
          "Bread porridge with cavolo nero, vegetables, garlic and new olive oil.",
        ),
        prices: single(46),
        tags: ["vegan"],
      }),
      dish({
        id: "pasta-fagioli",
        name: it("Pasta e Fagioli"),
        region: R.campania,
        description: l(
          "Massa curta com feijão, tomate e aromáticos, finalizada com azeite. Versão da casa, sem carne suína.",
          "Short pasta with beans, tomato and aromatics, finished with olive oil. House version, without pork.",
        ),
        prices: single(48),
        tags: ["vegan"],
      }),
      dish({
        id: "pasta-patate",
        name: it("Pasta e Patate"),
        region: R.campania,
        description: l(
          "Massa cozida com batata e sofrito até ficar cremosa, com provola derretida.",
          "Pasta cooked with potato and soffritto until creamy, with melted provola.",
        ),
        prices: single(52),
        tags: ["vegetarian"],
      }),
      dish({
        id: "pasta-tenerumi",
        image: false,
        name: it("Pasta con i Tenerumi"),
        region: R.sicilia,
        description: l(
          "Sopa de massa com folhas e brotos tenros de abobrinha, tomate, alho e azeite.",
          "Pasta soup with tender zucchini leaves and shoots, tomato, garlic and olive oil.",
        ),
        prices: single(48),
        tags: ["vegetarian", "lactose_free"],
      }),
      dish({
        id: "risi-bisi",
        name: it("Risi e Bisi"),
        region: R.veneto,
        description: l(
          "Arroz com ervilhas frescas em caldo de legumes, finalizado com manteiga e Parmigiano.",
          "Rice with fresh peas in vegetable broth, finished with butter and Parmigiano.",
        ),
        prices: single(58),
        tags: ["vegetarian"],
      }),
      dish({
        id: "canederli",
        name: it("Canederli in Brodo"),
        region: R.trentino,
        description: l(
          "Bolinhos de pão com leite, ovos e speck, servidos em caldo de carne.",
          "Bread dumplings with milk, eggs and speck, served in meat broth.",
        ),
        prices: single(56),
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
        id: "agnolotti-plin",
        name: it("Agnolotti del Plin"),
        region: R.piemonte,
        description: l(
          "Pequenos agnolotti \"beliscados\" à mão, recheados de carnes assadas, com molho do assado.",
          "Tiny hand-pinched agnolotti filled with roast meats, served with the roasting juices.",
        ),
        prices: single(84),
      }),
      dish({
        id: "tajarin-ragu",
        name: it("Tajarin al Ragù"),
        region: R.piemonte,
        description: l(
          "Massa fina de gemas, típica do Piemonte, com ragù de carne.",
          "Fine egg-yolk pasta from Piedmont with meat ragù.",
        ),
        prices: single(78),
      }),
      dish({
        id: "trenette-pesto",
        name: it("Trenette al Pesto Genovese"),
        region: R.liguria,
        description: l(
          "Trenette com pesto de manjericão, pinoli, alho, Parmigiano, pecorino e azeite extravirgem.",
          "Trenette with pesto of basil, pine nuts, garlic, Parmigiano, pecorino and extra virgin olive oil.",
        ),
        prices: single(66),
        tags: ["vegetarian"],
      }),
      dish({
        id: "trofie-pesto",
        name: it("Trofie al Pesto"),
        region: R.liguria,
        description: l(
          "Trofie com pesto genovês, batata e vagem, como na Ligúria.",
          "Trofie with Genoese pesto, potato and green beans, the Ligurian way.",
        ),
        prices: single(68),
        tags: ["vegetarian"],
      }),
      dish({
        id: "risotto-milanese",
        name: it("Risotto alla Milanese"),
        region: R.lombardia,
        description: l(
          "Risoto de açafrão com tutano e caldo de carne, finalizado com manteiga e Grana Padano.",
          "Saffron risotto with bone marrow and meat broth, finished with butter and Grana Padano.",
        ),
        prices: single(78),
      }),
      dish({
        id: "pizzoccheri",
        name: it("Pizzoccheri della Valtellina"),
        region: R.lombardia,
        description: l(
          "Massa de trigo-sarraceno e trigo com batata, couve, queijo Casera e manteiga com sálvia.",
          "Buckwheat and wheat pasta with potato, cabbage, Casera cheese and sage butter.",
        ),
        prices: single(72),
        tags: ["vegetarian"],
      }),
      dish({
        id: "bigoli-salsa",
        name: it("Bigoli in Salsa"),
        region: R.veneto,
        description: l(
          "Massa grossa de trigo com molho de cebola cozida lentamente e anchova.",
          "Thick wheat pasta with a sauce of slow-cooked onion and anchovy.",
        ),
        prices: single(64),
        tags: ["lactose_free"],
      }),
      dish({
        id: "tagliatelle-ragu",
        name: it("Tagliatelle al Ragù alla Bolognese"),
        region: R.emilia,
        description: l(
          "Tagliatelle frescas com ragù de carne cozido lentamente, como em Bolonha.",
          "Fresh tagliatelle with slow-cooked meat ragù, the Bologna way.",
        ),
        prices: single(76),
      }),
      dish({
        id: "lasagne-verdi",
        name: it("Lasagne Verdi alla Bolognese"),
        region: R.emilia,
        description: l(
          "Camadas de massa verde de espinafre, ragù de carne, bechamel e Parmigiano Reggiano.",
          "Layers of green spinach pasta, meat ragù, béchamel and Parmigiano Reggiano.",
        ),
        prices: single(82),
      }),
      dish({
        id: "vincisgrassi",
        name: it("Vincisgrassi"),
        region: R.marche,
        description: l(
          "Lasanha das Marche com ragù de carnes e miúdos, bechamel e um toque de noz-moscada.",
          "Marche-style lasagna with meat and giblet ragù, béchamel and a hint of nutmeg.",
        ),
        prices: single(86),
      }),
      dish({
        id: "pici-aglione",
        name: it("Pici all'Aglione"),
        region: R.toscana,
        description: l(
          "Pici, massa grossa enrolada à mão, com molho de tomate e aglione, o alho gigante e suave da Val di Chiana.",
          "Hand-rolled thick pici with tomato sauce and aglione, the mild giant garlic of Val di Chiana.",
        ),
        prices: single(62),
        tags: ["vegan"],
      }),
      dish({
        id: "strangozzi-tartufo",
        name: it("Strangozzi al Tartufo"),
        region: R.umbria,
        description: l(
          "Massa longa artesanal com trufa negra da Úmbria, alho e azeite extravirgem.",
          "Handmade long pasta with Umbrian black truffle, garlic and extra virgin olive oil.",
        ),
        prices: single(118),
        tags: ["vegan"],
      }),
      dish({
        id: "spaghetti-carbonara",
        name: it("Spaghetti alla Carbonara"),
        region: R.lazio,
        description: l(
          "Guanciale crocante, gema, Pecorino Romano e pimenta-do-reino. Sem creme de leite, como em Roma.",
          "Crispy guanciale, egg yolk, Pecorino Romano and black pepper. No cream, as in Rome.",
        ),
        prices: single(72),
        highlight: "best_seller",
      }),
      dish({
        id: "amatriciana",
        name: it("Bucatini all'Amatriciana"),
        region: R.lazio,
        description: l(
          "Bucatini com guanciale, tomate, Pecorino Romano e peperoncino.",
          "Bucatini with guanciale, tomato, Pecorino Romano and chilli.",
        ),
        prices: single(72),
        tags: ["spicy"],
      }),
      dish({
        id: "cacio-pepe",
        name: it("Cacio e Pepe"),
        region: R.lazio,
        description: l(
          "Tonnarelli com Pecorino Romano e pimenta-do-reino, emulsionados na água do cozimento.",
          "Tonnarelli with Pecorino Romano and black pepper, emulsified with the pasta water.",
        ),
        prices: single(64),
        tags: ["vegetarian"],
      }),
      dish({
        id: "gricia",
        name: it("Pasta alla Gricia"),
        region: R.lazio,
        description: l(
          "Rigatoni com guanciale, Pecorino Romano e pimenta-do-reino. A \"amatriciana sem tomate\".",
          "Rigatoni with guanciale, Pecorino Romano and black pepper. Amatriciana's tomato-free ancestor.",
        ),
        prices: single(68),
      }),
      dish({
        id: "spaghetti-vongole",
        name: it("Spaghetti alle Vongole"),
        region: R.campania,
        description: l(
          "Espaguete com vôngoles, alho, azeite, vinho branco e salsinha, \"in bianco\".",
          "Spaghetti with clams, garlic, olive oil, white wine and parsley, in bianco.",
        ),
        prices: single(92),
        tags: ["lactose_free"],
      }),
      dish({
        id: "gnocchi-sorrentina",
        name: it("Gnocchi alla Sorrentina"),
        region: R.campania,
        description: l(
          "Nhoque de batata com tomate, muçarela e manjericão, gratinado no forno.",
          "Potato gnocchi with tomato, mozzarella and basil, baked until bubbling.",
        ),
        prices: single(66),
        tags: ["vegetarian"],
      }),
      dish({
        id: "orecchiette-cime-rapa",
        name: it("Orecchiette con Cime di Rapa"),
        region: R.puglia,
        description: l(
          "Orecchiette com brotos de nabo, alho, anchova e peperoncino, sem queijo.",
          "Orecchiette with turnip tops, garlic, anchovy and chilli, no cheese.",
        ),
        prices: single(68),
        tags: ["lactose_free", "spicy"],
      }),
      dish({
        id: "ciceri-tria",
        name: it("Ciceri e Tria"),
        region: R.puglia,
        description: l(
          "Massa artesanal com grão-de-bico; parte da massa é frita e fica crocante por cima.",
          "Handmade pasta with chickpeas; some of the pasta is fried for a crunchy topping.",
        ),
        prices: single(62),
        tags: ["vegan"],
      }),
      dish({
        id: "pasta-muddica",
        name: it("Pasta ca' Muddica e Alici"),
        region: R.calabria,
        description: l(
          "Massa com anchova, farinha de rosca tostada, alho, azeite e peperoncino.",
          "Pasta with anchovies, toasted breadcrumbs, garlic, olive oil and chilli.",
        ),
        prices: single(64),
        tags: ["lactose_free", "spicy"],
      }),
      dish({
        id: "fileja-nduja",
        name: it("Fileja alla 'Nduja"),
        region: R.calabria,
        description: l(
          "Fileja, massa enrolada em vareta, com tomate e 'nduja, embutido de porco cremoso e bem picante.",
          "Rod-rolled fileja pasta with tomato and 'nduja, a soft and fiery Calabrian pork salume.",
        ),
        prices: single(76),
        tags: ["spicy"],
        highlight: "new",
      }),
      dish({
        id: "pasta-norma",
        name: it("Pasta alla Norma"),
        region: R.sicilia,
        description: l(
          "Massa com tomate, berinjela frita, manjericão e ricota salgada ralada.",
          "Pasta with tomato, fried aubergine, basil and grated ricotta salata.",
        ),
        prices: single(66),
        tags: ["vegetarian"],
      }),
      dish({
        id: "pasta-sarde",
        name: it("Pasta con le Sarde"),
        region: R.sicilia,
        description: l(
          "Massa com sardinha, funcho selvagem, uvas-passas, pinoli, açafrão e farinha de rosca.",
          "Pasta with sardines, wild fennel, raisins, pine nuts, saffron and breadcrumbs.",
        ),
        prices: single(78),
        tags: ["lactose_free"],
      }),
      dish({
        id: "culurgiones",
        name: it("Culurgiones"),
        region: R.sardegna,
        description: l(
          "Massa recheada em forma de espiga, com batata, pecorino e hortelã, ao molho de tomate.",
          "Wheat-ear shaped filled pasta with potato, pecorino and mint, in tomato sauce.",
        ),
        prices: single(74),
        tags: ["vegetarian"],
      }),
      dish({
        id: "malloreddus",
        name: it("Malloreddus alla Campidanese"),
        region: R.sardegna,
        description: l(
          "Pequena massa de sêmola com molho de linguiça, tomate, açafrão e pecorino.",
          "Small semolina pasta with sausage, tomato, saffron and pecorino sauce.",
        ),
        prices: single(72),
      }),
      dish({
        id: "fregula-arselle",
        image: false,
        name: it("Fregula con Arselle"),
        region: R.sardegna,
        description: l(
          "Esferas de sêmola tostada cozidas com vôngoles, alho, tomate e ervas.",
          "Toasted semolina pearls cooked with clams, garlic, tomato and herbs.",
        ),
        prices: single(88),
        tags: ["lactose_free"],
        highlight: "new",
      }),
    ],
  },
  {
    id: "secondi",
    name: l("Pratos Principais", "Main Courses"),
    subtitle: l("Secondi · carnes, peixes e clássicos", "Secondi · meat, fish and classics"),
    isActive: true,
    dishes: [
      dish({
        id: "carbonade",
        name: it("Carbonade Valdostana"),
        region: R.valdaosta,
        description: l(
          "Carne bovina cozida lentamente com vinho tinto, cebola e especiarias, servida com polenta.",
          "Beef slowly braised in red wine with onion and spices, served with polenta.",
        ),
        prices: single(108),
      }),
      dish({
        id: "ossobuco-milanese",
        name: it("Ossobuco alla Milanese"),
        region: R.lombardia,
        description: l(
          "Ossobuco de vitela braseado com gremolata, servido com risoto de açafrão.",
          "Braised veal shank with gremolata, served with saffron risotto.",
        ),
        prices: single(118),
        highlight: "chef_suggestion",
      }),
      dish({
        id: "cotoletta-milanese",
        name: it("Cotoletta alla Milanese"),
        region: R.lombardia,
        description: l(
          "Costeleta de vitela com osso, empanada e dourada na manteiga clarificada.",
          "Bone-in veal cutlet, breaded and browned in clarified butter.",
        ),
        prices: single(112),
      }),
      dish({
        id: "baccala-vicentina",
        name: it("Baccalà alla Vicentina"),
        region: R.veneto,
        description: l(
          "Bacalhau enfarinhado e cozido lentamente com leite, cebola, anchova e azeite, com polenta.",
          "Floured salt cod slowly cooked with milk, onion, anchovy and olive oil, with polenta.",
        ),
        prices: single(104),
      }),
      dish({
        id: "fegato-veneziana",
        name: it("Fegato alla Veneziana"),
        region: R.veneto,
        description: l(
          "Fígado de vitela com muita cebola cozida na manteiga e no azeite, servido com polenta.",
          "Calf's liver with plenty of onion cooked in butter and olive oil, served with polenta.",
        ),
        prices: single(84),
      }),
      dish({
        id: "polenta-ragu",
        name: it("Polenta con Ragù alla Bolognese"),
        region: R.emilia,
        description: l(
          "Polenta cremosa coberta com o ragù bolonhês da casa: carne, sofrito, pouco tomate e leite.",
          "Creamy polenta topped with the house Bolognese ragù: meat, soffritto, a little tomato and milk.",
        ),
        prices: single(74),
      }),
      dish({
        id: "saltimbocca",
        name: it("Saltimbocca alla Romana"),
        region: R.lazio,
        description: l(
          "Escalopes de vitela com presunto cru e sálvia, selados na manteiga e finalizados com vinho branco.",
          "Veal escalopes with prosciutto and sage, seared in butter and finished with white wine.",
        ),
        prices: single(98),
      }),
      dish({
        id: "parmigiana-melanzane",
        name: it("Parmigiana di Melanzane"),
        region: R.campania,
        description: l(
          "Camadas de berinjela frita, molho de tomate, muçarela, Parmigiano e manjericão, assadas.",
          "Layers of fried aubergine, tomato sauce, mozzarella, Parmigiano and basil, baked.",
        ),
        prices: single(68),
        tags: ["vegetarian"],
      }),
      dish({
        id: "parmigiana-calabrese",
        name: it("Parmigiana Calabrese"),
        region: R.calabria,
        description: l(
          "Berinjela em camadas com tomate, ovo cozido, caciocavallo e peperoncino.",
          "Layered aubergine with tomato, boiled egg, caciocavallo cheese and chilli.",
        ),
        prices: single(72),
        tags: ["vegetarian", "spicy"],
      }),
      dish({
        id: "tiella-barese",
        name: it("Tiella Barese"),
        region: R.puglia,
        description: l(
          "Camadas de arroz, batata e mexilhões com tomate, cebola, pecorino e azeite, assadas.",
          "Baked layers of rice, potato and mussels with tomato, onion, pecorino and olive oil.",
        ),
        prices: single(94),
        tags: ["gluten_free"],
      }),
      dish({
        id: "involtini-pesce-spada",
        image: false,
        name: it("Involtini di Pesce Spada"),
        region: R.sicilia,
        description: l(
          "Rolinhos de peixe-espada recheados com farinha de rosca, pinoli, passas, ervas e pecorino, grelhados.",
          "Swordfish rolls stuffed with breadcrumbs, pine nuts, raisins, herbs and pecorino, grilled.",
        ),
        prices: single(102),
      }),
      dish({
        id: "polenta-taragna",
        name: it("Polenta Taragna"),
        region: R.lombardia,
        description: l(
          "Polenta de milho e trigo-sarraceno com queijo de montanha derretido e manteiga.",
          "Corn and buckwheat polenta with melted mountain cheese and butter.",
        ),
        prices: single(62),
        tags: ["vegetarian"],
      }),
    ],
  },
  {
    id: "contorni",
    name: l("Acompanhamentos", "Sides"),
    subtitle: l("Contorni", "Contorni"),
    isActive: true,
    dishes: [
      dish({
        id: "fagioli-uccelletto",
        name: it("Fagioli all'Uccelletto"),
        region: R.toscana,
        description: l(
          "Feijão branco cozido com tomate, alho e sálvia, finalizado com azeite.",
          "White beans stewed with tomato, garlic and sage, finished with olive oil.",
        ),
        prices: single(32),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "peperoni-cruschi",
        name: it("Peperoni Cruschi"),
        region: R.basilicata,
        description: l(
          "Pimentões doces secos de Senise, fritos por segundos até ficarem crocantes.",
          "Dried sweet Senise peppers, flash-fried until crisp.",
        ),
        prices: single(28),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "pipi-patate",
        name: it("Pipi e Patate"),
        region: R.calabria,
        description: l(
          "Pimentões e batatas salteados juntos no azeite, clássico caseiro calabrês.",
          "Peppers and potatoes pan-fried together in olive oil, a Calabrian home classic.",
        ),
        prices: single(30),
        tags: ["vegan", "gluten_free"],
      }),
      dish({
        id: "caponata",
        name: it("Caponata"),
        region: R.sicilia,
        description: l(
          "Berinjela e legumes com azeitona, alcaparras e molho agridoce de tomate, vinagre e açúcar.",
          "Aubergine and vegetables with olives, capers and a sweet-and-sour tomato, vinegar and sugar sauce.",
        ),
        prices: single(34),
        tags: ["vegan", "gluten_free"],
      }),
    ],
  },
  {
    id: "pizze",
    name: l("Pizzas e Pães", "Pizzas & Breads"),
    subtitle: l("Pizze e focacce · forno a lenha", "Pizze e focacce · wood-fired"),
    isActive: true,
    dishes: [
      dish({
        id: "pizza-margherita",
        name: it("Pizza Margherita"),
        region: R.campania,
        description: l(
          "Massa napolitana com tomate, muçarela, manjericão e azeite.",
          "Neapolitan dough with tomato, mozzarella, basil and olive oil.",
        ),
        prices: pizzaSizes(42, 64),
        tags: ["vegetarian"],
        highlight: "best_seller",
      }),
      dish({
        id: "pizza-marinara",
        name: it("Pizza Marinara"),
        region: R.campania,
        description: l(
          "Tomate, alho, orégano e azeite. Apesar do nome, não leva peixe nem queijo.",
          "Tomato, garlic, oregano and olive oil. Despite the name, no fish and no cheese.",
        ),
        prices: pizzaSizes(38, 58),
        tags: ["vegan"],
      }),
      dish({
        id: "pizza-diavola",
        name: it("Pizza Diavola"),
        region: R.campania,
        description: l(
          "Tomate, muçarela e salame picante.",
          "Tomato, mozzarella and spicy salami.",
        ),
        prices: pizzaSizes(48, 72),
        tags: ["spicy"],
      }),
      dish({
        id: "focaccia-genovese",
        name: it("Focaccia Genovese"),
        region: R.liguria,
        description: l(
          "Pão baixo e macio de trigo, azeite, água e sal grosso, com a superfície cheia de furinhos.",
          "Soft, low wheat bread with olive oil, water and coarse salt, its surface full of dimples.",
        ),
        prices: single(24),
        tags: ["vegan"],
      }),
      dish({
        id: "focaccia-barese",
        name: it("Focaccia Barese"),
        region: R.puglia,
        description: l(
          "Focaccia alta e macia com tomate-cereja, azeitonas, orégano e azeite.",
          "Tall, soft focaccia with cherry tomatoes, olives, oregano and olive oil.",
        ),
        prices: single(32),
        tags: ["vegan"],
      }),
      dish({
        id: "sfincione",
        name: it("Sfincione Palermitano"),
        region: R.sicilia,
        description: l(
          "Focaccia espessa de Palermo com tomate, cebola, anchova, caciocavallo e farinha de rosca.",
          "Thick Palermo focaccia with tomato, onion, anchovy, caciocavallo and breadcrumbs.",
        ),
        prices: single(38),
      }),
      dish({
        id: "crescia-sfogliata",
        name: it("Crescia Sfogliata"),
        region: R.marche,
        description: l(
          "Pão folhado de trigo, ovos e banha, dourado na chapa, típico de Urbino.",
          "Flaky flatbread of wheat, eggs and lard, cooked on the griddle, from Urbino.",
        ),
        prices: single(34),
      }),
      dish({
        id: "pane-carasau",
        name: it("Pane Carasau"),
        region: R.sardegna,
        description: l(
          "Pão sardo finíssimo e crocante de sêmola, servido com azeite e sal.",
          "Paper-thin, crisp Sardinian semolina bread, served with olive oil and salt.",
        ),
        prices: single(22),
        tags: ["vegan"],
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
        id: "panna-cotta",
        name: it("Panna Cotta"),
        region: R.piemonte,
        description: l(
          "Creme de leite com baunilha, frutas vermelhas frescas e calda de mel.",
          "Vanilla cream with fresh berries and honey syrup.",
        ),
        prices: single(32),
        tags: ["vegetarian", "gluten_free"],
      }),
      dish({
        id: "tiramisu",
        name: it("Tiramisù"),
        region: R.venetoFriuli,
        description: l(
          "Savoiardi embebidos em café, creme de mascarpone com ovos e cacau.",
          "Coffee-soaked savoiardi, mascarpone and egg cream, and cocoa.",
        ),
        prices: single(36),
        tags: ["vegetarian"],
        highlight: "best_seller",
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
      "Oitenta receitas de toda a Itália, do Piemonte à Sicília, com massas frescas feitas todas as manhãs. Sem pressa.",
      "Eighty recipes from across Italy, from Piedmont to Sicily, with fresh pasta made every morning. No rush.",
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
