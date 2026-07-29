import { capitalize } from "@/lib/format";
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

      <ul className="flex flex-col gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        {powiat.ciekawostki.map((fact, i) => (
          <li
            key={i}
            className={
              powiat.factsVerified
                ? "flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                : "flex gap-2 text-sm italic text-zinc-400 dark:text-zinc-500"
            }
          >
            <span aria-hidden="true">•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {!powiat.factsVerified && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Ciekawostki dla tego powiatu nie zostały jeszcze zweryfikowane.
        </p>
      )}
    </div>
  );
}
