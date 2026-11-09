import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { dzielnicaSlug, getDzielniceForKod, regionLabel, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import {
  andList,
  powiatDopelniacz,
  powiatKrotko,
  powiatMianownik,
  powiatMiejscownik,
  powiatNazwa,
} from "@/lib/format";
import { findPowiatByKod, getAllKody } from "@/lib/kody";
import { pageMetadata } from "@/lib/metadata";
import { powiatSlug, wikipediaUrl } from "@/lib/slug";
import { serializeJsonLd, webPageJsonLd } from "@/lib/jsonLd";
import { DATA_UPDATED, SITE_URL } from "@/lib/site";
import { miejscownik, wojewodztwoSlug } from "@/lib/wojewodztwa";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DzielniceLinks } from "@/components/DzielniceLinks";
import PlatePreview from "@/components/PlatePreview";
import RegionMap from "@/components/RegionMap";
import Sasiedzi from "@/components/Sasiedzi";
import type { Powiat } from "@/types/powiat";

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
  const nazwy = andList.format(dzielnice.map((d) => d.nazwa));

  // Odpowiedź stoi w samym tytule: to pod nią ktoś wpisuje kod w wyszukiwarkę,
  // a kody Warszawy dostają dzielnicę ("WH jaka dzielnica").
  const title =
    dzielnice.length === 1
      ? `Tablica ${canonicalKod}: dzielnica ${nazwy}, Warszawa`
      : dzielnice.length > 1
        ? `Tablica ${canonicalKod}: Warszawa, dzielnice ${nazwy}`
        : `Tablica ${canonicalKod}: ${powiatKrotko(powiat)}, woj. ${powiat.wojewodztwo}`;

  const skad =
    dzielnice.length === 1
      ? `z dzielnicy ${nazwy} w Warszawie`
      : dzielnice.length > 1
        ? `z Warszawy i jest wspólna dla dzielnic ${nazwy}`
        : `z ${powiatDopelniacz(powiat)} w województwie ${miejscownik(powiat.wojewodztwo)}`;

  return pageMetadata({
    title,
    description: `Tablica rejestracyjna ${canonicalKod} pochodzi ${skad}. Co oznaczają jej litery, podobne kody i kody sąsiednich powiatów.`,
    path: `/tablica/${canonicalKod}`,
  });
}

