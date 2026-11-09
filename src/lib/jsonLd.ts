import { DATA_UPDATED, SITE_NAME, SITE_URL, WEBSITE_ID } from "@/lib/site";

/** Serializuje dane do bezpiecznego wstrzyknięcia w <script type="application/ld+json">. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Obwoluta WebPage: przypina treść strony do serwisu i podaje datę ostatniej zmiany. */
export function webPageJsonLd(path: string, name: string, tresc: object) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}${path}`,
    name,
    inLanguage: "pl-PL",
    dateModified: DATA_UPDATED.iso,
    isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: SITE_URL },
    ...tresc,
  };
}
