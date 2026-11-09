import Link from "next/link";
import DzielniceMap from "@/components/DzielniceMap";
import PowiatyMap from "@/components/PowiatyMap";
import { getDzielniceForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { andList, powiatNazwa } from "@/lib/format";
import { dopelniacz, wojewodztwoSlug } from "@/lib/wojewodztwa";
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
  // zdegraduje się do mapy województwa zamiast wyrenderować całkiem szarą Warszawę.
  const shown =
    dzielnice ?? (kod && powiat.geoId === WARSZAWA_GEO_ID ? getDzielniceForKod(kod) : []);

  if (shown.length > 0) {
    const heading =
      shown.length === 1
        ? `Dzielnica ${shown[0].nazwa} na mapie Warszawy`
        : `${andList.format(shown.map((d) => d.nazwa))} na mapie Warszawy`;
    return (
      <section className="flex w-full flex-col gap-3">
        <h2 className="section-title">{heading}</h2>
        <DzielniceMap wybrane={shown.map((d) => d.geoId)} ariaLabel={heading} />
      </section>
    );
  }

  const nazwaWojewodztwa = dopelniacz(powiat.wojewodztwo);
  const heading = `${powiatNazwa(powiat)} na mapie województwa ${nazwaWojewodztwa}`;
  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="section-title">{heading}</h2>
      <PowiatyMap
        wojewodztwo={powiat.wojewodztwo}
        wybrany={powiat.geoId}
        wybranyKod={kod}
        ariaLabel={heading}
      />
      <Link href={`/wojewodztwo/${wojewodztwoSlug(powiat.wojewodztwo)}`} className="link-accent text-sm">
        Wszystkie kody województwa {nazwaWojewodztwa} →
      </Link>
    </section>
  );
}
