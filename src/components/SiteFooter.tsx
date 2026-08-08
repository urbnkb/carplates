import Link from "next/link";

const HUBY = [
  { href: "/powiat", label: "Powiaty" },
  { href: "/tablica", label: "Kody tablic" },
  { href: "/dzielnica", label: "Dzielnice Warszawy" },
];

/**
 * Stopka nawigacyjna obecna na każdej stronie. Powód jest wyszukiwarkowy, nie
 * estetyczny: prerenderowany HTML strony głównej nie zawierał ani jednego
 * odnośnika do treści, więc jedyną drogą Google do 833 podstron była sitemapa,
 * a ta nie przekazuje żadnego sygnału ważności. Stąd status „wykryta — obecnie
 * niezindeksowana" na blisko trzystu adresach.
 *
 * Trzy linki wystarczą, bo listy już istnieją: /powiat prowadzi do 380 stron,
 * /tablica do 425, /dzielnica do 18. Z tą stopką Googlebot dochodzi do dowolnej
 * podstrony w dwóch skokach, a z każdej podstrony wraca do huba.
 */
export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-6 pb-10">
      <nav
        aria-label="Przeglądaj serwis"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-zinc-600"
      >
        <span>Przeglądaj:</span>
        {/*
          Bez separatorów między pozycjami — na wąskim ekranie lista zawija się
          do dwóch wierszy i kropka zostawała osierocona raz na końcu, raz na
          początku wiersza. Odstęp wystarczy do rozdzielenia pozycji.
        */}
        {HUBY.map(({ href, label }) => (
          <Link key={href} href={href} className="text-accent hover:underline">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
