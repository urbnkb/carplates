import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { andList, bareName, capitalize } from "@/lib/format";
import { dzielnicaSlug, getDzielniceForKod } from "@/lib/dzielnice";
import { findPowiatByKod, getAllKody } from "@/lib/kody";
import { powiatSlug } from "@/lib/slug";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import Facts from "@/components/Facts";
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
  const dzielnice = getDzielniceForKod(canonicalKod);
  const nazwy = andList(dzielnice.map((d) => d.nazwa));

  // Kody warszawskie dostają dzielnicę wprost w tytule — to jest realne zapytanie
  // wpisywane w wyszukiwarkę ("WH jaka dzielnica"), a wszystkie 15 kodów Warszawy
  // miało dotąd identyczny, nieodróżnialny tytuł.
  const title =
    dzielnice.length === 1
      ? `Tablica ${canonicalKod} — dzielnica ${nazwy} w Warszawie`
      : dzielnice.length > 1
        ? `Tablica ${canonicalKod} — dzielnice Warszawy: ${nazwy}`
        : `Tablica ${canonicalKod} — skąd jest ta rejestracja?`;

  const description =
    dzielnice.length === 1
      ? `Tablica rejestracyjna ${canonicalKod} należy do dzielnicy ${nazwy} w Warszawie (woj. ${powiat.wojewodztwo}).`
      : dzielnice.length > 1
        ? `Tablica rejestracyjna ${canonicalKod} jest wspólna dla dzielnic Warszawy: ${nazwy} (woj. ${powiat.wojewodztwo}).`
        : `Tablica rejestracyjna ${canonicalKod} należy do powiatu ${bareName(powiat.nazwa)} (woj. ${powiat.wojewodztwo}).`;

  return { title, description, alternates: { canonical: `/tablica/${canonicalKod}` } };
}

export default async function TablicaPage({ params }: PageProps) {
  const { kod } = await params;
  const canonicalKod = kod.toUpperCase();
  const powiat = findPowiatByKod(canonicalKod);
  if (!powiat) notFound();

  if (kod !== canonicalKod) {
    permanentRedirect(`/tablica/${canonicalKod}`);
  }

  const dzielnice = getDzielniceForKod(canonicalKod);
  const single = dzielnice.length === 1 ? dzielnice[0] : null;

  const wojewodztwoPlace = {
    "@type": "AdministrativeArea",
    name: `Województwo ${powiat.wojewodztwo}`,
  };
  // Dla kodu współdzielonego (WW, WX) świadomie nie wskazujemy dzielnicy —
  // sam kod jej nie rozstrzyga, więc `about` zostaje na poziomie miasta.
  const about = single
    ? {
        "@type": "AdministrativeArea",
        name: single.nazwa,
        containedInPlace: {
          "@type": "City",
          name: "Warszawa",
          containedInPlace: wojewodztwoPlace,
        },
      }
    : {
        "@type": "AdministrativeArea",
        name: capitalize(powiat.nazwa),
        containedInPlace: wojewodztwoPlace,
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: single
      ? `Tablica ${canonicalKod} — Warszawa, dzielnica ${single.nazwa}`
      : `Tablica ${canonicalKod} — powiat ${bareName(powiat.nazwa)}`,
    url: `${SITE_URL}/tablica/${canonicalKod}`,
    about,
    mainEntity: {
      "@type": "DefinedTerm",
      name: canonicalKod,
      description: single
        ? `Kod tablicy rejestracyjnej przypisany do dzielnicy ${single.nazwa} w Warszawie.`
        : dzielnice.length > 1
          ? `Kod tablicy rejestracyjnej wspólny dla dzielnic Warszawy: ${andList(dzielnice.map((d) => d.nazwa))}.`
          : `Kod tablicy rejestracyjnej przypisany do powiatu ${bareName(powiat.nazwa)}.`,
    },
  };

  const warszawaLink = (
    <Link
      href={`/powiat/${powiatSlug(powiat)}`}
      className="font-medium text-accent hover:underline"
    >
      Warszawy
    </Link>
  );

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

        <header className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            Tablica {canonicalKod}
          </h1>
          <PlatePreview code={canonicalKod} />
          <p className="mx-auto max-w-md text-base text-zinc-600 sm:text-lg">
            {single ? (
              <>
                Pochodzi z {warszawaLink}, z dzielnicy{" "}
                <Link
                  href={`/dzielnica/${dzielnicaSlug(single)}`}
                  className="font-medium text-accent hover:underline"
                >
                  {single.nazwa}
                </Link>{" "}
                (woj. {powiat.wojewodztwo}).
              </>
            ) : dzielnice.length > 1 ? (
              <>
                Pochodzi z {warszawaLink} — kod {canonicalKod} jest wspólny dla dzielnic{" "}
                {dzielnice.map((d, i) => (
                  <span key={d.geoId}>
                    {i > 0 && (i === dzielnice.length - 1 ? " i " : ", ")}
                    <Link
                      href={`/dzielnica/${dzielnicaSlug(d)}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {d.nazwa}
                    </Link>
                  </span>
                ))}
                , więc sama tablica nie wskazuje, z której z nich pochodzi pojazd.
              </>
            ) : (
              <>
                Pochodzi z powiatu{" "}
                <Link
                  href={`/powiat/${powiatSlug(powiat)}`}
                  className="font-medium text-accent hover:underline"
                >
                  {bareName(powiat.nazwa)}
                </Link>{" "}
                (woj. {powiat.wojewodztwo}).
              </>
            )}
          </p>
        </header>

        <ProductWindow accent="plate">
          <div className="flex w-full max-w-xl flex-col gap-4 self-center neu-sunken rounded-2xl bg-well p-6">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">
              {single
                ? `Ciekawostki o dzielnicy ${single.nazwa}`
                : dzielnice.length > 1
                  ? "Ciekawostki o Warszawie"
                  : `Ciekawostki o powiecie ${bareName(powiat.nazwa)}`}
            </h2>
            {single ? (
              <Facts
                ciekawostki={single.ciekawostki}
                verified={single.factsVerified}
                subject="tej dzielnicy"
              />
            ) : (
              <Facts ciekawostki={powiat.ciekawostki} verified={powiat.factsVerified} />
            )}
          </div>

          <RegionMap powiat={powiat} kod={canonicalKod} />
        </ProductWindow>
      </main>
    </div>
  );
}
