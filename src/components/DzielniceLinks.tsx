import Link from "next/link";
import { dzielnice } from "@/data/dzielnice";
import { dzielnicaSlug } from "@/lib/dzielnice";
import { andList } from "@/lib/format";
import type { Dzielnica } from "@/types/dzielnica";

/** "Wesoła i Żoliborz" w zdaniu, z każdą nazwą jako linkiem do strony dzielnicy. */
export function DzielniceLinks({ items }: { items: Dzielnica[] }) {
  let next = 0;
  return andList.formatToParts(items.map((d) => d.nazwa)).map((part, i) => {
    if (part.type === "literal") return part.value;
    const d = items[next++];
    return (
      <Link
        key={i}
        href={`/dzielnica/${dzielnicaSlug(d)}`}
        className="font-medium text-accent hover:underline"
      >
        {d.nazwa}
      </Link>
    );
  });
}

const alfabetycznie = [...dzielnice].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));

/** Siatka wszystkich 18 dzielnic z kodami — na /dzielnica i na stronie Warszawy. */
export function DzielniceGrid() {
  return (
    <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
      {alfabetycznie.map((d) => (
        <li key={d.geoId}>
          <Link href={`/dzielnica/${dzielnicaSlug(d)}`} className="text-sm text-accent hover:underline">
            {d.nazwa}
          </Link>{" "}
          <span className="font-mono text-xs text-zinc-600">{d.kod}</span>
        </li>
      ))}
    </ul>
  );
}
