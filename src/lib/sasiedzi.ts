import geo from "@/data/powiaty-geo.json";
import { powiaty } from "@/data/powiaty";
import type { Powiat } from "@/types/powiat";

interface PowiatGeo {
  sasiedzi: number[];
  /** [x, y, r]: środek i promień największego koła wpisanego w powiat, w układzie public/data/powiaty.json. */
  etykieta: number[];
}

/** Generowane przez `npm run maps`. */
export const powiatyGeo = geo as Record<string, PowiatGeo>;

const byGeoId = new Map(powiaty.map((p) => [p.geoId, p]));

export function getSasiedzi(powiat: Powiat): Powiat[] {
  return powiatyGeo[powiat.geoId].sasiedzi
    .flatMap((id) => byGeoId.get(id) ?? [])
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));
}
