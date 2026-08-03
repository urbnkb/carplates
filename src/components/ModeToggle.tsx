"use client";

export type Mode = "plate" | "location";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

// Tor jest wklęsły, aktywny segment wypukły — czytelna metafora klawisza,
// która zastępuje dawne kontrastowe wypełnienie kolorem.
const ACTIVE = "neu-raised-sm rounded-full bg-surface px-3 py-1.5 text-xs font-semibold sm:text-sm";
const INACTIVE =
  "rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:text-sm";

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tryb wyszukiwania"
      className="neu-sunken inline-flex rounded-full bg-surface p-1"
    >
      <button
        type="button"
        aria-pressed={mode === "plate"}
        onClick={() => onChange("plate")}
        className={mode === "plate" ? `${ACTIVE} text-accent` : INACTIVE}
      >
        Tablica
      </button>
      <button
        type="button"
        aria-pressed={mode === "location"}
        onClick={() => onChange("location")}
        className={mode === "location" ? `${ACTIVE} text-accent-alt` : INACTIVE}
      >
        Powiat
      </button>
    </div>
  );
}
