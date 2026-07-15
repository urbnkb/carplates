"use client";

import { capitalize } from "@/lib/format";
import type { Suggestion } from "@/types/powiat";

interface PlateSuggestionsProps {
  suggestions: Suggestion[];
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
      {suggestions.map(({ code, powiat }) => {
        const isActive = code === activeCode;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onSelect(code)}
            className={
              isActive
                ? "rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                : "rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            }
          >
            <span className="font-mono font-semibold">{code}</span>
            <span className="opacity-70"> — {capitalize(powiat.nazwa)}</span>
          </button>
        );
      })}
    </div>
  );
}
