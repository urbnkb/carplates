import { powiaty } from "@/data/powiaty";
import type { Powiat } from "@/types/powiat";

export interface KodEntry {
  kod: string;
  powiat: Powiat;
}

const allKody: KodEntry[] = powiaty
  .flatMap((powiat) => powiat.kody.map((kod) => ({ kod, powiat })))
  .sort((a, b) => a.kod.localeCompare(b.kod));

const kodToPowiat = new Map<string, Powiat>(allKody.map(({ kod, powiat }) => [kod, powiat]));

export function getAllKody(): KodEntry[] {
  return allKody;
}

export function findPowiatByKod(kod: string): Powiat | null {
  return kodToPowiat.get(kod.toUpperCase()) ?? null;
}
