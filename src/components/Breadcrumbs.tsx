import Link from "next/link";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";

interface Crumb {
  name: string;
  /** Ścieżka kanoniczna, np. "/tablica/WA". */
  path: string;
}

/**
 * Okruszki podstrony: widoczna ścieżka i ten sam ślad jako BreadcrumbList.
 * "Strona główna" dokleja się sama; ostatni element to bieżąca strona.
 */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const crumbs = [{ name: "Strona główna", path: "/" }, ...trail];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.path === "/" ? SITE_URL : `${SITE_URL}${crumb.path}`,
    })),
  };

  return (
    <nav aria-label="Okruszki" className="self-start text-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-zinc-600">
        {crumbs.map((crumb, i) =>
          i < crumbs.length - 1 ? (
            <li key={crumb.path} className="flex items-center gap-2">
              <Link href={crumb.path} className="text-accent hover:underline">
                {crumb.name}
              </Link>
              <span aria-hidden="true">›</span>
            </li>
          ) : (
            <li key={crumb.path} aria-current="page">
              {crumb.name}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
