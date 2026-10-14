import { powiaty } from "@/data/powiaty";
import { slugify } from "@/lib/format";
import { getAllKody, type KodEntry } from "@/lib/kody";
import type { Powiat, Wojewodztwo } from "@/types/powiat";

export interface WojewodztwoInfo {
  nazwa: Wojewodztwo;
  slug: string;
  /** Pierwsze litery kodów tablic, alfabetycznie, np. ["I", "S"]. */
  litery: string[];
  /** Powiaty województwa, alfabetycznie. */
  powiaty: Powiat[];
  /** Kody tablic województwa z powiatami, alfabetycznie po kodzie. */
  kody: KodEntry[];
}

const powiatyByWoj = new Map<Wojewodztwo, Powiat[]>();
for (const powiat of powiaty) {
  powiatyByWoj.set(powiat.wojewodztwo, [...(powiatyByWoj.get(powiat.wojewodztwo) ?? []), powiat]);
}

/**
 * 16 województw liczonych z danych powiatów, posortowanych po pierwszej literze
 * tablic (B podlaskie … Z zachodniopomorskie), czyli w kolejności, w jakiej
 * czyta się tablicę.
 */
export const wojewodztwa: WojewodztwoInfo[] = [...powiatyByWoj]
  .map(([nazwa, lista]) => {
    const kody = getAllKody().filter(({ powiat }) => powiat.wojewodztwo === nazwa);
    return {
      nazwa,
      slug: slugify(nazwa),
      litery: [...new Set(kody.map(({ kod }) => kod[0]))].sort(),
      powiaty: [...lista].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl")),
      kody,
    };
  })
  .sort((a, b) => a.litery[0].localeCompare(b.litery[0]));

const bySlug = new Map(wojewodztwa.map((w) => [w.slug, w]));

export function wojewodztwoSlug(nazwa: Wojewodztwo): string {
  return slugify(nazwa);
}

export function findWojewodztwoBySlug(slug: string): WojewodztwoInfo | null {
  return bySlug.get(slug) ?? null;
}

export function getAllWojewodztwoSlugs(): string[] {
  return [...bySlug.keys()];
}

/**
 * "mazowieckie" -> "mazowieckim", do zdań "w województwie …". Wszystkie 16 nazw
 * to przymiotniki zakończone na "ie", więc wystarczy podmiana końcówki.
 */
export function miejscownik(nazwa: Wojewodztwo): string {
  return nazwa.replace(/ie$/, "im");
}
