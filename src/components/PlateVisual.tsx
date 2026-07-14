const STAR_COUNT = 12;
const STAR_RADIUS = 12.5;
const CENTER = 18;

function EuStars() {
  return (
    <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
      {Array.from({ length: STAR_COUNT }).map((_, i) => {
        const angle = (i / STAR_COUNT) * 2 * Math.PI - Math.PI / 2;
        // Rounded to avoid SSR/client floating-point mismatches (hydration errors)
        // from tiny last-bit differences in Math.cos/Math.sin across engines.
        const x = Math.round((CENTER + STAR_RADIUS * Math.cos(angle)) * 1000) / 1000;
        const y = Math.round((CENTER + STAR_RADIUS * Math.sin(angle)) * 1000) / 1000;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="7"
            fill="#FFD700"
            textAnchor="middle"
            dominantBaseline="central"
          >
            ★
          </text>
        );
      })}
    </svg>
  );
}

interface PlateVisualProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PlateVisual({ value, onChange }: PlateVisualProps) {
  return (
    <div className="inline-flex h-20 w-full max-w-xs items-stretch overflow-hidden rounded-md border-[3px] border-black bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-blue-500 sm:h-24 sm:max-w-sm">
      <div className="flex w-9 flex-col items-center justify-between bg-[#003399] py-2 sm:w-12">
        <EuStars />
        <span className="text-[10px] font-bold text-white sm:text-xs">PL</span>
      </div>
      <input
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        placeholder="WSI"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8))
        }
        aria-label="Początkowe znaki tablicy rejestracyjnej"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-center font-mono text-2xl font-bold tracking-[0.15em] text-black outline-none placeholder:text-zinc-300 sm:text-4xl"
      />
    </div>
  );
}
