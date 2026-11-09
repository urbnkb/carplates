import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { andList } from "@/lib/format";
import {
  findDzielnicaBySlug,
  getAllDzielnicaSlugs,
  getDzielniceForKod,
  warszawaPowiat,
} from "@/lib/dzielnice";
import { pageMetadata } from "@/lib/metadata";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd, webPageJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import { miejscownik } from "@/lib/wojewodztwa";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DzielniceLinks } from "@/components/DzielniceLinks";
import { FactsSection } from "@/components/Facts";
import PlatePreview from "@/components/PlatePreview";
import RegionMap from "@/components/RegionMap";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllDzielnicaSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

/** Pozostałe dzielnice dzielące ten sam kod — dla WW dwie, dla WX jedna, zwykle żadna. */
function rodzenstwoKodu(slug: string) {
  const dzielnica = findDzielnicaBySlug(slug);
  if (!dzielnica) return [];
  return getDzielniceForKod(dzielnica.kod).filter((d) => d.geoId !== dzielnica.geoId);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dzielnica = findDzielnicaBySlug(slug);
  if (!dzielnica) return {};

  const rodzenstwo = rodzenstwoKodu(slug);
  const wspolny =
    rodzenstwo.length > 0
      ? `, wspólnym z ${rodzenstwo.length === 1 ? "dzielnicą" : "dzielnicami"} ${andList.format(rodzenstwo.map((d) => d.nazwa))}`
      : "";

  return pageMetadata({
    title: `${dzielnica.nazwa} (Warszawa): kod tablic ${dzielnica.kod}`,
    description: `${dzielnica.nazwa} to dzielnica Warszawy z kodem tablic rejestracyjnych ${dzielnica.kod}${wspolny}. Ciekawostki, mapa dzielnicy i pozostałe kody stolicy.`,
    path: `/dzielnica/${slug}`,
  });
}

export default async function DzielnicaPage({ params }: PageProps) {
  const { slug } = await params;
  const dzielnica = findDzielnicaBySlug(slug);
  if (!dzielnica) notFound();

  const rodzenstwo = rodzenstwoKodu(slug);

  const jsonLd = webPageJsonLd(`/dzielnica/${slug}`, `${dzielnica.nazwa}: dzielnica Warszawy`, {
    mainEntity: {
      "@type": "AdministrativeArea",
      name: dzielnica.nazwa,
      url: `${SITE_URL}/dzielnica/${slug}`,
      containedInPlace: {
        "@type": "City",
        name: "Warszawa",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: `Województwo ${warszawaPowiat.wojewodztwo}`,
        },
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Kod tablicy rejestracyjnej",
          value: dzielnica.kod,
        },
      ],
    },
  });

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Dzielnice Warszawy", path: "/dzielnica" },
          { name: dzielnica.nazwa, path: `/dzielnica/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="page-columns">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col items-start gap-5">
            <Link href={`/tablica/${dzielnica.kod}`}>
              <PlatePreview code={dzielnica.kod} />
            </Link>
            <h1 className="page-title">{dzielnica.nazwa}</h1>
            <p className="lead-text">
              {dzielnica.nazwa} to dzielnica Warszawy w województwie{" "}
              {miejscownik(warszawaPowiat.wojewodztwo)}. Pojazdy zarejestrowane w tej dzielnicy mają
              tablice z kodem {dzielnica.kod}.
              {rodzenstwo.length > 0 && (
                <>
                  {" "}
                  Kod jest wspólny z {rodzenstwo.length === 1 ? "dzielnicą" : "dzielnicami"}{" "}
                  <DzielniceLinks items={rodzenstwo} />, więc sama tablica nie wskazuje, z której z
                  nich pochodzi pojazd.
                </>
              )}
            </p>
          </header>

          <FactsSection
            title={`Ciekawostki o dzielnicy ${dzielnica.nazwa}`}
            powiat={warszawaPowiat}
            dzielnica={dzielnica}
          />

          <nav aria-label="Powiązane strony" className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href={`/powiat/${powiatSlug(warszawaPowiat)}`} className="link-accent">
              Wszystkie kody Warszawy →
            </Link>
            <Link href={`/tablica/${dzielnica.kod}`} className="link-accent">
              Strona kodu {dzielnica.kod} →
            </Link>
            <Link href="/dzielnica" className="link-accent">
              Wszystkie dzielnice →
            </Link>
          </nav>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6">
          <RegionMap powiat={warszawaPowiat} dzielnice={[dzielnica]} />
        </div>
      </div>
    </>
  );
}
