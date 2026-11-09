import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dzielniceLabelForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { isMiasto, orList, powiatMiejscownik, powiatNazwa } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { findPowiatBySlug, getAllPowiatSlugs, wikipediaUrl } from "@/lib/slug";
import { serializeJsonLd, webPageJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import { miejscownik, wojewodztwoSlug } from "@/lib/wojewodztwa";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DzielniceGrid } from "@/components/DzielniceLinks";
import { FactsSection } from "@/components/Facts";
import PlatePreview from "@/components/PlatePreview";
import RegionMap from "@/components/RegionMap";
import Sasiedzi from "@/components/Sasiedzi";
import type { Powiat } from "@/types/powiat";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPowiatSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

/** "z kodem GDA" | "z kodami DW, DX lub VW". */
function kodyWZdaniu({ kody }: Powiat): string {
  return kody.length === 1 ? `z kodem ${kody[0]}` : `z kodami ${orList.format(kody)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const powiat = findPowiatBySlug(slug);
  if (!powiat) return {};

  const kody = `${powiat.kody.slice(0, 3).join(", ")}${powiat.kody.length > 3 ? "…" : ""}`;
  return pageMetadata({
    title: `${powiatNazwa(powiat)}: tablice ${kody}, woj. ${powiat.wojewodztwo}`,
    description: `Pojazdy zarejestrowane w ${powiatMiejscownik(powiat)} mają tablice ${kodyWZdaniu(powiat)}. Ciekawostki, mapa i kody sąsiednich powiatów.`,
    path: `/powiat/${slug}`,
  });
}

export default async function PowiatPage({ params }: PageProps) {
  const { slug } = await params;
  const powiat = findPowiatBySlug(slug);
  if (!powiat) notFound();

  const isWarszawa = powiat.geoId === WARSZAWA_GEO_ID;
  const nazwa = powiatNazwa(powiat);
  const title = `${nazwa}: tablice rejestracyjne`;
  const gdzie = powiatMiejscownik(powiat);

  const jsonLd = webPageJsonLd(`/powiat/${slug}`, title, {
    mainEntity: {
      "@type": "AdministrativeArea",
      name: nazwa,
      url: `${SITE_URL}/powiat/${slug}`,
      sameAs: wikipediaUrl(powiat),
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `Województwo ${powiat.wojewodztwo}`,
        url: `${SITE_URL}/wojewodztwo/${wojewodztwoSlug(powiat.wojewodztwo)}`,
      },
      additionalProperty: powiat.kody.map((kod) => ({
        "@type": "PropertyValue",
        name: "Kod tablicy rejestracyjnej",
        value: kod,
      })),
    },
  });

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Powiaty", path: "/powiat" },
          { name: nazwa, path: `/powiat/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="page-columns">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col items-start gap-4">
            <h1 className="page-title">{title}</h1>
            <p className="lead-text">
              Pojazdy zarejestrowane w {gdzie} mają tablice {kodyWZdaniu(powiat)}.{" "}
              {isMiasto(powiat) ? "Miasto leży" : "Powiat leży"} w województwie{" "}
              <Link href={`/wojewodztwo/${wojewodztwoSlug(powiat.wojewodztwo)}`} className="link-accent">
                {miejscownik(powiat.wojewodztwo)}
              </Link>
              .{isWarszawa && " Kody wskazują dzielnice miasta."}
            </p>
          </header>

          <section>
            <h2 className="section-title">
              {powiat.kody.length === 1 ? "Kod tablic" : "Kody tablic"}
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {powiat.kody.map((kod) => (
                <Link key={kod} href={`/tablica/${kod}`} className="flex flex-col items-center gap-1">
                  <PlatePreview code={kod} />
                  {isWarszawa && (
                    <span className="max-w-32 text-center text-xs text-zinc-600">
                      {dzielniceLabelForKod(kod)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          <div>
            <FactsSection title={`Ciekawostki o ${gdzie}`} powiat={powiat} />
            <a href={wikipediaUrl(powiat)} className="link-accent mt-3 inline-block text-sm">
              Więcej w Wikipedii →
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6">
          <RegionMap powiat={powiat} />
        </div>
      </div>

      {isWarszawa && (
        <section className="w-full">
          <h2 className="section-title mb-3">18 dzielnic Warszawy</h2>
          <DzielniceGrid />
        </section>
      )}

      <Sasiedzi
        powiat={powiat}
        title={`Z jakimi powiatami graniczy ${isMiasto(powiat) ? "to miasto" : "ten powiat"}?`}
      />
    </>
  );
}
