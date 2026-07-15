import EuStars from "@/components/EuStars";

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
        placeholder="Wpisz tablicę"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8))
        }
        aria-label="Początkowe znaki tablicy rejestracyjnej"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-center font-mono text-2xl font-bold tracking-[0.15em] text-black outline-none placeholder:text-zinc-300 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal sm:text-4xl sm:placeholder:text-base"
      />
    </div>
  );
}
