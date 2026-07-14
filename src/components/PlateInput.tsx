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
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Kraj
        </label>
        <select
          id="country"
          defaultValue="PL"
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="PL">🇵🇱 Polska</option>
        </select>
      </div>

      <PlateVisual value={value} onChange={onChange} />
    </div>
  );
}
