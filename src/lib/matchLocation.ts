import { powiaty } from "@/data/powiaty";
import { bareName } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

export type LocationMatch =
  | { kind: "none" }
  | { kind: "unique"; powiat: Powiat }
  | { kind: "ambiguous"; candidates: Powiat[] };

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/-/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Alternatywne, oficjalne lub potoczne formy nazw, których nie da się
 * uzyskać samą normalizacją — kluczowany po geoId. Na razie tylko
 * Warszawa: jedyne miasto, którego pełna oficjalna nazwa ("miasto
 * stołeczne Warszawa") realnie różni się od nazwy w danych.
 */
const ALIASES: Record<number, string[]> = {
  302: ["m.st. Warszawa", "m. st. Warszawa", "miasto stołeczne Warszawa"],
};

interface IndexEntry {
  normalizedBare: string;
  normalizedFull: string;
  powiat: Powiat;
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];
  for (const powiat of powiaty) {
    entries.push({
      normalizedBare: normalize(bareName(powiat.nazwa)),
      normalizedFull: normalize(powiat.nazwa),
      powiat,
    });
    for (const alias of ALIASES[powiat.geoId] ?? []) {
      const normalizedAlias = normalize(alias);
      entries.push({
        normalizedBare: normalizedAlias,
        normalizedFull: normalizedAlias,
        powiat,
      });
    }
  }
  return entries;
}

const index: IndexEntry[] = buildIndex();

const sortedByBareName = [...index].sort((a, b) =>
  bareName(a.powiat.nazwa).localeCompare(bareName(b.powiat.nazwa), "pl"),
);

/**
 * Dopasowuje wpisaną nazwę do powiatu metodą dokładnego dopasowania (po
 * normalizacji: bez polskich znaków diakrytycznych, wielkości liter i
 * nadmiarowych spacji) — bez zgadywania i bez dopasowań przybliżonych,
 * zgodnie z zasadą przyjętą w matchPlate. Zwraca "ambiguous" zamiast
 * dowolnie wybierać jeden wynik, gdy nazwa jest niejednoznaczna — w danych
 * jest kilka par powiatów ziemskich o identycznej nazwie w różnych
 * województwach (np. dwa "powiat brzeski": małopolskie i opolskie).
 */
export function matchLocation(input: string): LocationMatch {
  const query = normalize(input);
  if (!query) return { kind: "none" };
  const hits = index.filter(
    (entry) => entry.normalizedBare === query || entry.normalizedFull === query,
  );
  if (hits.length === 0) return { kind: "none" };
  if (hits.length === 1) return { kind: "unique", powiat: hits[0].powiat };
  return { kind: "ambiguous", candidates: hits.map((hit) => hit.powiat) };
}

/**
 * Zwraca do `limit` powiatów pasujących do wpisanego tekstu: najpierw
 * dopasowania prefiksowe (posortowane alfabetycznie wg nazwy), potem
 * dopasowania podciągowe — używane jako podpowiedzi podczas pisania.
 * Dopasowanie prefiksowe z definicji obejmuje też dopasowanie dokładne,
 * więc obie kolidujące nazwy z pary "ambiguous" zawsze pojawią się tu
 * razem, gdy użytkownik wpisze pełną nazwę — to one rozstrzygają
 * niejednoznaczność przez kliknięcie.
 */
export function getLocationSuggestions(input: string, limit = 5): Powiat[] {
  const query = normalize(input);
  if (!query) return [];
  const seen = new Set<number>();
  const prefixMatches: Powiat[] = [];
  const substringMatches: Powiat[] = [];
  for (const entry of sortedByBareName) {
    if (seen.has(entry.powiat.geoId)) continue;
    if (entry.normalizedBare.startsWith(query)) {
      prefixMatches.push(entry.powiat);
      seen.add(entry.powiat.geoId);
    } else if (entry.normalizedBare.includes(query)) {
      substringMatches.push(entry.powiat);
      seen.add(entry.powiat.geoId);
    }
  }
  return [...prefixMatches, ...substringMatches].slice(0, limit);
}
