"use client";

export type Mode = "plate" | "location";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

// Kolor trybu żyje wyłącznie na tym przełączniku — karta jest neutralna.
// Zamiast dwóch osobnych teł mamy jeden guzik, który fizycznie przesuwa się
// między segmentami; dzięki temu zmiana czyta się jako ruch, a nie przeskok.
const LABEL =
  "relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm";

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const isPlate = mode === "plate";

  return (
    <div
      role="group"
      aria-label="Tryb wyszukiwania"
      className="neu-sunken relative grid grid-cols-2 rounded-full bg-well p-1"
    >
      {/*
        Szerokość guzika to dokładnie połowa przestrzeni wewnętrznej toru, więc
        przejście na drugi segment to równo translate-x-full — bez magicznych liczb.
      */}
      <span
        aria-hidden="true"
        // Tailwind v4 realizuje translate-x-* przez właściwość `translate`,
        // a nie `transform` — animujemy więc dokładnie tę właściwość.
        className={`neu-raised-sm absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-[translate,background-color] duration-500 ease-back motion-reduce:transition-none ${
          isPlate ? "translate-x-0 bg-blue-600" : "translate-x-full bg-emerald-700"
        }`}
      />

      <button
        type="button"
        aria-pressed={isPlate}
        onClick={() => onChange("plate")}
        className={`${LABEL} ${isPlate ? "text-white" : "text-zinc-600 hover:text-zinc-900"}`}
      >
        Tablica
      </button>
      <button
        type="button"
        aria-pressed={!isPlate}
        onClick={() => onChange("location")}
        className={`${LABEL} ${!isPlate ? "text-white" : "text-zinc-600 hover:text-zinc-900"}`}
      >
        Powiat
      </button>
    </div>
  );
}
