import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { capitalize } from "@/lib/format";
import { dzielnice } from "@/data/dzielnice";
import { dzielnicaSlug, dzielniceLabelForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { findPowiatBySlug, getAllPowiatSlugs } from "@/lib/slug";
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
  return getAllPowiatSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const powiat = findPowiatBySlug(slug);
  if (!powiat) return {};

  const label = `${capitalize(powiat.nazwa)} (woj. ${powiat.wojewodztwo})`;
  const dzielniceNote =
    powiat.geoId === WARSZAWA_GEO_ID ? " Każdy kod odpowiada innej dzielnicy miasta." : "";
  return {
    title: `${label} — kody tablic rejestracyjnych`,
    description: `${label}: tablice rejestracyjne ${powiat.kody.join(", ")}.${dzielniceNote} Ciekawostki i informacje o powiecie.`,
    alternates: { canonical: `/powiat/${slug}` },
  };
}

export default async function PowiatPage({ params }: PageProps) {
  const { slug } = await params;
  const powiat = findPowiatBySlug(slug);
  if (!powiat) notFound();

  const isWarszawa = powiat.geoId === WARSZAWA_GEO_ID;
  const dzielniceAlfabetycznie = isWarszawa
    ? [...dzielnice].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: capitalize(powiat.nazwa),
    url: `${SITE_URL}/powiat/${slug}`,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: `Województwo ${powiat.wojewodztwo}`,
    },
    additionalProperty: powiat.kody.map((kod) => ({
      "@type": "PropertyValue",
      name: "Kod tablicy rejestracyjnej",
      value: kod,
    })),
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
            {capitalize(powiat.nazwa)}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-600 sm:text-lg">
            Województwo {powiat.wojewodztwo}
          </p>
        </header>

        <ProductWindow accent="location">
          <div className="flex w-full flex-col gap-8">
            <section className="flex w-full flex-col items-center gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
                Kody tablic rejestracyjnych
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
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

            {isWarszawa && (
              <section className="flex w-full flex-col items-center gap-3">
                <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
                  18 dzielnic Warszawy
                </h2>
                <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {dzielniceAlfabetycznie.map((d) => (
                    <li key={d.geoId}>
                      <Link
                        href={`/dzielnica/${dzielnicaSlug(d)}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {d.nazwa}
                      </Link>{" "}
                      <span className="font-mono text-xs text-zinc-600">{d.kod}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex w-full max-w-xl flex-col gap-4 self-center neu-sunken rounded-2xl bg-well p-6">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
                Ciekawostki
              </h2>
              <Facts ciekawostki={powiat.ciekawostki} verified={powiat.factsVerified} />
            </div>

            <RegionMap powiat={powiat} />
          </div>
        </ProductWindow>
      </main>
    </div>
  );
}
