import { dzielnice } from "@/data/dzielnice";
import type { Dzielnica } from "@/types/dzielnica";

/** geoId m.st. Warszawy — jedynego powiatu z mapą dzielnic zamiast mapy Polski. */
export const WARSZAWA_GEO_ID = 302;

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
