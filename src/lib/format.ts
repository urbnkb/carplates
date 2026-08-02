export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Usuwa wiodące "powiat " z nazwy, np. "powiat Wrocław" -> "Wrocław". */
export function bareName(nazwa: string): string {
  return nazwa.replace(/^powiat\s+/i, "");
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

function joinPl(items: readonly string[], conjunction: string): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}

/**
 * "Mokotów" | "Wesoła lub Żoliborz" | "Rembertów, Wilanów lub Włochy".
 * Dla wyliczeń rozłącznych — pojazd pochodzi z *jednej* z tych dzielnic.
 */
export function orList(items: readonly string[]): string {
  return joinPl(items, "lub");
}

/**
 * "Mokotów" | "Wesoła i Żoliborz" | "Rembertów, Wilanów i Włochy".
 * Dla wyliczeń łącznych — kod obejmuje *wszystkie* te dzielnice.
 */
export function andList(items: readonly string[]): string {
  return joinPl(items, "i");
}
