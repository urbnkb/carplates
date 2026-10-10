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
                ? "flex gap-2 text-sm text-zinc-700"
                : "flex gap-2 text-sm italic text-zinc-600"
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

/** Ciekawostki we własnej karcie z nagłówkiem — tak stoją na podstronach. */
export function FactsCard({ title, ...facts }: FactsProps & { title: string }) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 self-center neu-sunken rounded-2xl bg-well p-6">
      <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">{title}</h2>
      <Facts {...facts} />
    </div>
  );
}
