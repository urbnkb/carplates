"use client";

import PlateVisual from "@/components/PlateVisual";

interface PlateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PlateInput({ value, onChange }: PlateInputProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-xs items-center justify-between sm:max-w-sm">
        <label
          htmlFor="country"
          className="text-sm font-medium text-zinc-600"
        >
          Kraj
        </label>
        <select
          id="country"
          defaultValue="PL"
          className="neu-raised-sm rounded-full bg-surface px-3 py-1.5 text-sm text-zinc-900 outline-none focus:neu-sunken-sm"
        >
          <option value="PL">🇵🇱 Polska</option>
        </select>
      </div>

      <PlateVisual value={value} onChange={onChange} />
    </div>
  );
}
