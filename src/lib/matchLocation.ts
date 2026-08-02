import { dzielnice } from "@/data/dzielnice";
import { powiaty } from "@/data/powiaty";
import { bareName } from "@/lib/format";
import { warszawaPowiat } from "@/lib/dzielnice";
import type { Dzielnica } from "@/types/dzielnica";
import type { Powiat } from "@/types/powiat";

/**
 * Cel wyszukiwania: powiat, a dla Warszawy opcjonalnie konkretna dzielnica.
 * Dzielnica jest ustawiona tylko wtedy, gdy zapytanie trafiło w jej nazwę —
 * dzięki temu UI pokazuje jeden kod zamiast wszystkich piętnastu.
 */
export interface LocationTarget {
  powiat: Powiat;
  dzielnica?: Dzielnica;
}

export type LocationMatch =
  | { kind: "none" }
  | { kind: "unique"; target: LocationTarget }
  | { kind: "ambiguous"; candidates: LocationTarget[] };

/**
 * Klucz tożsamości celu. Konieczny, bo geoId dzielnic (1–18) kolidują liczbowo
 * z geoId powiatów (1–380) — przypinanie po samym geoId myliłoby np. Mokotów
 * z powiatem o geoId 4.
 */
export function locationTargetKey(target: LocationTarget): string {
  return target.dzielnica ? `d${target.dzielnica.geoId}` : `p${target.powiat.geoId}`;
}

export function targetName(target: LocationTarget): string {
  return target.dzielnica?.nazwa ?? bareName(target.powiat.nazwa);
}

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/-/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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
  target: LocationTarget;
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];
  for (const powiat of powiaty) {
    entries.push({
      normalizedBare: normalize(bareName(powiat.nazwa)),
      normalizedFull: normalize(powiat.nazwa),
      target: { powiat },
    });
    for (const alias of ALIASES[powiat.geoId] ?? []) {
      const normalizedAlias = normalize(alias);
      entries.push({
        normalizedBare: normalizedAlias,
        normalizedFull: normalizedAlias,
        target: { powiat },
      });
    }
  }
  // Dzielnice Warszawy — jedyny przypadek, w którym nazwa mniejsza od powiatu
  // ma sens jako osobny cel, bo niesie własny kod tablicy.
  for (const dzielnica of dzielnice) {
    const normalized = normalize(dzielnica.nazwa);
    entries.push({
      normalizedBare: normalized,
      normalizedFull: normalized,
      target: { powiat: warszawaPowiat, dzielnica },
    });
  }
  return entries;
}

const index: IndexEntry[] = buildIndex();

const sortedByName = [...index].sort((a, b) =>
  targetName(a.target).localeCompare(targetName(b.target), "pl"),
);

/**
 * Dopasowuje wpisaną nazwę do powiatu lub dzielnicy Warszawy metodą dokładnego
 * dopasowania (po normalizacji: bez polskich znaków diakrytycznych, wielkości
 * liter i nadmiarowych spacji) — bez zgadywania i bez dopasowań przybliżonych,
 * zgodnie z zasadą przyjętą w matchPlate. Zwraca "ambiguous" zamiast dowolnie
 * wybierać jeden wynik, gdy nazwa jest niejednoznaczna — w danych jest kilka par
 * powiatów ziemskich o identycznej nazwie w różnych województwach (np. dwa
 * "powiat brzeski": małopolskie i opolskie).
 */
export function matchLocation(input: string): LocationMatch {
  const query = normalize(input);
  if (!query) return { kind: "none" };
  const hits = index.filter(
    (entry) => entry.normalizedBare === query || entry.normalizedFull === query,
  );
  if (hits.length === 0) return { kind: "none" };
  if (hits.length === 1) return { kind: "unique", target: hits[0].target };
  return { kind: "ambiguous", candidates: hits.map((hit) => hit.target) };
}

/**
 * Zwraca do `limit` celów pasujących do wpisanego tekstu: najpierw dopasowania
 * prefiksowe (posortowane alfabetycznie wg nazwy), potem dopasowania podciągowe
 * — używane jako podpowiedzi podczas pisania. Dopasowanie prefiksowe z definicji
 * obejmuje też dopasowanie dokładne, więc obie kolidujące nazwy z pary
 * "ambiguous" zawsze pojawią się tu razem, gdy użytkownik wpisze pełną nazwę —
 * to one rozstrzygają niejednoznaczność przez kliknięcie. Tak samo "Praga"
 * pokazuje obie Pragi, zamiast zgadywać którąkolwiek.
 */
export function getLocationSuggestions(input: string, limit = 5): LocationTarget[] {
  const query = normalize(input);
  if (!query) return [];
  const seen = new Set<string>();
  const prefixMatches: LocationTarget[] = [];
  const substringMatches: LocationTarget[] = [];
  for (const entry of sortedByName) {
    const key = locationTargetKey(entry.target);
    if (seen.has(key)) continue;
    if (entry.normalizedBare.startsWith(query)) {
      prefixMatches.push(entry.target);
      seen.add(key);
    } else if (entry.normalizedBare.includes(query)) {
      substringMatches.push(entry.target);
      seen.add(key);
    }
  }
  return [...prefixMatches, ...substringMatches].slice(0, limit);
}
