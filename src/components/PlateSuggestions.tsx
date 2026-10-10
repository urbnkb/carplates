"use client";

import { regionLabel } from "@/lib/dzielnice";
import type { KodEntry } from "@/lib/kody";

interface PlateSuggestionsProps {
  suggestions: KodEntry[];
  activeCode?: string;
  onSelect: (code: string) => void;
}

export default function PlateSuggestions({
  suggestions,
  activeCode,
  onSelect,
}: PlateSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-2">
      {suggestions.map(({ kod, powiat }) => {
        const isActive = kod === activeCode;
        return (
          <button
            key={kod}
            type="button"
            onClick={() => onSelect(kod)}
            className={
              isActive
                ? "neu-sunken-sm rounded-full bg-well px-3 py-1 text-xs font-semibold text-accent"
                : "neu-raised-sm rounded-full bg-surface px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:text-accent"
            }
          >
            <span className="font-mono font-semibold">{kod}</span>
            <span className="opacity-70"> — {regionLabel(powiat, kod)}</span>
          </button>
        );
      })}
    </div>
  );
}
