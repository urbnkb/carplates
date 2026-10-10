import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "O projekcie i źródła danych",
  description:
    "Skąd pochodzą kody tablic rejestracyjnych, granice powiatów i dzielnic oraz ciekawostki w serwisie. Licencje danych i data ich ostatniej zmiany.",
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
          To projekt edukacyjny: wpisujesz początkowe znaki polskiej tablicy rejestracyjnej,
          a strona pokazuje, z jakiego powiatu pochodzi pojazd. Prowadzi go urbnkb.
        </p>
      </header>

      <section className="flex w-full max-w-xl flex-col gap-3 text-sm text-zinc-700">
        <h2 className={H2}>Źródła danych</h2>
        <ul className="flex list-disc flex-col gap-3 pl-5">
          <li>
            Kody tablic i powiaty, do których należą, pochodzą z hasła{" "}
            <a href="https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne" className={LINK}>
              „Polskie tablice rejestracyjne”
            </a>{" "}
            w Wikiźródłach. Porównano je z artykułem{" "}
            <a href="https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce" className={LINK}>
              „Tablice rejestracyjne w Polsce”
            </a>{" "}
            na Wikipedii. Kodów powiatu nidzickiego i lidzbarskiego brakowało w tabeli źródłowej,
            więc potwierdzono je w infoboksach stron tych powiatów na Wikipedii.
          </li>
          <li>
            Granice powiatów pochodzą z repozytorium{" "}
            <a href="https://github.com/ppatrzyk/polska-geojson" className={LINK}>
              ppatrzyk/polska-geojson
            </a>{" "}
            na licencji MIT.
          </li>
          <li>
            Granice dzielnic Warszawy i ich kody tablic pochodzą z OpenStreetMap (
            <a href="https://www.openstreetmap.org/copyright" className={LINK}>
              © autorzy OpenStreetMap
            </a>
            , licencja ODbL). Granice uproszczono narzędziem mapshaper. Przypisanie kodów do
            dzielnic potwierdzają serwisy{" "}
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
            . W odróżnieniu od kodów pozostałych powiatów nie ma go w Wikiźródłach ani na
            Wikipedii.
          </li>
          <li>
            Ciekawostki o 380 powiatach pochodzą głównie z polskiej Wikipedii. Te o 18 dzielnicach
            Warszawy zebrano z serwisów dzielnicowych m.st. Warszawy, Wikipedii i portali
            historycznych, a każdą potwierdzają co najmniej dwa źródła. Żadna ciekawostka nie
            powstała bez źródła.
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
