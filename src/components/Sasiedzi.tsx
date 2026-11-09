import Link from "next/link";
import { powiatKrotko } from "@/lib/format";
import { getSasiedzi } from "@/lib/sasiedzi";
import { powiatSlug } from "@/lib/slug";
import type { Powiat } from "@/types/powiat";

/** Warszawa ma 15 kodów; w liście sąsiadów wystarczą pierwsze, reszta jest na jej stronie. */
const LIMIT_KODOW = 3;

/** Sąsiednie powiaty z kodami: treść unikalna dla strony i linki między powiązanymi stronami. */
export default function Sasiedzi({ powiat, title }: { powiat: Powiat; title: string }) {
  return (
    <section className="w-full">
      <h2 className="section-title">{title}</h2>
      <ul className="mt-3 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {getSasiedzi(powiat).map((sasiad) => (
          <li
            key={sasiad.geoId}
            className="flex items-baseline justify-between gap-4 border-b border-edge py-2"
          >
            <Link
              href={`/powiat/${powiatSlug(sasiad)}`}
              className="text-zinc-700 hover:text-accent hover:underline"
            >
              {powiatKrotko(sasiad)}
            </Link>
            <span className="flex shrink-0 gap-2 font-mono">
              {sasiad.kody.slice(0, LIMIT_KODOW).map((kod) => (
                <Link key={kod} href={`/tablica/${kod}`} className="font-bold text-accent hover:underline">
                  {kod}
                </Link>
              ))}
              {sasiad.kody.length > LIMIT_KODOW && <span className="text-zinc-600">…</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
