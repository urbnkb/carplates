import { powiaty } from "@/data/powiaty";
import { liczebnik } from "@/lib/format";
import { serializeJsonLd, webPageJsonLd } from "@/lib/jsonLd";
import { getAllKody } from "@/lib/kody";
import { pageMetadata } from "@/lib/metadata";
import { DATA_UPDATED, SITE_NAME, SITE_URL } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SekcjeWojewodztw, SpisWojewodztw, TabelaKodow } from "@/components/Tabele";

const liczbaKodow = liczebnik(getAllKody().length, { one: "kod", few: "kody", many: "kodów" });
const OPIS = `Pełna lista: ${liczbaKodow} polskich tablic rejestracyjnych z powiatami, miastami i dzielnicami Warszawy, podzielona na 16 województw.`;

export const metadata = pageMetadata({
  title: "Kody tablic rejestracyjnych w Polsce",
  description: OPIS,
  path: "/tablica",
});

// Bez pola `license`: dane łączą kilka źródeł, a licencję zestawienia musi określić autor.
const JSON_LD = serializeJsonLd(
  webPageJsonLd("/tablica", "Kody tablic rejestracyjnych w Polsce", {
    mainEntity: {
      "@type": "Dataset",
      name: "Kody polskich tablic rejestracyjnych",
      description: OPIS,
      url: `${SITE_URL}/tablica`,
      inLanguage: "pl-PL",
      dateModified: DATA_UPDATED.iso,
      creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      isBasedOn: [
        "https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne",
        "https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce",
      ],
    },
  }),
);

export default function TablicaIndexPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Kody tablic", path: "/tablica" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="page-title">Kody tablic rejestracyjnych w Polsce</h1>
        <p className="lead-text">
          Polskie tablice rejestracyjne mają {liczbaKodow} przypisanych do {powiaty.length} powiatów
          i miast. Pierwsza litera kodu oznacza województwo, dlatego lista jest podzielona na 16
          województw.
        </p>
      </header>

      <SpisWojewodztw />
      <SekcjeWojewodztw tresc={(w) => <TabelaKodow kody={w.kody} />} />
    </>
  );
}
