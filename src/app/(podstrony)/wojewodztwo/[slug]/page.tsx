import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { andList, liczebnik, orList, powiatNazwa } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd, webPageJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import {
  dopelniacz,
  findWojewodztwoBySlug,
  getAllWojewodztwoSlugs,
  miejscownik,
  type WojewodztwoInfo,
} from "@/lib/wojewodztwa";
import Breadcrumbs from "@/components/Breadcrumbs";
import PowiatyMap from "@/components/PowiatyMap";
import { TabelaKodow } from "@/components/Tabele";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllWojewodztwoSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

/** "42 powiaty i 62 kody tablic": wspólne dla opisu i nagłówka. */
function liczby(w: WojewodztwoInfo): string {
  return `${liczebnik(w.powiaty.length, { one: "powiat", few: "powiaty", many: "powiatów" })} i ${liczebnik(w.kody.length, { one: "kod", few: "kody", many: "kodów" })} tablic`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const w = findWojewodztwoBySlug(slug);
  if (!w) return {};

  return pageMetadata({
    title: `Województwo ${w.nazwa}: tablice rejestracyjne na ${andList.format(w.litery)}`,
    description: `Tablice rejestracyjne w województwie ${miejscownik(w.nazwa)} zaczynają się na ${orList.format(w.litery)}. Województwo ma ${liczby(w)}: pełna lista z powiatami i mapa.`,
    path: `/wojewodztwo/${slug}`,
  });
}

export default async function WojewodztwoPage({ params }: PageProps) {
  const { slug } = await params;
  const w = findWojewodztwoBySlug(slug);
  if (!w) notFound();

  const nazwa = `Województwo ${w.nazwa}`;
  const jsonLd = webPageJsonLd(`/wojewodztwo/${slug}`, nazwa, {
    mainEntity: {
      "@type": "AdministrativeArea",
      name: nazwa,
      url: `${SITE_URL}/wojewodztwo/${slug}`,
      containedInPlace: { "@type": "Country", name: "Polska" },
      containsPlace: w.powiaty.map((powiat) => ({
        "@type": "AdministrativeArea",
        name: powiatNazwa(powiat),
        url: `${SITE_URL}/powiat/${powiatSlug(powiat)}`,
      })),
      additionalProperty: w.litery.map((litera) => ({
        "@type": "PropertyValue",
        name: "Litera tablicy rejestracyjnej",
        value: litera,
      })),
    },
  });
  const mapHeading = `Kody tablic na mapie województwa ${dopelniacz(w.nazwa)}`;

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Województwa", path: "/wojewodztwo" },
          { name: nazwa, path: `/wojewodztwo/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="page-columns">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col items-start gap-4">
            <h1 className="page-title">{nazwa}</h1>
            <p className="lead-text">
              Tablice rejestracyjne w województwie {miejscownik(w.nazwa)} zaczynają się na literę{" "}
              {orList.format(w.litery)}. Województwo ma {liczby(w)}.
            </p>
          </header>

          <section>
            <h2 className="section-title mb-1">Kody tablic rejestracyjnych</h2>
            <TabelaKodow kody={w.kody} />
          </section>
        </div>

        <section className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-6">
          <h2 className="section-title">{mapHeading}</h2>
          <PowiatyMap wojewodztwo={w.nazwa} ariaLabel={mapHeading} />
        </section>
      </div>
    </>
  );
}
