import { powiaty } from "@/data/powiaty";
import type { MatchResult, Suggestion } from "@/types/powiat";

const CODE_LENGTHS = [1, 2, 3] as const;
const MAX_CODE_LENGTH = 3;

const codeMaps = new Map(CODE_LENGTHS.map((len) => [len, new Map<string, MatchResult>()]));

const allCodesSorted: Suggestion[] = [];

for (const powiat of powiaty) {
  for (const kod of powiat.kody) {
    codeMaps.get(kod.length as (typeof CODE_LENGTHS)[number])?.set(kod, {
      powiat,
      matchedCode: kod,
    });
    allCodesSorted.push({ code: kod, powiat });
  }
}

allCodesSorted.sort((a, b) => a.code.localeCompare(b.code));

function sanitize(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Dopasowuje wpisany tekst do powiatu, sprawdzając dokładnie na długości
 * min(text.length, 3) — kody mają 1–3 litery, więc to naturalnie realizuje
 * longest-prefix-match (dłuższy wpisany kod zawsze wygrywa, bo sprawdzana
 * jest mapa dla jego długości) i jednocześnie NIE cofa się do krótszego
 * kodu, gdy wpisane znaki nie tworzą żadnego dłuższego istniejącego kodu.
 * Np. "WS" trafia na Siedlce (kod 2-literowy), "WSI" trafia na powiat
 * siedlecki (kod 3-literowy, przesłania krótszy), ale "WSP" — mimo że
 * zaczyna się od "WS" — nie ma dopasowania, bo żaden kod 3-literowy nie
 * zaczyna się na "WSP". Znaki po 3. literze (numer seryjny) nie mają już
 * wpływu na dopasowanie.
 */
export function matchPlate(input: string): MatchResult | null {
  const text = sanitize(input);
  if (text.length === 0) return null;
  const len = Math.min(text.length, MAX_CODE_LENGTH) as (typeof CODE_LENGTHS)[number];
  const code = text.slice(0, len);
  return codeMaps.get(len)?.get(code) ?? null;
}

/**
 * Zwraca do `limit` kodów (posortowanych alfabetycznie) zaczynających się
 * na wpisany tekst, razem z powiatem, do którego należą — używane jako
 * podpowiedzi podczas pisania.
 */
export function getSuggestions(input: string, limit = 5): Suggestion[] {
  const text = sanitize(input);
  if (!text) return [];
  const results: Suggestion[] = [];
  for (const suggestion of allCodesSorted) {
    if (suggestion.code.startsWith(text)) {
      results.push(suggestion);
      if (results.length >= limit) break;
    }
  }
  return results;
}
