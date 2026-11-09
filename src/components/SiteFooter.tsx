import Link from "next/link";
import { DATA_UPDATED } from "@/lib/site";

const HUBY = [
  { href: "/wojewodztwo", label: "Województwa" },
  { href: "/powiat", label: "Powiaty" },
  { href: "/tablica", label: "Kody tablic" },
  { href: "/dzielnica", label: "Dzielnice Warszawy" },
  { href: "/o-projekcie", label: "O projekcie" },
];

/**
 * Stopka nawigacyjna obecna na każdej stronie. Powód jest wyszukiwarkowy, nie
 * estetyczny: prerenderowany HTML strony głównej nie zawierał ani jednego
 * odnośnika do treści, więc jedyną drogą Google do 833 podstron była sitemapa,
 * a ta nie przekazuje żadnego sygnału ważności. Stąd status „wykryta — obecnie
 * niezindeksowana" na blisko trzystu adresach.
 *
 * Cztery huby wystarczą, bo listy już istnieją: /wojewodztwo prowadzi do 16 stron,
 * /powiat do 380, /tablica do 425, /dzielnica do 18. Z tą stopką Googlebot
 * dochodzi do dowolnej podstrony w dwóch skokach, a z każdej podstrony wraca do
 * huba. Piąty link, /o-projekcie, niesie źródła danych i autora.
 */
export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-10">
      <div className="flex flex-col gap-2 border-t border-edge pt-6 text-sm text-zinc-600">
        {/*
          Bez separatorów między pozycjami — na wąskim ekranie lista zawija się
          do dwóch wierszy i kropka zostawała osierocona raz na końcu, raz na
          początku wiersza. Odstęp wystarczy do rozdzielenia pozycji.
        */}
        <nav aria-label="Przeglądaj serwis" className="flex flex-wrap gap-x-5 gap-y-1">
          {HUBY.map(({ href, label }) => (
            <Link key={href} href={href} className="text-accent hover:underline">
              {label}
            </Link>
          ))}
        </nav>
        <p>Dane z Wikiźródeł, Wikipedii i OpenStreetMap. Stan na {DATA_UPDATED.label}.</p>
      </div>
    </footer>
  );
}
