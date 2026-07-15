"use client";

import { bareName, capitalize } from "@/lib/format";
import type { Powiat } from "@/types/powiat";

interface LocationSuggestionsProps {
  suggestions: Powiat[];
  activeGeoId?: number | null;
  onSelect: (powiat: Powiat) => void;
}

export default function LocationSuggestions({
  suggestions,
  activeGeoId,
  onSelect,
}: LocationSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-2">
      {suggestions.map((powiat) => {
        const isActive = powiat.geoId === activeGeoId;
        return (
          <button
            key={powiat.geoId}
            type="button"
            onClick={() => onSelect(powiat)}
            className={
              isActive
                ? "rounded-full border border-emerald-700 bg-emerald-700 px-3 py-1 text-xs font-medium text-white"
                : "rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            }
          >
            <span className="font-semibold">{capitalize(bareName(powiat.nazwa))}</span>
            <span className="opacity-70"> — {powiat.wojewodztwo}</span>
          </button>
        );
      })}
    </div>
  );
}
