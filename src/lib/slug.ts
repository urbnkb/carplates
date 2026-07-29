import { powiaty } from "@/data/powiaty";
import { bareName } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Bazowy slug (sama nazwa) koliduje dla kilku par powiatów o tej samej
 * nazwie w różnych województwach (np. dwa "powiat brzeski"). Dla obu stron
 * takiej kolizji doklejamy slug województwa, żeby każdy powiat miał
 * stabilny, przewidywalny i unikalny URL.
 */
const baseSlugCounts = new Map<string, number>();
for (const powiat of powiaty) {
  const base = slugify(bareName(powiat.nazwa));
  baseSlugCounts.set(base, (baseSlugCounts.get(base) ?? 0) + 1);
}

function computeSlug(powiat: Powiat): string {
  const base = slugify(bareName(powiat.nazwa));
  if ((baseSlugCounts.get(base) ?? 0) > 1) {
    return `${base}-${slugify(powiat.wojewodztwo)}`;
  }
  return base;
}

const slugToPowiat = new Map<string, Powiat>();
const powiatToSlug = new Map<number, string>();
for (const powiat of powiaty) {
  const slug = computeSlug(powiat);
  if (slugToPowiat.has(slug)) {
    throw new Error(
      `Kolizja slugów powiatów: "${slug}" wskazuje jednocześnie na geoId ${slugToPowiat.get(slug)?.geoId} i ${powiat.geoId}.`,
    );
  }
  slugToPowiat.set(slug, powiat);
  powiatToSlug.set(powiat.geoId, slug);
}

export function powiatSlug(powiat: Powiat): string {
  return powiatToSlug.get(powiat.geoId) ?? computeSlug(powiat);
}

export function findPowiatBySlug(slug: string): Powiat | null {
  return slugToPowiat.get(slug) ?? null;
}

export function getAllPowiatSlugs(): string[] {
  return [...slugToPowiat.keys()];
}
