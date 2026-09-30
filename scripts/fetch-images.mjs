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
  "bruschetta-pomodoro": { file: "Tomato and basil bruschetta (4925749658).jpg" },
  "burrata-pugliese": { file: "Burrata di bufala.jpg" },
  "carpaccio-manzo": { file: "Carpaccio Cipriani.jpg" },
  "focaccia-casa": { file: "Rosemary Focaccia.jpg" },
  "spaghetti-carbonara": { file: "Spaghetti alla Carbonara 3.jpg" },
  "tagliatelle-ragu": { file: "Tagliatelle al ragù.jpg" },
  "gnocchi-pomodoro": { file: "Gnocchi al Pomodoro (2920979155).jpg" },
  "risotto-funghi": { file: "Risotto ai funghi porcini.JPG" },
  "lasagna-nonna": { file: "Meaty Lasagna 8of8 (8736299782).jpg" },
  "penne-arrabbiata": { file: "Penne all'arrabbiata.jpg" },
  "ossobuco-milanese": { file: "Ossobuco con risotto alla milanese.jpg" },
  "filetto-gorgonzola": { file: "DSC 7130 Seared filet mignon served with creamy mashed potatoes and steamed vegetables on a white plate.jpg" },
  "salmone-limone": { file: "Catch of the day (5792693269).jpg" },
  "pollo-parmigiana": { file: "Chicken parmigiana.jpg" },
  "pizza-margherita": { file: "Tony's Napoletana Margherita Pizza (5991972038).jpg" },
  "pizza-diavola": { file: "Pepperoni pizza- boella co. 2024-02-17.jpg" },
  "pizza-quattro-formaggi": { file: "Four Cheese - Pizza 500 2023-11-10.jpg" },
  "pizza-parma-rucola": { file: "Rossa pizza 23 January 2025 Trattoria & Dolci Solaire Resort NorthC.jpg" },
  tiramisu: { file: "Dolce Tiramisù monoporzione.jpg" },
  "panna-cotta": { file: "Panna Cotta with fresh berries.jpg" },
  cannoli: { file: "Cannoli siciliani (edited).jpg" },
  affogato: { file: "Affogato with Amarretti Biscotti - Tavola Di Famiglia 2026-02-27.jpg" },
  "chianti-classico": { file: "Bottle and glass of red wine.jpg" },
  prosecco: { file: "Waiter pouring Zardetto sparkling Prosecco.jpg" },
  "limonata-casa": { file: "Homemade Mint Lemonade,Bangladesh.jpg" },
  "acqua-minerale": { file: "Waiter serves water in a glass at a restaurant.jpg" },
  "aperol-spritz": { file: "Aperol Spritz - July 2024 - Sarah Stierch.jpg" },
  espresso: { file: "Espresso Coffee 01.jpg" },
  cappuccino: { file: "A cup of cappuccino.jpg" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A API do Commons limita requisições em sequência: espaça as chamadas e tenta de novo se for bloqueado.
async function politeFetch(url) {
  await sleep(3000);
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res;
    if (attempt === 5) throw new Error(`${res.status} em ${url}`);
    const retryAfter = Number(res.headers.get("retry-after")) || 15 * (attempt + 1);
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
