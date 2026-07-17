interface TownHallGlyphProps {
  className?: string;
}

function TownHallGlyph({ className = "h-7 w-7 sm:h-9 sm:w-9" }: TownHallGlyphProps) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <polygon points="4,15 18,5 32,15" fill="#ffffff" />
      <rect x="6" y="15" width="24" height="15" fill="#ffffff" />
      <rect x="9" y="18" width="3" height="9" fill="#0d5c3f" />
      <rect x="16.5" y="18" width="3" height="9" fill="#0d5c3f" />
      <rect x="24" y="18" width="3" height="9" fill="#0d5c3f" />
      <rect x="15" y="22" width="6" height="8" fill="#0d5c3f" />
    </svg>
  );
}

interface LocationVisualProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationVisual({ value, onChange }: LocationVisualProps) {
  return (
    <div className="inline-flex h-20 w-full max-w-xs items-stretch overflow-hidden rounded-md border-[3px] border-black bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-emerald-600 sm:h-24 sm:max-w-sm">
      <div className="flex w-9 flex-col items-center justify-center bg-emerald-700 py-2 sm:w-12">
        <TownHallGlyph />
      </div>
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="Wpisz gminę, miasto lub powiat"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\p{L}\s-]/gu, "").slice(0, 40))}
        aria-label="Nazwa gminy, miasta lub powiatu"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-center font-sans text-lg font-bold text-black outline-none placeholder:text-zinc-300 placeholder:text-xs placeholder:font-normal sm:text-2xl sm:placeholder:text-sm"
      />
    </div>
  );
}
