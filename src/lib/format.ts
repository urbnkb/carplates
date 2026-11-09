import type { Powiat } from "@/types/powiat";

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Usuwa wiodące "powiat " z nazwy, np. "powiat Wrocław" -> "Wrocław". */
export function bareName(nazwa: string): string {
  return nazwa.replace(/^powiat\s+/i, "");
}

type Nazwany = Pick<Powiat, "nazwa">;

/** Miasto na prawach powiatu. W danych tylko takie nazwy są pisane wielką literą. */
export function isMiasto({ nazwa }: Nazwany): boolean {
  const pierwsza = bareName(nazwa)[0];
  return pierwsza !== pierwsza.toLowerCase();
}

/**
 * Odmiana powiatu ziemskiego. Wszystkie 314 nazw to przymiotniki na -ski, -cki,
 * -zki lub -ni, więc końcówkę wystarczy dopisać do każdego słowa. Miast nie
 * odmieniamy: „z miasta Wrocław” jest poprawne i nie wymaga słownika 66 form.
 */
function odmien(nazwa: string, koncowka: string): string {
  return bareName(nazwa)
    .split(" ")
    .map((slowo) => slowo + koncowka)
    .join(" ");
}

/** "Powiat gdański" | "Miasto Wrocław". */
export function powiatNazwa(powiat: Nazwany): string {
  return isMiasto(powiat) ? `Miasto ${bareName(powiat.nazwa)}` : capitalize(powiat.nazwa);
}

/** "powiat gdański" | "miasto Wrocław". W bierniku forma jest taka sama. */
export function powiatMianownik(powiat: Nazwany): string {
  return isMiasto(powiat) ? `miasto ${bareName(powiat.nazwa)}` : powiat.nazwa;
}

/** "powiatu gdańskiego" | "miasta Wrocław". */
export function powiatDopelniacz(powiat: Nazwany): string {
  return isMiasto(powiat)
    ? `miasta ${bareName(powiat.nazwa)}`
    : `powiatu ${odmien(powiat.nazwa, "ego")}`;
}

/** "powiecie gdańskim" | "mieście Wrocław". */
export function powiatMiejscownik(powiat: Nazwany): string {
  return isMiasto(powiat)
    ? `mieście ${bareName(powiat.nazwa)}`
    : `powiecie ${odmien(powiat.nazwa, "m")}`;
}

/** "powiat gdański" | "Wrocław": do tytułów, gdzie słowo „miasto” tylko zajmuje miejsce. */
export function powiatKrotko(powiat: Nazwany): string {
  return isMiasto(powiat) ? bareName(powiat.nazwa) : powiat.nazwa;
}

/**
 * Zamienia nazwę na fragment URL-a: bez wielkich liter, polskich znaków
 * diakrytycznych i znaków spoza [a-z0-9]. Używane zarówno dla powiatów
 * (@/lib/slug), jak i dla dzielnic Warszawy (@/lib/dzielnice) — trzymamy to
 * w jednym miejscu, żeby obie przestrzenie adresów nie rozjechały się po cichu.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const pluralRules = new Intl.PluralRules("pl");

/** Liczba z rzeczownikiem w dobrej formie: "1 powiat" | "22 powiaty" | "21 powiatów". */
export function liczebnik(n: number, formy: { one: string; few: string; many: string }): string {
  const kategoria = pluralRules.select(n);
  return `${n} ${kategoria === "one" ? formy.one : kategoria === "few" ? formy.few : formy.many}`;
}

/**
 * "Mokotów" | "Wesoła lub Żoliborz" | "Rembertów, Wilanów lub Włochy".
 * Dla wyliczeń rozłącznych — pojazd pochodzi z *jednej* z tych dzielnic.
 */
export const orList = new Intl.ListFormat("pl", { type: "disjunction" });

/**
 * "Mokotów" | "Wesoła i Żoliborz" | "Rembertów, Wilanów i Włochy".
 * Dla wyliczeń łącznych — kod obejmuje *wszystkie* te dzielnice.
 */
export const andList = new Intl.ListFormat("pl", { type: "conjunction" });
