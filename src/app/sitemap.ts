import type { MetadataRoute } from "next";
import { DATA_UPDATED, SITE_URL } from "@/lib/site";
import { getAllPowiatSlugs } from "@/lib/slug";
import { getAllKody } from "@/lib/kody";
import { getAllDzielnicaSlugs } from "@/lib/dzielnice";
import { getAllWojewodztwoSlugs } from "@/lib/wojewodztwa";

// Bez changeFrequency i priority: Google je ignoruje. Liczy się prawdziwe lastModified.
export default function sitemap(): MetadataRoute.Sitemap {
  const sciezki = [
    "",
    "/wojewodztwo",
    "/powiat",
    "/tablica",
    "/dzielnica",
    "/o-projekcie",
    ...getAllWojewodztwoSlugs().map((slug) => `/wojewodztwo/${slug}`),
    ...getAllDzielnicaSlugs().map((slug) => `/dzielnica/${slug}`),
    ...getAllPowiatSlugs().map((slug) => `/powiat/${slug}`),
    ...getAllKody().map(({ kod }) => `/tablica/${kod}`),
  ];
  return sciezki.map((sciezka) => ({
    url: `${SITE_URL}${sciezka}`,
    lastModified: DATA_UPDATED.iso,
  }));
}
