import GeoMap from "@/components/GeoMap";
import { getDzielniceForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { andList, capitalize } from "@/lib/format";
import type { Dzielnica } from "@/types/dzielnica";
import type { Powiat } from "@/types/powiat";

interface RegionMapProps {
  powiat: Powiat;
  /** Kanoniczny kod tablicy — tylko na /tablica/[kod]. Dla Warszawy przełącza mapę na dzielnice. */
  kod?: string;
  /**
   * Jawna lista dzielnic do podświetlenia — ma pierwszeństwo przed `kod`.
   * Potrzebne na /dzielnica/[slug], gdzie kod WW obejmuje trzy dzielnice,
   * a podświetlić trzeba dokładnie tę jedną, której dotyczy strona.
   */
  dzielnice?: Dzielnica[];
}

export default function RegionMap({ powiat, kod, dzielnice }: RegionMapProps) {
  // Warunkiem mapy dzielnic jest niepusta lista, a nie samo geoId: nieznany kod
  // zdegraduje się do mapy Polski zamiast wyrenderować całkiem szarą Warszawę.
  const shown =
    dzielnice ?? (kod && powiat.geoId === WARSZAWA_GEO_ID ? getDzielniceForKod(kod) : []);

  const heading =
    shown.length === 1
      ? `Dzielnica ${shown[0].nazwa} na mapie Warszawy`
      : shown.length > 1
        ? `${andList.format(shown.map((d) => d.nazwa))} na mapie Warszawy`
        : `${capitalize(powiat.nazwa)} na mapie Polski`;

  return (
    <section className="flex w-full flex-col items-center gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">{heading}</h2>
      {shown.length > 0 ? (
        <GeoMap map="warszawa" highlightedIds={shown.map((d) => d.geoId)} ariaLabel={heading} />
      ) : (
        <GeoMap map="polska" highlightedIds={[powiat.geoId]} ariaLabel={heading} />
      )}
    </section>
  );
}