/** "powiat gdański" | "miasto Wrocław" | "Warszawa (Mokotów)". */
function opisKodu(kod: string, powiat: Powiat): string {
  return powiat.geoId === WARSZAWA_GEO_ID ? regionLabel(powiat, kod) : powiatMianownik(powiat);
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
  const isWarszawa = dzielnice.length > 0;

  const powiatPath = `/powiat/${powiatSlug(powiat)}`;
  const wojewodztwoPath = `/wojewodztwo/${wojewodztwoSlug(powiat.wojewodztwo)}`;
  const title = `Skąd jest tablica ${canonicalKod}?`;

  // Kody zaczynające się tak samo (GD i GDA) to najczęstsza pomyłka przy czytaniu tablicy.
  const podobne = getAllKody().filter(
    ({ kod: inny }) =>
      inny !== canonicalKod && (inny.startsWith(canonicalKod) || canonicalKod.startsWith(inny)),
  );

  // Kilka kodów jednego powiatu nie powinno powielać tej samej ciekawostki.
  const zrodloFaktu = single ?? powiat;
  const fakt = zrodloFaktu.ciekawostki[powiat.kody.indexOf(canonicalKod) % zrodloFaktu.ciekawostki.length];
  const oCzymFakt = single
    ? `dzielnicy ${single.nazwa}`
    : isWarszawa
      ? "Warszawie"
      : powiatMiejscownik(powiat);
  const wiecejPath = single ? `/dzielnica/${dzielnicaSlug(single)}` : powiatPath;

  const litera = canonicalKod[0];
  const reszta = canonicalKod.slice(1);

  const wojewodztwoPlace = {
    "@type": "AdministrativeArea",
    name: `Województwo ${powiat.wojewodztwo}`,
    url: `${SITE_URL}${wojewodztwoPath}`,
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
        name: powiatNazwa(powiat),
        sameAs: wikipediaUrl(powiat),
        containedInPlace: wojewodztwoPlace,
      };

  const jsonLd = webPageJsonLd(`/tablica/${canonicalKod}`, title, {
    about,
    mainEntity: {
      "@type": "DefinedTerm",
      name: canonicalKod,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Kody polskich tablic rejestracyjnych",
        url: `${SITE_URL}/tablica`,
      },
      description: single
        ? `Kod tablicy rejestracyjnej przypisany do dzielnicy ${single.nazwa} w Warszawie.`
        : dzielnice.length > 1
          ? `Kod tablicy rejestracyjnej wspólny dla dzielnic Warszawy: ${andList.format(dzielnice.map((d) => d.nazwa))}.`
          : `Kod tablicy rejestracyjnej przypisany do ${powiatDopelniacz(powiat)}.`,
    },
  });

  const warszawaLink = (
    <Link href={powiatPath} className="link-accent">
      Warszawy
    </Link>
  );
  const wojewodztwoLink = (
    <Link href={wojewodztwoPath} className="link-accent">
      {miejscownik(powiat.wojewodztwo)}
    </Link>
  );

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Kody tablic", path: "/tablica" },
          { name: `Tablica ${canonicalKod}`, path: `/tablica/${canonicalKod}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="page-columns">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col items-start gap-5">
            <PlatePreview code={canonicalKod} />
            <h1 className="page-title">{title}</h1>
            <p className="lead-text">
              {single ? (
                <>
                  Tablica {canonicalKod} pochodzi z {warszawaLink}, z dzielnicy{" "}
                  <Link href={wiecejPath} className="link-accent">
                    {single.nazwa}
                  </Link>
                  , w województwie {wojewodztwoLink}.
                </>
              ) : isWarszawa ? (
                <>
                  Tablica {canonicalKod} pochodzi z {warszawaLink}. Kod jest wspólny dla dzielnic{" "}
                  <DzielniceLinks items={dzielnice} />, więc sama tablica nie wskazuje, z której z
                  nich pochodzi pojazd.
                </>
              ) : (
                <>
                  Tablica {canonicalKod} pochodzi z{" "}
                  <Link href={powiatPath} className="link-accent">
                    {powiatDopelniacz(powiat)}
                  </Link>{" "}
                  w województwie {wojewodztwoLink}.
                </>
              )}
            </p>
          </header>

          <section>
            <h2 className="section-title">Co oznaczają litery {canonicalKod}?</h2>
            <p className="body-text mt-2">
              Pierwsza litera, <strong>{litera}</strong>, oznacza województwo{" "}
              <Link href={wojewodztwoPath} className="link-accent">
                {powiat.wojewodztwo}
              </Link>
              . {reszta.length > 1 ? "Kolejne litery" : "Druga litera"}, <strong>{reszta}</strong>,{" "}
              {reszta.length > 1 ? "wskazują" : "wskazuje"}{" "}
              {single
                ? `dzielnicę ${single.nazwa} w Warszawie`
                : isWarszawa
                  ? "kilka dzielnic Warszawy"
                  : powiatMianownik(powiat)}
              .
            </p>
          </section>

          {podobne.length > 0 && (
            <section>
              <h2 className="section-title">
                {podobne.length === 1
                  ? `Czym różni się ${canonicalKod} od ${podobne[0].kod}?`
                  : `Kody podobne do ${canonicalKod}`}
              </h2>
              <p className="body-text mt-2">
                {canonicalKod} to {opisKodu(canonicalKod, powiat)}, a{" "}
                {podobne.map(({ kod: inny, powiat: innyPowiat }, i) => (
                  <span key={inny}>
                    {i > 0 && (i === podobne.length - 1 ? " i " : ", ")}
                    <Link href={`/tablica/${inny}`} className="link-accent font-mono">
                      {inny}
                    </Link>{" "}
                    to {opisKodu(inny, innyPowiat)}
                  </span>
                ))}
                . Po kodzie na tablicy następuje wyróżnik pojazdu, który także może zawierać litery,
                dlatego kody zaczynające się tak samo łatwo pomylić.
              </p>
            </section>
          )}

          <section>
            <h2 className="section-title">Ciekawostka o {oCzymFakt}</h2>
            <p className="body-text mt-2">{fakt}</p>
            <Link href={wiecejPath} className="link-accent mt-2 inline-block">
              Więcej o {oCzymFakt} →
            </Link>
          </section>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6">
          <RegionMap powiat={powiat} kod={canonicalKod} />
        </div>
      </div>

      <Sasiedzi powiat={powiat} title="Kody sąsiednich powiatów" />

      <p className="text-sm text-zinc-600">
        {isWarszawa ? (
          <>
            Źródła przypisania kodów do dzielnic opisuje strona{" "}
            <Link href="/o-projekcie" className="link-accent">
              O projekcie
            </Link>
            .
          </>
        ) : (
          <>
            Źródło kodu:{" "}
            <a href="https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne" className="link-accent">
              Wikiźródła, „Polskie tablice rejestracyjne”
            </a>
            .
          </>
        )}{" "}
        Stan danych: {DATA_UPDATED.label}.
      </p>
    </>
  );
}
