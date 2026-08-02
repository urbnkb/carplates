import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPowiatSlugs } from "@/lib/slug";
import { getAllKody } from "@/lib/kody";
import { getAllDzielnicaSlugs } from "@/lib/dzielnice";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/powiat`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/tablica`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/dzielnica`, changeFrequency: "monthly", priority: 0.5 },
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
