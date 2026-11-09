import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/metadata";
import { DATA_UPDATED } from "@/lib/site";

export const metadata = pageMetadata({
  title: "O projekcie i źródła danych",
  description:
    "Skąd pochodzą kody tablic rejestracyjnych, granice powiatów i dzielnic oraz ciekawostki w serwisie. Licencje danych i data ich ostatniej zmiany.",
  path: "/o-projekcie",
});

const LINK = "link-accent";

export default function OProjekciePage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "O projekcie", path: "/o-projekcie" }]} />
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="page-title">O projekcie</h1>
        <p className="lead-text">
          To projekt edukacyjny: wpisujesz początkowe znaki polskiej tablicy rejestracyjnej,
          a strona pokazuje, z jakiego powiatu pochodzi pojazd. Prowadzi go urbnkb.
        </p>
      </header>

      <section className="body-text flex w-full max-w-2xl flex-col gap-3">
        <h2 className="section-title">Źródła danych</h2>
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

      <section className="body-text flex w-full max-w-2xl flex-col gap-3">
        <h2 className="section-title">Aktualność</h2>
        <p>Ostatnia zmiana danych: {DATA_UPDATED.label}.</p>
      </section>
    </>
  );
}
