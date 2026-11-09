import type { Dzielnica } from "@/types/dzielnica";
import type { Powiat } from "@/types/powiat";

interface FactsProps {
  powiat: Powiat;
  /** Gdy znamy konkretną dzielnicę, jej ciekawostki zastępują powiatowe. */
  dzielnica?: Dzielnica | null;
}

export default function Facts({ powiat, dzielnica }: FactsProps) {
  const { ciekawostki, factsVerified } = dzielnica ?? powiat;
  if (ciekawostki.length === 0) return null;

  return (
    <>
      <ul className="flex flex-col gap-2 border-t border-white/70 pt-3">
        {ciekawostki.map((fact, i) => (
          <li
            key={i}
            className={
              factsVerified
                ? "flex gap-2 text-[15px] leading-relaxed text-zinc-700"
                : "flex gap-2 text-[15px] leading-relaxed italic text-zinc-600"
            }
          >
            <span aria-hidden="true">•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {!factsVerified && (
        <p className="text-xs text-amber-800">
          Ciekawostki dla {dzielnica ? "tej dzielnicy" : "tego powiatu"} nie zostały jeszcze
          zweryfikowane.
        </p>
      )}
    </>
  );
}

/** Ciekawostki z nagłówkiem — tak stoją na podstronach, bez karty wokół. */
export function FactsSection({ title, ...facts }: FactsProps & { title: string }) {
  return (
    <section className="flex w-full flex-col">
      <h2 className="section-title">{title}</h2>
      <Facts {...facts} />
    </section>
  );
}
