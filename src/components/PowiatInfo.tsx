import Link from "next/link";
import { capitalize, orList } from "@/lib/format";
import { dzielnicaSlug, getDzielniceForKod } from "@/lib/dzielnice";
import { powiatSlug } from "@/lib/slug";
import Facts from "@/components/Facts";
import type { Dzielnica } from "@/types/dzielnica";
import type { Powiat } from "@/types/powiat";

interface PowiatInfoProps {
  powiat: Powiat | null;
  matchedCode?: string;
  /**
   * Ustawione, gdy znamy konkretną dzielnicę (tryb lokalizacji). Ma pierwszeństwo
   * przed wyprowadzeniem z kodu, bo WW i WX obejmują kilka dzielnic — a tutaj
   * wiemy, o którą chodzi.
   */
  dzielnica?: Dzielnica;
}

export default function PowiatInfo({ powiat, matchedCode, dzielnica }: PowiatInfoProps) {
  if (!powiat) {
    return null;
  }

  const dzielnice: Dzielnica[] = dzielnica
    ? [dzielnica]
    : matchedCode
      ? getDzielniceForKod(matchedCode)
      : [];
  const isWarszawa = dzielnice.length > 0;
  // Fakt przypisujemy dzielnicy tylko wtedy, gdy wiemy, która to jest.
  const single = dzielnice.length === 1 ? dzielnice[0] : null;

  return (
    <div className="neu-sunken flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-surface p-6">
      <div>
        {matchedCode && (
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Kod {matchedCode}
          </p>
        )}
        <h2 className="text-2xl font-bold text-zinc-900">
          {isWarszawa ? orList(dzielnice.map((d) => d.nazwa)) : capitalize(powiat.nazwa)}
        </h2>
        <p className="text-sm text-zinc-600">
          {isWarszawa
            ? `${dzielnice.length === 1 ? "Dzielnica" : "Dzielnice"} Warszawy · województwo ${powiat.wojewodztwo}`
            : `Województwo ${powiat.wojewodztwo}`}
        </p>
      </div>

      {single ? (
        <Facts
          ciekawostki={single.ciekawostki}
          verified={single.factsVerified}
          subject="tej dzielnicy"
        />
      ) : (
        <Facts ciekawostki={powiat.ciekawostki} verified={powiat.factsVerified} />
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/70 pt-3 text-sm">
        <Link
          href={`/powiat/${powiatSlug(powiat)}`}
          className="text-accent hover:underline"
        >
          Zobacz pełną stronę tego powiatu →
        </Link>
        {dzielnice.map((d) => (
          <Link
            key={d.geoId}
            href={`/dzielnica/${dzielnicaSlug(d)}`}
            className="text-accent hover:underline"
          >
            Zobacz stronę dzielnicy {d.nazwa} →
          </Link>
        ))}
        {matchedCode && (
          <Link
            href={`/tablica/${matchedCode}`}
            className="text-accent hover:underline"
          >
            Zobacz stronę kodu {matchedCode} →
          </Link>
        )}
      </div>
    </div>
  );
}
