"use client";

export type Mode = "plate" | "location";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tryb wyszukiwania"
      className="inline-flex rounded-full border border-zinc-300 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <button
        type="button"
        aria-pressed={mode === "plate"}
        onClick={() => onChange("plate")}
        className={
          mode === "plate"
            ? "rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm"
            : "rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:text-sm"
        }
      >
        Tablica
      </button>
      <button
        type="button"
        aria-pressed={mode === "location"}
        onClick={() => onChange("location")}
        className={
          mode === "location"
            ? "rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm"
            : "rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:text-sm"
        }
      >
        Powiat
      </button>
    </div>
  );
}
