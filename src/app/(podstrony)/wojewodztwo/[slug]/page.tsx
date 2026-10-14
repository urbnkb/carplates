import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { regionLabel, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { andList, capitalize, liczebnik, orList } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import {
  findWojewodztwoBySlug,
  getAllWojewodztwoSlugs,
  miejscownik,
  type WojewodztwoInfo,
} from "@/lib/wojewodztwa";
import Breadcrumbs from "@/components/Breadcrumbs";
import GeoMap from "@/components/GeoMap";
import ProductWindow from "@/components/ProductWindow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllWojewodztwoSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

const H2 = "text-sm font-semibold tracking-wide text-zinc-600 uppercase";

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: nazwa,
    url: `${SITE_URL}/wojewodztwo/${slug}`,
    containedInPlace: { "@type": "Country", name: "Polska" },
    containsPlace: w.powiaty.map((powiat) => ({
      "@type": "AdministrativeArea",
      name: capitalize(powiat.nazwa),
      url: `${SITE_URL}/powiat/${powiatSlug(powiat)}`,
    })),
    additionalProperty: w.litery.map((litera) => ({
      "@type": "PropertyValue",
      name: "Litera tablicy rejestracyjnej",
      value: litera,
    })),
  };
  const mapHeading = `${nazwa} na mapie Polski`;

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
      <header className="text-center">
        <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          {nazwa}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-600 sm:text-lg">
          Tablice rejestracyjne w województwie {miejscownik(w.nazwa)} zaczynają się na literę{" "}
          {orList.format(w.litery)}. Województwo ma {liczby(w)}.
        </p>
      </header>

      <ProductWindow>
        <div className="flex w-full flex-col gap-8">
          <section className="flex w-full flex-col gap-3">
            <h2 className={`${H2} text-center`}>Kody tablic rejestracyjnych</h2>
            <ul className="w-full gap-x-6 sm:columns-2">
              {w.kody.map(({ kod, powiat }) => (
                <li key={kod} className="flex break-inside-avoid gap-3 py-1 text-sm">
                  <Link href={`/tablica/${kod}`} className="w-10 shrink-0 font-semibold text-accent hover:underline">
                    {kod}
                  </Link>
                  <Link href={`/powiat/${powiatSlug(powiat)}`} className="text-zinc-600 hover:underline">
                    {powiat.geoId === WARSZAWA_GEO_ID ? regionLabel(powiat, kod) : capitalize(powiat.nazwa)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex w-full flex-col items-center gap-3">
            <h2 className={H2}>{mapHeading}</h2>
            <GeoMap map="polska" highlightedIds={w.powiaty.map((p) => p.geoId)} ariaLabel={mapHeading} />
          </section>
        </div>
      </ProductWindow>
    </>
  );
}
