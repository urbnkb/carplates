import { powiaty } from "@/data/powiaty";
import { bareName, isMiasto, slugify } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

/**
 * Bazowy slug (sama nazwa) koliduje dla kilku par powiatów o tej samej
 * nazwie w różnych województwach (np. dwa "powiat brzeski"). Dla obu stron
 * takiej kolizji doklejamy slug województwa, żeby każdy powiat miał
 * stabilny, przewidywalny i unikalny URL.
 */
const baseSlugCounts = new Map<string, number>();
for (const powiat of powiaty) {
  const base = slugify(bareName(powiat.nazwa));
  baseSlugCounts.set(base, (baseSlugCounts.get(base) ?? 0) + 1);
}

/** Czy w innym województwie jest powiat o tej samej nazwie (np. dwa "powiat brzeski"). */
export function hasNamesake(powiat: Powiat): boolean {
  return (baseSlugCounts.get(slugify(bareName(powiat.nazwa))) ?? 0) > 1;
}

/**
 * Hasło powiatu na polskiej Wikipedii. Reguła sprawdzona przez API Wikipedii
 * na wszystkich 380 powiatach: każde hasło istnieje i nie jest ujednoznacznieniem.
 */
export function wikipediaUrl(powiat: Powiat): string {
  const nazwa = bareName(powiat.nazwa);
  const haslo = isMiasto(powiat)
    ? nazwa
    : hasNamesake(powiat)
      ? `Powiat ${nazwa} (województwo ${powiat.wojewodztwo})`
      : `Powiat ${nazwa}`;
  return `https://pl.wikipedia.org/wiki/${encodeURI(haslo.replace(/ /g, "_"))}`;
}

function computeSlug(powiat: Powiat): string {
  const base = slugify(bareName(powiat.nazwa));
  return hasNamesake(powiat) ? `${base}-${slugify(powiat.wojewodztwo)}` : base;
}

const slugToPowiat = new Map<string, Powiat>();
const powiatToSlug = new Map<number, string>();
for (const powiat of powiaty) {
  const slug = computeSlug(powiat);
  if (slugToPowiat.has(slug)) {
    throw new Error(
      `Kolizja slugów powiatów: "${slug}" wskazuje jednocześnie na geoId ${slugToPowiat.get(slug)?.geoId} i ${powiat.geoId}.`,
    );
  }
  slugToPowiat.set(slug, powiat);
  powiatToSlug.set(powiat.geoId, slug);
}

export function powiatSlug(powiat: Powiat): string {
  return powiatToSlug.get(powiat.geoId) ?? computeSlug(powiat);
}

export function findPowiatBySlug(slug: string): Powiat | null {
  return slugToPowiat.get(slug) ?? null;
}

export function getAllPowiatSlugs(): string[] {
  return [...slugToPowiat.keys()];
}
