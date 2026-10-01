// Baixa fotos com licença livre do Wikimedia Commons para o cardápio de exemplo
// e registra os créditos em src/data/image-credits.json.
//
// Uso: node scripts/fetch-images.mjs [slug ...]
//      node scripts/fetch-images.mjs --list [slug ...]   (só lista as opções, sem baixar)
// Para trocar a foto de um prato, ajuste a busca (ou fixe um arquivo com `file`) e rode só aquele slug.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "dishes");
const CREDITS_FILE = path.join(ROOT, "src", "data", "image-credits.json");
const UA = "OsteriaLumePortfolio/0.1 (portfolio project; image seeding script)";
const ALLOWED = /^(CC0|Public domain|CC BY(-SA)? [0-9.]+)$/i;

/** slug -> termo de busca (ou `file` para fixar um arquivo específico do Commons); `width` padrão: 1200px. */
const IMAGES = {
  hero: { file: "Pizza Napoletana Contemporanea.jpg", width: 2400 },
  "focaccia-genovese": { file: "Rosemary Focaccia.jpg" },
  "spaghetti-carbonara": { file: "Spaghetti alla Carbonara 3.jpg" },
  "tagliatelle-ragu": { file: "Tagliatelle al ragù.jpg" },
  "ossobuco-milanese": { file: "Ossobuco con risotto alla milanese.jpg" },
  "pizza-margherita": { file: "Tony's Napoletana Margherita Pizza (5991972038).jpg" },
  "pizza-diavola": { file: "Pepperoni pizza- boella co. 2024-02-17.jpg" },
  tiramisu: { file: "Dolce Tiramisù monoporzione.jpg" },
  "panna-cotta": { file: "Panna Cotta with fresh berries.jpg" },
  "chianti-classico": { file: "Bottle and glass of red wine.jpg" },
  prosecco: { file: "Waiter pouring Zardetto sparkling Prosecco.jpg" },
  "limonata-casa": { file: "Homemade Mint Lemonade,Bangladesh.jpg" },
  "acqua-minerale": { file: "Waiter serves water in a glass at a restaurant.jpg" },
  "aperol-spritz": { file: "Aperol Spritz - July 2024 - Sarah Stierch.jpg" },
  espresso: { file: "Espresso Coffee 01.jpg" },
  cappuccino: { file: "A cup of cappuccino.jpg" },
  "bagna-cauda": { file: "Bagna càuda dip.jpg" },
  "vitello-tonnato": { file: "Vitello tonnato (6977537544).jpg" },
  "farinata-ceci": { file: "Farinata di ceci 01.jpg" },
  "sarde-in-saor": { file: "Sarde in saòr.jpg" },
  "gnocco-fritto": { file: "Gnocco Fritto.jpg" },
  "olive-ascolana": { file: "Olive all'ascolana.jpg" },
  panzanella: { file: "Panzanella con pomodori a grappolo.jpg" },
  "carciofi-romana": { file: "Carciofi alla Romana.jpg" },
  "carciofi-giudia": { file: "Carciofi alla Giudìa.jpg" },
  suppli: { file: "Supplì al telefono.jpg" },
  "frittata-pasta": { file: "Frittata-di-spaghetti.jpg" },
  arancini: { file: "Arancini 002.jpg" },
  panelle: { file: "Pane e panelle.jpg" },
  erbazzone: { file: "Scarpasòun.jpg" },
  "tortellini-brodo": { file: "Tortellini in brodo Bologna.jpg" },
  "cappelletti-brodo": { file: "01 Cappelletti in brodo.jpg" },
  ribollita: { file: "Ribollita toscana.JPG" },
  "pappa-pomodoro": { file: "Pappa al pomodoro.jpg" },
  acquacotta: { file: "Acquacotta.jpg" },
  "pappa-cavolo-nero": { file: "Widowed lentils soup with carrot and cavolo nero (8424513624).jpg" },
  "pasta-fagioli": { file: "Pasta e fagioli cannellini.jpg" },
  "pasta-patate": { file: "Pasta Patate e Provola.jpg" },
  "risi-bisi": { file: "Risi e bisi.JPG" },
  canederli: { file: "Semmelknödel.jpg" },
  "agnolotti-plin": { file: "Agnolotti Kappa.jpg" },
  "trenette-pesto": { file: "Trenette al pesto con patate e fagiolini.jpg" },
  "trofie-pesto": { file: "Trofie al pesto .jpg" },
  "risotto-milanese": { file: "Risotto alla Milanese.JPG" },
  pizzoccheri: { file: "Esno4Wkmana jul 2014 Cassnam 059.jpg" },
  "bigoli-salsa": { file: "Bigoli-993426 960 720.jpg" },
  "lasagne-verdi": { file: "Lasagne verdi romagnole 2.jpg" },
  vincisgrassi: { file: "Vincisgrassi.jpg" },
  "pici-aglione": { file: "Pici all'aglione.jpg" },
  amatriciana: { file: "Bucatini amatriciana Roma 2019.jpg" },
  "cacio-pepe": { file: "Cacio e pepe.jpg" },
  gricia: { file: "Rigatoni Alla Gricia 5.jpg" },
  "spaghetti-vongole": { file: "Vermicelli alle vongole lupino.jpg" },
  "gnocchi-sorrentina": { file: "Gnocchi alla sorrentina.jpg" },
  "orecchiette-cime-rapa": { file: "Orecchiette broccoli e salsiccia.jpg" },
  "ciceri-tria": { file: "Ciceri e Tria 2.JPG" },
  "pasta-muddica": { file: "Pasta mollica e acciughe cosentina.jpg" },
  "fileja-nduja": { file: "Fileja-nduja-recipe.jpg" },
  "pasta-norma": { file: "Pasta Norma Villa Principe di Belmonte Ispica 2017.jpg" },
  "pasta-sarde": { file: "Pasta con le sarde 2.jpg" },
  culurgiones: { file: "Culurgiones Ogliastra.jpg" },
  malloreddus: { file: "MacaronesDePunzu(Malloreddus).JPG" },
  carbonade: { file: "Una giornata ad Arpy (AO).jpg" },
  "cotoletta-milanese": { file: "Milanesa.jpg" },
  "baccala-vicentina": { file: "Vicenza, Espressamente, baccala vicentina.jpg" },
  "fegato-veneziana": { file: "Chicken Livers.jpg" },
  "polenta-ragu": { file: "Polenta tradicional con ragú de carne.jpg" },
  saltimbocca: { file: "Saltimbocca alla romana (5461153662).jpg" },
  "parmigiana-melanzane": { file: "Parmigiana di melanzane.jpg" },
  "parmigiana-calabrese": { file: "Melanzane alla parmigiana - 14913732327.jpg" },
  "tiella-barese": { file: "Patate riso e cozze.jpg" },
  "fagioli-uccelletto": { file: "Fagioli cannellini all'uccelletto.jpg" },
  "peperoni-cruschi": { file: "Peperoni cruschi 2.jpg" },
  "pipi-patate": { file: "Pipi malangiani e patati 2013.JPG" },
  caponata: { file: "Caponata nissena.jpg" },
  "pizza-marinara": { file: "Pizza marinara (Napoli).jpg" },
  "focaccia-barese": { file: "FocacciaBarese.jpg" },
  sfincione: { file: "Sfincione palermitano.jpg" },
  "crescia-sfogliata": { file: "Cresciafoje.jpg" },
  "pane-carasau": { file: "Pane carasau.jpg" },
  "pane-pomodoro": { file: "Pa amb tomàquet - 001.jpg" },
  "tajarin-ragu": { file: "Tajarin al ragù.jpg" },
  "strangozzi-tartufo": { file: "Tagliatelle kun Trufo, Historia centro de Florenco.jpg" },
  "polenta-taragna": { file: "Polenta con formaggio 01.jpg" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A API do Commons limita requisições em sequência: espaça as chamadas e tenta de novo se for bloqueado.
async function politeFetch(url) {
  await sleep(3000);
  for (let attempt = 0; ; attempt++) {
    // Falha de rede (DNS, conexão) também conta como tentativa, não derruba a execução de primeira.
    const res = await fetch(url, { headers: { "User-Agent": UA } }).catch((error) => {
      if (attempt === 5) throw error;
      return null;
    });
    if (res?.ok) return res;
    if (attempt === 5) throw new Error(`${res?.status} em ${url}`);
    const retryAfter = Number(res?.headers.get("retry-after")) || 15 * (attempt + 1);
    await sleep(retryAfter * 1000);
  }
}

const api = (params) =>
  politeFetch(
    "https://commons.wikimedia.org/w/api.php?" +
      new URLSearchParams({ format: "json", origin: "*", ...params }),
  ).then((r) => r.json());

const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function candidates({ query, file, width = 1200 }) {
  const base = { prop: "imageinfo", iiprop: "url|size|extmetadata|user", iiurlwidth: String(width) };
  const json = file
    ? await api({ action: "query", titles: `File:${file}`, ...base })
    : await api({
        action: "query",
        generator: "search",
        gsrnamespace: "6",
        gsrsearch: `${query} filetype:bitmap`,
        gsrlimit: "15",
        ...base,
      });
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      return {
        title: p.title,
        width: info.width,
        height: info.height,
        thumb: info.thumburl,
        page: info.descriptionurl,
        license: strip(meta.LicenseShortName?.value),
        // Sem o campo "Artist", o autor é quem enviou o arquivo (obras próprias no Commons).
        author: strip(meta.Artist?.value) || info.user || "Autor desconhecido",
      };
    })
    .filter(Boolean)
    .filter((c) => file || (ALLOWED.test(c.license) && c.width >= 1000 && c.width >= c.height));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const credits = JSON.parse(await readFile(CREDITS_FILE, "utf8").catch(() => "{}"));
  const args = process.argv.slice(2);
  const list = args.includes("--list");
  const only = args.filter((a) => a !== "--list");
  const slugs = only.length ? only : Object.keys(IMAGES);

  for (const slug of slugs) {
    const found = await candidates(IMAGES[slug]);
    if (list) {
      console.log(`\n# ${slug}`);
      for (const c of found.slice(0, 8)) {
        console.log(`  ${c.title.replace(/^File:/, "")}  [${c.width}x${c.height}, ${c.license}]`);
      }
      continue;
    }
    const [pick] = found;
    if (!pick) {
      console.warn(`✗ ${slug}: nenhuma imagem adequada`);
      continue;
    }
    const res = await politeFetch(pick.thumb);
    await writeFile(path.join(OUT_DIR, `${slug}.jpg`), Buffer.from(await res.arrayBuffer()));
    credits[slug] = {
      title: pick.title.replace(/^File:/, ""),
      author: pick.author,
      license: pick.license,
      source: pick.page,
    };
    // Salva a cada imagem para não perder o progresso se a execução for interrompida.
    await writeFile(CREDITS_FILE, JSON.stringify(credits, null, 2) + "\n");
    console.log(`✓ ${slug}: ${pick.title} (${pick.license})`);
  }
}

main();
