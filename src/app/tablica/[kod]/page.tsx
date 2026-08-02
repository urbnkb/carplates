import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { bareName, capitalize } from "@/lib/format";
import { findPowiatByKod, getAllKody } from "@/lib/kody";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import PowiatFacts from "@/components/PowiatFacts";
import PlatePreview from "@/components/PlatePreview";
import ProductWindow from "@/components/ProductWindow";
import RegionMap from "@/components/RegionMap";

interface PageProps {
  params: Promise<{ kod: string }>;
}

export function generateStaticParams() {
  return getAllKody().map(({ kod }) => ({ kod }));
}

// dynamicParams pozostaje domyślnie true (w przeciwieństwie do /powiat/[slug]):
// pozwala obsłużyć niekanoniczny wielkością liter kod (np. "/tablica/dj") i
// przekierować na stałe do kanonicznego URL-a, zamiast zwracać 404.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kod } = await params;
  const powiat = findPowiatByKod(kod);
  if (!powiat) return {};

  const canonicalKod = kod.toUpperCase();
  return {
    title: `Tablica ${canonicalKod} — skąd jest ta rejestracja?`,
    description: `Tablica rejestracyjna ${canonicalKod} należy do powiatu ${bareName(powiat.nazwa)} (woj. ${powiat.wojewodztwo}).`,
    alternates: { canonical: `/tablica/${canonicalKod}` },
  };
}

export default async function TablicaPage({ params }: PageProps) {
  const { kod } = await params;
  const canonicalKod = kod.toUpperCase();
  const powiat = findPowiatByKod(canonicalKod);
  if (!powiat) notFound();

  if (kod !== canonicalKod) {
    permanentRedirect(`/tablica/${canonicalKod}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Tablica ${canonicalKod} — powiat ${bareName(powiat.nazwa)}`,
    url: `${SITE_URL}/tablica/${canonicalKod}`,
    about: {
      "@type": "AdministrativeArea",
      name: capitalize(powiat.nazwa),
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `Województwo ${powiat.wojewodztwo}`,
      },
    },
    mainEntity: {
      "@type": "DefinedTerm",
      name: canonicalKod,
      description: `Kod tablicy rejestracyjnej przypisany do powiatu ${bareName(powiat.nazwa)}.`,
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-14 sm:py-20">
        <Link href="/" className="self-start text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← Powrót do wyszukiwarki
        </Link>

        <header className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Tablica {canonicalKod}
          </h1>
          <PlatePreview code={canonicalKod} />
          <p className="mx-auto max-w-md text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Pochodzi z powiatu{" "}
            <Link href={`/powiat/${powiatSlug(powiat)}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {bareName(powiat.nazwa)}
            </Link>{" "}
            (woj. {powiat.wojewodztwo}).
          </p>
        </header>

        <ProductWindow>
          <div className="flex w-full max-w-xl flex-col gap-4 self-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Ciekawostki o powiecie {bareName(powiat.nazwa)}
            </h2>
            <PowiatFacts powiat={powiat} />
          </div>

          <RegionMap powiat={powiat} kod={canonicalKod} />
        </ProductWindow>
      </main>
    </div>
  );
}
