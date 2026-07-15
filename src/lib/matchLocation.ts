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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

interface IndexEntry {
  normalizedBare: string;
  normalizedFull: string;
  powiat: Powiat;
}

const index: IndexEntry[] = powiaty.map((powiat) => ({
  normalizedBare: normalize(bareName(powiat.nazwa)),
  normalizedFull: normalize(powiat.nazwa),
  powiat,
}));

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
  const prefixMatches: Powiat[] = [];
  const substringMatches: Powiat[] = [];
  for (const entry of sortedByBareName) {
    if (entry.normalizedBare.startsWith(query)) {
      prefixMatches.push(entry.powiat);
    } else if (entry.normalizedBare.includes(query)) {
      substringMatches.push(entry.powiat);
    }
  }
  return [...prefixMatches, ...substringMatches].slice(0, limit);
}
