import { findPowiatByKod, getAllKody, type KodEntry } from "@/lib/kody";

function sanitize(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Dopasowuje wpisany tekst do powiatu, sprawdzając dokładnie na długości
 * min(text.length, 3) — kody mają 1–3 litery, więc to naturalnie realizuje
 * longest-prefix-match (dłuższy wpisany kod zawsze wygrywa, bo kod innej
 * długości nie może być równy wyciętemu fragmentowi) i jednocześnie NIE cofa
 * się do krótszego kodu, gdy wpisane znaki nie tworzą żadnego dłuższego
 * istniejącego kodu. Np. "WS" trafia na Siedlce (kod 2-literowy), "WSI" trafia
 * na powiat siedlecki (kod 3-literowy, przesłania krótszy), ale "WSP" — mimo
 * że zaczyna się od "WS" — nie ma dopasowania, bo żaden kod 3-literowy nie
 * zaczyna się na "WSP". Znaki po 3. literze (numer seryjny) nie mają już
 * wpływu na dopasowanie.
 */
export function matchPlate(input: string): KodEntry | null {
  const kod = sanitize(input).slice(0, 3);
  const powiat = kod ? findPowiatByKod(kod) : null;
  return powiat ? { kod, powiat } : null;
}

/**
 * Zwraca do `limit` kodów (posortowanych alfabetycznie) zaczynających się
 * na wpisany tekst, razem z powiatem, do którego należą — używane jako
 * podpowiedzi podczas pisania.
 */
export function getSuggestions(input: string, limit = 5): KodEntry[] {
  const text = sanitize(input);
  if (!text) return [];
  return getAllKody()
    .filter((entry) => entry.kod.startsWith(text))
    .slice(0, limit);
}
