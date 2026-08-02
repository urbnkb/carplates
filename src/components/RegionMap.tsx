import PolandMap from "@/components/PolandMap";
import WarszawaDzielniceMap from "@/components/WarszawaDzielniceMap";
import { getDzielniceForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { capitalize } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

interface RegionMapProps {
  powiat: Powiat;
  /** Kanoniczny kod tablicy — tylko na /tablica/[kod]. Dla Warszawy przełącza mapę na dzielnice. */
  kod?: string;
}

export default function RegionMap({ powiat, kod }: RegionMapProps) {
  // Warunkiem jest niepusta lista dzielnic, a nie samo geoId: nieznany kod
  // zdegraduje się do mapy Polski zamiast wyrenderować całkiem szarą Warszawę.
  const dzielnice = kod && powiat.geoId === WARSZAWA_GEO_ID ? getDzielniceForKod(kod) : [];

  const heading =
    dzielnice.length > 0
      ? `${dzielnice.length === 1 ? "Dzielnica" : "Dzielnice"} Warszawy z kodem ${kod}`
      : `${capitalize(powiat.nazwa)} na mapie Polski`;

  return (
    <section className="flex w-full flex-col items-center gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {heading}
      </h2>
      {dzielnice.length > 0 ? (
        <WarszawaDzielniceMap
          highlightedGeoIds={dzielnice.map((d) => d.geoId)}
          ariaLabel={heading}
        />
      ) : (
        <PolandMap highlightedGeoId={powiat.geoId} ariaLabel={heading} />
      )}
    </section>
  );
}
