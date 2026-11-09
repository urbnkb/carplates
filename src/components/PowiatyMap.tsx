import shapes from "../../public/data/powiaty.json";
import { powiatNazwa } from "@/lib/format";
import { powiatyGeo } from "@/lib/sasiedzi";
import { powiatSlug } from "@/lib/slug";
import { findWojewodztwoBySlug, wojewodztwoSlug } from "@/lib/wojewodztwa";
import type { Wojewodztwo } from "@/types/powiat";

const sciezki = new Map(shapes.map((s) => [s.id, s.d]));

/** Kadr obejmujący ścieżki z marginesem. Rzutowanie daje same współrzędne bezwzględne (M/L/Z). */
function kadr(paths: string[]) {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const d of paths) {
    for (const [, x, y] of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) {
      minX = Math.min(minX, +x);
      maxX = Math.max(maxX, +x);
      minY = Math.min(minY, +y);
      maxY = Math.max(maxY, +y);
    }
  }
  const margines = 0.03 * Math.max(maxX - minX, maxY - minY);
  return {
    x: minX - margines,
    y: minY - margines,
    width: maxX - minX + 2 * margines,
    height: maxY - minY + 2 * margines,
  };
}

interface PowiatyMapProps {
  wojewodztwo: Wojewodztwo;
  /** geoId powiatu do podświetlenia; jego sąsiedzi dostają lżejszy kolor. */
  wybrany?: number;
  /** Kod pokazany na wybranym powiecie, gdy powiat ma ich kilka. */
  wybranyKod?: string;
  ariaLabel: string;
}

/**
 * Województwo renderowane na serwerze: bez JS-a, z etykietami kodów i prawdziwymi
 * linkami do powiatów. Linki są poza kolejnością Tab, bo te same adresy stoją
 * w listach pod mapą, a 40 kształtów do przetabowania nic czytelnikowi nie daje.
 */
export default function PowiatyMap({ wojewodztwo, wybrany, wybranyKod, ariaLabel }: PowiatyMapProps) {
  const powiaty = findWojewodztwoBySlug(wojewodztwoSlug(wojewodztwo))?.powiaty ?? [];
  const { x, y, width, height } = kadr(powiaty.flatMap((p) => sciezki.get(p.geoId) ?? []));
  const sasiedzi = wybrany == null ? [] : powiatyGeo[wybrany].sasiedzi;
  const rozmiarEtykiety = Math.max(width, height) / 30;
  // SVG rysuje w kolejności dokumentu: wybrany na końcu, żeby sąsiad nie przykrył mu konturu.
  const kolejnosc = [...powiaty].sort((a, b) => +(a.geoId === wybrany) - +(b.geoId === wybrany));

  return (
    <div className="neu-sunken w-full overflow-hidden rounded-2xl bg-sea p-2 sm:p-3">
      <svg
        viewBox={`${x.toFixed(1)} ${y.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {kolejnosc.map((p) => (
          <a key={p.geoId} href={`/powiat/${powiatSlug(p)}`} tabIndex={-1}>
            <title>{`${powiatNazwa(p)}: ${p.kody.join(", ")}`}</title>
            <path
              d={sciezki.get(p.geoId)}
              className="map-shape"
              data-highlighted={p.geoId === wybrany || undefined}
              data-sasiad={sasiedzi.includes(p.geoId) || undefined}
              vectorEffect="non-scaling-stroke"
            />
          </a>
        ))}
        {kolejnosc.map((p) => {
          const kod = (p.geoId === wybrany && wybranyKod) || p.kody[0];
          const [lx, ly, r] = powiatyGeo[p.geoId].etykieta;
          // Pół szerokości tekstu w monospace to ok. 0,33 em na znak.
          if (r < rozmiarEtykiety * (kod.length * 0.33 + 0.1)) return null;
          return (
            <text
              key={p.geoId}
              x={lx}
              y={ly}
              fontSize={rozmiarEtykiety}
              className="map-label"
              data-na-akcencie={p.geoId === wybrany || undefined}
            >
              {kod}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
