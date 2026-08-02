interface FactsProps {
  ciekawostki: readonly string[];
  verified: boolean;
  /** Dopełniacz użyty w ostrzeżeniu, np. "tej dzielnicy". */
  subject?: string;
}

export default function Facts({ ciekawostki, verified, subject = "tego powiatu" }: FactsProps) {
  if (ciekawostki.length === 0) return null;

  return (
    <>
      <ul className="flex flex-col gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        {ciekawostki.map((fact, i) => (
          <li
            key={i}
            className={
              verified
                ? "flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                : "flex gap-2 text-sm italic text-zinc-400 dark:text-zinc-500"
            }
          >
            <span aria-hidden="true">•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {!verified && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Ciekawostki dla {subject} nie zostały jeszcze zweryfikowane.
        </p>
      )}
    </>
  );
}
