import { dzielnice } from "@/data/dzielnice";
import { powiaty } from "@/data/powiaty";
import { capitalize, orList, slugify } from "@/lib/format";
import type { Dzielnica } from "@/types/dzielnica";
import type { Powiat } from "@/types/powiat";

/** geoId m.st. Warszawy — jedynego powiatu z mapą dzielnic zamiast mapy Polski. */
export const WARSZAWA_GEO_ID = 302;

const warszawa = powiaty.find((p) => p.geoId === WARSZAWA_GEO_ID);
if (!warszawa) {
  throw new Error(`Brak powiatu Warszawa (geoId ${WARSZAWA_GEO_ID}) w danych powiatów.`);
}
/** Rekord powiatu Warszawa — potrzebny na stronach dzielnic, gdzie nie ma go skąd wziąć. */
export const warszawaPowiat: Powiat = warszawa;

export const dzielnicaById = new Map(dzielnice.map((d) => [d.geoId, d]));

const byKod = new Map<string, Dzielnica[]>();
for (const d of dzielnice) {
  const arr = byKod.get(d.kod) ?? [];
  arr.push(d);
  byKod.set(d.kod, arr);
}

/**
 * Zwraca dzielnice odpowiadające danemu kodowi tablicy Warszawy — zwykle
 * jedną, ale dla WW (3) i WX (2) więcej, bo sam kod ich nie rozróżnia.
 */
export function getDzielniceForKod(kod: string): Dzielnica[] {
  return byKod.get(kod) ?? [];
}

/**
 * Nazwy dzielnic kodu w formie rozłącznej — "Mokotów", "Wesoła lub Żoliborz",
 * "Rembertów, Wilanów lub Włochy". null dla kodów spoza Warszawy.
 */
export function dzielniceLabelForKod(kod: string): string | null {
  const found = getDzielniceForKod(kod);
  return found.length > 0 ? orList(found.map((d) => d.nazwa)) : null;
}

/**
 * Etykieta regionu dla kodu: dla Warszawy dokleja dzielnicę (lub listę dzielnic,
 * gdy kod jest współdzielony), poza Warszawą zwraca samą nazwę powiatu.
 * "Warszawa (Mokotów)" | "Warszawa (Rembertów, Wilanów lub Włochy)" | "Powiat wołomiński"
 */
export function regionLabel(powiat: Powiat, kod?: string): string {
  if (kod && powiat.geoId === WARSZAWA_GEO_ID) {
    const label = dzielniceLabelForKod(kod);
    if (label) return `Warszawa (${label})`;
  }
  return capitalize(powiat.nazwa);
}

const slugToDzielnica = new Map<string, Dzielnica>();
for (const d of dzielnice) {
  const slug = slugify(d.nazwa);
  const existing = slugToDzielnica.get(slug);
  if (existing) {
    throw new Error(
      `Kolizja slugów dzielnic: "${slug}" wskazuje jednocześnie na "${existing.nazwa}" i "${d.nazwa}".`,
    );
  }
  slugToDzielnica.set(slug, d);
}

export function dzielnicaSlug(dzielnica: Dzielnica): string {
  return slugify(dzielnica.nazwa);
}

export function findDzielnicaBySlug(slug: string): Dzielnica | null {
  return slugToDzielnica.get(slug) ?? null;
}

export function getAllDzielnicaSlugs(): string[] {
  return [...slugToDzielnica.keys()];
}
