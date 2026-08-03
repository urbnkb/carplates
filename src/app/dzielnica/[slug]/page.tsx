import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { andList } from "@/lib/format";
import {
  dzielnicaSlug,
  findDzielnicaBySlug,
  getAllDzielnicaSlugs,
  getDzielniceForKod,
  warszawaPowiat,
} from "@/lib/dzielnice";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import Facts from "@/components/Facts";
import PlatePreview from "@/components/PlatePreview";
import ProductWindow from "@/components/ProductWindow";
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
      ? `, wspólnym z ${rodzenstwo.length === 1 ? "dzielnicą" : "dzielnicami"} ${andList(rodzenstwo.map((d) => d.nazwa))}`
      : "";

  return {
    title: `${dzielnica.nazwa} (Warszawa) — kod tablic ${dzielnica.kod}`,
    description: `${dzielnica.nazwa} to dzielnica Warszawy z kodem tablic rejestracyjnych ${dzielnica.kod}${wspolny}. Ciekawostki, mapa dzielnicy i pozostałe kody stolicy.`,
    alternates: { canonical: `/dzielnica/${slug}` },
  };
}

export default async function DzielnicaPage({ params }: PageProps) {
  const { slug } = await params;
  const dzielnica = findDzielnicaBySlug(slug);
  if (!dzielnica) notFound();

  const rodzenstwo = rodzenstwoKodu(slug);

  const jsonLd = {
    "@context": "https://schema.org",
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
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-14 sm:py-20">
        <Link href="/" className="self-start text-sm text-accent hover:underline">
          ← Powrót do wyszukiwarki
        </Link>

        <header className="text-center">
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            {dzielnica.nazwa}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-600 sm:text-lg">
            Dzielnica Warszawy, województwo {warszawaPowiat.wojewodztwo}
          </p>
        </header>

        <ProductWindow accent="location">
          <div className="flex w-full flex-col gap-8">
            <section className="flex w-full flex-col items-center gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
                Kod tablic rejestracyjnych
              </h2>
              <Link href={`/tablica/${dzielnica.kod}`}>
                <PlatePreview code={dzielnica.kod} />
              </Link>
              {rodzenstwo.length > 0 && (
                <p className="max-w-md text-center text-sm text-zinc-600">
                  Kod {dzielnica.kod} jest wspólny z{" "}
                  {rodzenstwo.length === 1 ? "dzielnicą" : "dzielnicami"}{" "}
                  {rodzenstwo.map((d, i) => (
                    <span key={d.geoId}>
                      {i > 0 && (i === rodzenstwo.length - 1 ? " i " : ", ")}
                      <Link
                        href={`/dzielnica/${dzielnicaSlug(d)}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {d.nazwa}
                      </Link>
                    </span>
                  ))}
                  , więc sama tablica nie wskazuje, z której z nich pochodzi pojazd.
                </p>
              )}
            </section>

            <div className="flex w-full max-w-xl flex-col gap-4 self-center neu-sunken rounded-2xl bg-well p-6">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
                Ciekawostki o dzielnicy {dzielnica.nazwa}
              </h2>
              <Facts
                ciekawostki={dzielnica.ciekawostki}
                verified={dzielnica.factsVerified}
                subject="tej dzielnicy"
              />
            </div>

            <RegionMap
              powiat={warszawaPowiat}
              dzielnice={[dzielnica]}
              heading={`Dzielnica ${dzielnica.nazwa} na mapie Warszawy`}
            />

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
              <Link
                href={`/powiat/${powiatSlug(warszawaPowiat)}`}
                className="text-accent hover:underline"
              >
                Wszystkie kody Warszawy →
              </Link>
              <Link
                href={`/tablica/${dzielnica.kod}`}
                className="text-accent hover:underline"
              >
                Zobacz stronę kodu {dzielnica.kod} →
              </Link>
              <Link href="/dzielnica" className="text-accent hover:underline">
                Wszystkie dzielnice →
              </Link>
            </div>
          </div>
        </ProductWindow>
      </main>
    </div>
  );
}
