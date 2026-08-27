import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

interface PageMeta {
  title: string;
  description: string;
  /** Ścieżka kanoniczna, np. "/powiat/augustowski" — metadataBase z layoutu robi z niej absolut. */
  path: string;
}

/**
 * Komplet metadanych podstrony. Powstał, bo scalanie metadanych w Next jest
 * *płytkie*: segment, który nie ustawi własnego `openGraph`, dziedziczy cały
 * blok z layoutu razem z `og:url` (zob. „Merging" w
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md).
 * Wszystkie podstrony miały więc w podglądzie udostępniania tytuł, opis i adres
 * strony głównej — sprzeczny z ich własnym `canonical`.
 *
 * Blok `openGraph` trzeba podać w całości, bo nadpisuje rodzica: stąd
 * powtórzone `type`, `locale`, `siteName` i obrazek z OG_IMAGE — bez niego
 * podstrony wychodzą z builda bez `og:image`. Sufiks tytułu doklejamy ręcznie,
 * bo `title.template` z layoutu działa tylko na `<title>` i nie dotyczy
 * `openGraph.title`.
 */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
