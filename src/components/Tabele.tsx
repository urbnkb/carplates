import Link from "next/link";
import type { ReactNode } from "react";
import { dzielniceLabelForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { bareName, liczebnik } from "@/lib/format";
import type { KodEntry } from "@/lib/kody";
import { powiatSlug } from "@/lib/slug";
import { wojewodztwa, type WojewodztwoInfo } from "@/lib/wojewodztwa";
import type { Powiat } from "@/types/powiat";

const NAGLOWEK = "border-b border-edge py-2 pr-4 text-left text-sm font-medium text-zinc-600";
const KOMORKA = "border-b border-edge";
const KOD = "block py-2 font-mono font-bold text-accent hover:underline";
const NAZWA = "block py-2 text-zinc-700 hover:text-accent hover:underline";

/** "gdański" | "Gdańsk" | "Warszawa (Mokotów)": kolumna ma nagłówek „Powiat lub miasto”. */
function nazwaWiersza(powiat: Powiat, kod: string): string {
  const dzielnice = powiat.geoId === WARSZAWA_GEO_ID ? dzielniceLabelForKod(kod) : null;
  return dzielnice ? `Warszawa (${dzielnice})` : bareName(powiat.nazwa);
}

export function TabelaKodow({ kody }: { kody: KodEntry[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th scope="col" className={`${NAGLOWEK} w-20`}>
            Kod
          </th>
          <th scope="col" className={NAGLOWEK}>
            Powiat lub miasto
          </th>
        </tr>
      </thead>
      <tbody>
        {kody.map(({ kod, powiat }) => (
          <tr key={kod}>
            <td className={KOMORKA}>
              <Link href={`/tablica/${kod}`} className={KOD}>
                {kod}
              </Link>
            </td>
            <td className={KOMORKA}>
              <Link href={`/powiat/${powiatSlug(powiat)}`} className={NAZWA}>
                {nazwaWiersza(powiat, kod)}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TabelaPowiatow({ powiaty }: { powiaty: Powiat[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th scope="col" className={NAGLOWEK}>
            Powiat lub miasto
          </th>
          <th scope="col" className={NAGLOWEK}>
            Kody tablic
          </th>
        </tr>
      </thead>
      <tbody>
        {powiaty.map((powiat) => (
          <tr key={powiat.geoId}>
            <td className={KOMORKA}>
              <Link href={`/powiat/${powiatSlug(powiat)}`} className={NAZWA}>
                {bareName(powiat.nazwa)}
              </Link>
            </td>
            <td className={`${KOMORKA} py-2`}>
              <span className="flex flex-wrap gap-x-3 font-mono">
                {powiat.kody.map((kod) => (
                  <Link key={kod} href={`/tablica/${kod}`} className="font-bold text-accent hover:underline">
                    {kod}
                  </Link>
                ))}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TabelaWojewodztw() {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th scope="col" className={`${NAGLOWEK} w-20`}>
            Litery
          </th>
          <th scope="col" className={NAGLOWEK}>
            Województwo
          </th>
          <th scope="col" className={NAGLOWEK}>
            Zawartość
          </th>
        </tr>
      </thead>
      <tbody>
        {wojewodztwa.map(({ nazwa, slug, litery, powiaty, kody }) => (
          <tr key={slug}>
            <td className={`${KOMORKA} font-mono font-bold text-zinc-900`}>{litery.join(", ")}</td>
            <td className={KOMORKA}>
              <Link href={`/wojewodztwo/${slug}`} className="block py-2 font-medium text-accent hover:underline">
                {nazwa}
              </Link>
            </td>
            <td className={`${KOMORKA} text-sm text-zinc-600 tabular-nums`}>
              {liczebnik(powiaty.length, { one: "powiat", few: "powiaty", many: "powiatów" })},{" "}
              {liczebnik(kody.length, { one: "kod", few: "kody", many: "kodów" })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Długie listy tną się na 16 województw, a ten pasek skacze do wybranego. */
export function SpisWojewodztw() {
  return (
    <nav aria-label="Przejdź do województwa" className="sticky top-0 z-10 w-full bg-surface py-2">
      <ul className="flex flex-wrap gap-1">
        {wojewodztwa.map(({ nazwa, slug, litery }) => (
          <li key={slug}>
            <a
              href={`#${slug}`}
              title={nazwa}
              className="block min-w-8 rounded-md px-2 py-1 text-center font-mono font-bold text-accent hover:bg-well"
            >
              {litery[0]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SekcjeWojewodztw({ tresc }: { tresc: (w: WojewodztwoInfo) => ReactNode }) {
  return (
    <div className="w-full gap-x-12 lg:columns-2">
      {wojewodztwa.map((w) => (
        <section key={w.slug} id={w.slug} className="mb-10 scroll-mt-14 break-inside-avoid">
          <h2 className="section-title mb-1">
            Województwo {w.nazwa}{" "}
            <span className="font-mono text-base font-semibold text-zinc-600">{w.litery.join(", ")}</span>
          </h2>
          {tresc(w)}
        </section>
      ))}
    </div>
  );
}
