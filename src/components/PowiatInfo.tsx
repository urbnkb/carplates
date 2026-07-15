import { capitalize } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

const DEFAULT_PROMPT = "Wpisz początkowe znaki tablicy rejestracyjnej, aby rozpoznać powiat.";
const DEFAULT_NO_MATCH =
  "Nie rozpoznano powiatu — sprawdź wpisane znaki albo dopisz kolejną literę.";

interface PowiatInfoProps {
  powiat: Powiat | null;
  matchedCode?: string;
  hasInput: boolean;
  promptText?: string;
  noMatchText?: string;
}

export default function PowiatInfo({
  powiat,
  matchedCode,
  hasInput,
  promptText = DEFAULT_PROMPT,
  noMatchText = DEFAULT_NO_MATCH,
}: PowiatInfoProps) {
  if (!powiat) {
    return (
      <div className="w-full max-w-xl rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        {hasInput ? noMatchText : promptText}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
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
