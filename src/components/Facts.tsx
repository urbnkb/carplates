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
      <ul className="flex flex-col gap-2 border-t border-white/70 pt-3">
        {ciekawostki.map((fact, i) => (
          <li
            key={i}
            className={
              verified
                ? "flex gap-2 text-sm text-zinc-700"
                : "flex gap-2 text-sm italic text-zinc-600"
            }
          >
            <span aria-hidden="true">•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {!verified && (
        <p className="text-xs text-amber-800">
          Ciekawostki dla {subject} nie zostały jeszcze zweryfikowane.
        </p>
      )}
    </>
  );
}
