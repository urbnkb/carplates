import Link from "next/link";
import { capitalize } from "@/lib/format";
import { powiatSlug } from "@/lib/slug";
import PowiatFacts from "@/components/PowiatFacts";
import type { Powiat } from "@/types/powiat";

interface PowiatInfoProps {
  powiat: Powiat | null;
  matchedCode?: string;
}

export default function PowiatInfo({ powiat, matchedCode }: PowiatInfoProps) {
  if (!powiat) {
    return null;
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div>
        {matchedCode && (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Kod {matchedCode}
          </p>
        )}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {capitalize(powiat.nazwa)}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Województwo {powiat.wojewodztwo}
        </p>
      </div>

      <PowiatFacts powiat={powiat} />

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
        <Link
          href={`/powiat/${powiatSlug(powiat)}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Zobacz pełną stronę tego powiatu →
        </Link>
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
