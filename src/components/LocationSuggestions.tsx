"use client";

import { bareName, capitalize } from "@/lib/format";
import { locationTargetKey, type LocationTarget } from "@/lib/matchLocation";

interface LocationSuggestionsProps {
  suggestions: LocationTarget[];
  activeKey?: string | null;
  onSelect: (target: LocationTarget) => void;
}

export default function LocationSuggestions({
  suggestions,
  activeKey,
  onSelect,
}: LocationSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-2">
      {suggestions.map((target) => {
        const key = locationTargetKey(target);
        const isActive = key === activeKey;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(target)}
            className={
              isActive
                ? "rounded-full border border-emerald-700 bg-emerald-700 px-3 py-1 text-xs font-medium text-white"
                : "rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            }
          >
            {target.dzielnica ? (
              <>
                <span className="font-semibold">{target.dzielnica.nazwa}</span>
                <span className="opacity-70"> — Warszawa</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{capitalize(bareName(target.powiat.nazwa))}</span>
                <span className="opacity-70"> — {target.powiat.wojewodztwo}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
