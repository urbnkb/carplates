import type { Powiat } from "@/types/powiat";

interface PowiatFactsProps {
  powiat: Powiat;
}

export default function PowiatFacts({ powiat }: PowiatFactsProps) {
  return (
    <>
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
    </>
  );
}
