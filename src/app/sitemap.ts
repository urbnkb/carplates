import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPowiatSlugs } from "@/lib/slug";
import { getAllKody } from "@/lib/kody";
import { getAllDzielnicaSlugs } from "@/lib/dzielnice";
import { getAllWojewodztwoSlugs } from "@/lib/wojewodztwa";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/wojewodztwo`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/powiat`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/tablica`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/dzielnica`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/o-projekcie`, changeFrequency: "yearly", priority: 0.3 },
    ...getAllWojewodztwoSlugs().map((slug) => ({
      url: `${SITE_URL}/wojewodztwo/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllDzielnicaSlugs().map((slug) => ({
      url: `${SITE_URL}/dzielnica/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllPowiatSlugs().map((slug) => ({
      url: `${SITE_URL}/powiat/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllKody().map(({ kod }) => ({
      url: `${SITE_URL}/tablica/${kod}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
