import shapes from "../../public/data/warszawa-dzielnice.json";
import { dzielnicaById, dzielnicaSlug } from "@/lib/dzielnice";

interface DzielniceMapProps {
  wybrane: readonly number[];
  ariaLabel: string;
}

/**
 * Mapa dzielnic Warszawy renderowana na serwerze. Interaktywny GeoMap ciągnie do
 * przeglądarki dane wszystkich powiatów (ok. 64 KB gzip) i nie da się go odciąć
 * nawet przez next/dynamic, więc podstrony go nie importują. Zostaje na stronie głównej.
 */
export default function DzielniceMap({ wybrane, ariaLabel }: DzielniceMapProps) {
  const kolejnosc = [...shapes].sort((a, b) => +wybrane.includes(a.id) - +wybrane.includes(b.id));

  return (
    <div className="neu-sunken w-full overflow-hidden rounded-2xl bg-sea">
      <svg viewBox="0 0 800 620" className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {kolejnosc.map(({ id, d }) => {
          const dzielnica = dzielnicaById.get(id);
          if (!dzielnica) return null;
          return (
            <a key={id} href={`/dzielnica/${dzielnicaSlug(dzielnica)}`} tabIndex={-1}>
              <title>{`${dzielnica.nazwa}: ${dzielnica.kod}`}</title>
              <path
                d={d}
                className="map-shape"
                data-highlighted={wybrane.includes(id) || undefined}
                vectorEffect="non-scaling-stroke"
              />
            </a>
          );
        })}
      </svg>
      {/* Licencja ODbL wymaga, by źródło było widoczne tam, gdzie dane są używane. */}
      <p className="px-3 pb-2 text-right text-[10px] text-zinc-600">
        Granice dzielnic ©{" "}
        <a href="https://www.openstreetmap.org/copyright" className="hover:underline">
          autorzy OpenStreetMap
        </a>
      </p>
    </div>
  );
}
