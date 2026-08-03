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
                ? "neu-sunken-sm rounded-full bg-surface px-3 py-1 text-xs font-semibold text-accent-alt"
                : "neu-raised-sm rounded-full bg-surface px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:text-accent-alt"
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
