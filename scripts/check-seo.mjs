// Kontrola zbudowanego HTML-a: `npm run build && npm run check:seo`.
// Pilnuje tego, co Search Console karze po cichu: duplikatów, zepsutej odmiany
// i podstron bez treści.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../.next/server/app/", import.meta.url).pathname;
const SITE = "https://skadrejestracja.com";
// Bezpiecznik na regresję, nie cel: przed zmianami w <main> było ok. 65 słów.
const MIN_SLOW = { tablica: 90, powiat: 85 };
const MAX_PODOBIENSTWO = 0.75;

const pliki = readdirSync(ROOT, { recursive: true })
  .filter((f) => f.endsWith(".html") && !/_not-found|_global-error/.test(f))
  .map((f) => join(ROOT, f));

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const strony = pliki.map((plik) => {
  const html = readFileSync(plik, "utf8");
  const sciezka = "/" + relative(ROOT, plik).replace(/\.html$/, "").replace(/^index$/, "");
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const tekst = decode(
    main
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, " ")
      .replace(/<!-- -->/g, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  const jsonLdBloki = [...html.matchAll(/application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return {
    sciezka,
    jsonLdBloki,
    tytul: decode(html.match(/<title[^>]*>([^<]*)/)?.[1] ?? ""),
    opis: decode(html.match(/<meta name="description" content="([^"]*)/)?.[1] ?? ""),
    canonical: html.match(/<link rel="canonical" href="([^"]*)/)?.[1] ?? "",
    tekst,
    jsonLd: jsonLdBloki.join(" "),
  };
});

const bledy = [];
const duplikaty = (pole) => {
  const widziane = new Map();
  for (const s of strony) {
    if (!s[pole]) bledy.push(`${s.sciezka}: brak pola ${pole}`);
    if (widziane.has(s[pole])) bledy.push(`duplikat ${pole}: ${s.sciezka} i ${widziane.get(s[pole])}`);
    widziane.set(s[pole], s.sciezka);
  }
};
duplikaty("tytul");
duplikaty("opis");

const ZLA_ODMIANA = /\b(powiatu|powiecie) [a-ząćęłńóśźż-]+[csz]ki\b/;
const SZTUCZNA_NAZWA = /\b[Pp]owiat [A-ZĄĆĘŁŃÓŚŹŻ]/;

for (const s of strony) {
  const oczekiwany = s.sciezka === "/" ? SITE : `${SITE}${s.sciezka}`;
  if (s.canonical !== oczekiwany) bledy.push(`${s.sciezka}: canonical ${s.canonical}`);
  for (const blok of s.jsonLdBloki) {
    try {
      JSON.parse(blok);
    } catch {
      bledy.push(`${s.sciezka}: niepoprawny JSON-LD`);
    }
  }
  // Strona główna ma przełącznik „Powiat” tuż przed nagłówkiem „Skąd…”, stąd bez niej.
  for (const zrodlo of s.sciezka === "/" ? [] : [s.tytul, s.opis, s.tekst, s.jsonLd]) {
    const zla = zrodlo.match(ZLA_ODMIANA) ?? zrodlo.match(SZTUCZNA_NAZWA);
    if (zla) bledy.push(`${s.sciezka}: „${zla[0]}”`);
  }
  const typ = s.sciezka.split("/")[1];
  const slow = s.tekst.split(" ").length;
  if (s.sciezka.split("/").length === 3 && MIN_SLOW[typ] && slow < MIN_SLOW[typ]) {
    bledy.push(`${s.sciezka}: tylko ${slow} słów`);
  }
}

// Sąsiedztwo musi być symetryczne i kompletne.
const geo = JSON.parse(readFileSync(new URL("../src/data/powiaty-geo.json", import.meta.url)));
if (Object.keys(geo).length !== 380) bledy.push(`powiaty-geo.json: ${Object.keys(geo).length} powiatów`);
for (const [id, { sasiedzi }] of Object.entries(geo)) {
  if (sasiedzi.length === 0) bledy.push(`powiat ${id}: brak sąsiadów`);
  for (const s of sasiedzi) if (!geo[s].sasiedzi.includes(+id)) bledy.push(`asymetria: ${id} i ${s}`);
}

// 1026 miast minus 66 miast na prawach powiatu, które są już powiatami (stan na 1 stycznia 2026).
const miasta = JSON.parse(readFileSync(new URL("../src/data/miasta.json", import.meta.url)));
const liczbaMiast = Object.values(miasta).flat().length;
if (liczbaMiast !== 960) bledy.push(`miasta.json: ${liczbaMiast} miast zamiast 960`);
for (const id of Object.keys(miasta)) if (!geo[id]) bledy.push(`miasta.json: nieznany powiat ${id}`);

// Główny cel: /tablica/KOD i /powiat/SLUG jednego powiatu mają mówić co innego.
const slowa = (t) => new Set(t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 3));
const jaccard = (a, b) => {
  const czesc = [...a].filter((w) => b.has(w)).length;
  return czesc / (a.size + b.size - czesc);
};
const dane = readFileSync(new URL("../src/data/powiaty.ts", import.meta.url), "utf8");
const wiki = [...dane.matchAll(/kody: \["([A-Z]+)"\]/g)].map((m) => m[1]);
const strona = new Map(strony.map((s) => [s.sciezka, s]));
let max = 0;
let suma = 0;
let pary = 0;
for (const kod of wiki) {
  const tablica = strona.get(`/tablica/${kod}`);
  const para = strony.find((s) => s.sciezka.startsWith("/powiat/") && s.tekst.includes(`z kodem ${kod}.`));
  if (!tablica || !para) continue;
  const p = jaccard(slowa(tablica.tekst), slowa(para.tekst));
  max = Math.max(max, p);
  suma += p;
  pary += 1;
}
if (max > MAX_PODOBIENSTWO) bledy.push(`pary /tablica i /powiat za podobne: max ${max.toFixed(2)}`);

const slowaTablic = strony.filter((s) => /^\/tablica\/./.test(s.sciezka)).map((s) => s.tekst.split(" ").length);
const slowaPowiatow = strony.filter((s) => /^\/powiat\/./.test(s.sciezka)).map((s) => s.tekst.split(" ").length);
const srednia = (l) => Math.round(l.reduce((a, b) => a + b, 0) / l.length);

console.log(`Stron: ${strony.length}`);
console.log(`Słów na stronie: /tablica śr. ${srednia(slowaTablic)}, min ${Math.min(...slowaTablic)}; /powiat śr. ${srednia(slowaPowiatow)}, min ${Math.min(...slowaPowiatow)}`);
console.log(`Podobieństwo par /tablica i /powiat: śr. ${(suma / pary).toFixed(2)}, max ${max.toFixed(2)} (${pary} par)`);

if (bledy.length > 0) {
  console.error(`\nBłędów: ${bledy.length}`);
  for (const b of bledy.slice(0, 40)) console.error(`- ${b}`);
  process.exit(1);
}
console.log("OK");
