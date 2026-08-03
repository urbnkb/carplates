"use client";

export type Mode = "plate" | "location";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

// Tor jest wklęsły, aktywny segment wypukły i wypełniony kolorem trybu —
// ten sam kolor niesie potem obwoluta karty, więc wybór widać dwukrotnie.
const ACTIVE =
  "neu-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white sm:text-sm";
const INACTIVE =
  "rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:text-sm";

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tryb wyszukiwania"
      className="neu-sunken inline-flex rounded-full bg-well p-1"
    >
      <button
        type="button"
        aria-pressed={mode === "plate"}
        onClick={() => onChange("plate")}
        className={mode === "plate" ? `${ACTIVE} bg-blue-600` : INACTIVE}
      >
        Tablica
      </button>
      <button
        type="button"
        aria-pressed={mode === "location"}
        onClick={() => onChange("location")}
        className={mode === "location" ? `${ACTIVE} bg-emerald-700` : INACTIVE}
      >
        Powiat
      </button>
    </div>
  );
}
