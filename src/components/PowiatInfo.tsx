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
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div>
        {matchedCode && (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Kod {matchedCode}
          </p>
        )}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isWarszawa ? orList(dzielnice.map((d) => d.nazwa)) : capitalize(powiat.nazwa)}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
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

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
        <Link
          href={`/powiat/${powiatSlug(powiat)}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Zobacz pełną stronę tego powiatu →
        </Link>
        {dzielnice.map((d) => (
          <Link
            key={d.geoId}
            href={`/dzielnica/${dzielnicaSlug(d)}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Zobacz stronę dzielnicy {d.nazwa} →
          </Link>
        ))}
        {matchedCode && (
          <Link
            href={`/tablica/${matchedCode}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Zobacz stronę kodu {matchedCode} →
          </Link>
        )}
      </div>
    </div>
  );
}
