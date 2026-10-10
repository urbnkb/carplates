import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "O projekcie i źródła danych",
  description:
    "Skąd pochodzą kody tablic rejestracyjnych, granice powiatów i dzielnic oraz ciekawostki w serwisie Skąd ta rejestracja? — źródła, licencje i data ostatniej zmiany danych.",
  path: "/o-projekcie",
});

// ponytail: data wpisana ręcznie (ostatni commit w src/data) — podbij ją przy każdej zmianie danych.
const DATA_UPDATED = "2 sierpnia 2026";

const LINK = "font-medium text-accent hover:underline";
const H2 = "text-sm font-semibold tracking-wide text-zinc-600 uppercase";

export default function OProjekciePage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "O projekcie", path: "/o-projekcie" }]} />
      <header className="text-center">
        <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          O projekcie
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-600">
          Projekt edukacyjny: po początkowych znakach polskiej tablicy rejestracyjnej pokazuje
          powiat, z którego pochodzi pojazd. Autor: urbnkb.
        </p>
      </header>

      <section className="flex w-full max-w-xl flex-col gap-3 text-sm text-zinc-700">
        <h2 className={H2}>Źródła danych</h2>
        <ul className="flex list-disc flex-col gap-3 pl-5">
          <li>
            <strong>Kody tablic i przypisane im powiaty:</strong>{" "}
            <a href="https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne" className={LINK}>
              Wikiźródła — „Polskie tablice rejestracyjne”
            </a>
            , sprawdzone z{" "}
            <a href="https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce" className={LINK}>
              Wikipedią — „Tablice rejestracyjne w Polsce”
            </a>
            . Kody powiatu nidzickiego i lidzbarskiego potwierdzono w infoboksach ich stron na
            Wikipedii.
          </li>
          <li>
            <strong>Granice powiatów:</strong>{" "}
            <a href="https://github.com/ppatrzyk/polska-geojson" className={LINK}>
              ppatrzyk/polska-geojson
            </a>{" "}
            (licencja MIT).
          </li>
          <li>
            <strong>Granice dzielnic Warszawy i ich kody tablic:</strong>{" "}
            <a href="https://www.openstreetmap.org/copyright" className={LINK}>
              © autorzy OpenStreetMap
            </a>{" "}
            (licencja ODbL), uproszczone narzędziem mapshaper. Przypisanie kodów do dzielnic
            potwierdzono w{" "}
            <a
              href="https://www.wyborkierowcow.pl/warszawskie-rejestracje-tablice-rejestracyjne-warszawa/"
              className={LINK}
            >
              wyborkierowcow.pl
            </a>{" "}
            i{" "}
            <a
              href="https://motoryzacja.interia.pl/porady/news-z-jakiej-dzielnicy-warszawy-jestes-tajemnica-tablicy-rejestr,nId,20356160"
              className={LINK}
            >
              motoryzacja.interia.pl
            </a>
            ; w odróżnieniu od reszty danych nie ma go w Wikiźródłach ani na Wikipedii.
          </li>
          <li>
            <strong>Ciekawostki:</strong> fakty o 380 powiatach zebrane głównie z polskiej
            Wikipedii, a o 18 dzielnicach Warszawy — z serwisów dzielnicowych m.st. Warszawy,
            Wikipedii i portali historycznych, potwierdzone w co najmniej dwóch źródłach. Żaden fakt
            nie został dopisany bez źródła.
          </li>
        </ul>
      </section>

      <section className="flex w-full max-w-xl flex-col gap-3 text-sm text-zinc-700">
        <h2 className={H2}>Aktualność</h2>
        <p>Ostatnia zmiana danych: {DATA_UPDATED}.</p>
      </section>
    </>
  );
}
