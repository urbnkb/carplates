"use client";

import { useMemo, useState } from "react";
import PlateInput from "@/components/PlateInput";
import PlateSuggestions from "@/components/PlateSuggestions";
import PowiatInfo from "@/components/PowiatInfo";
import PolandMap from "@/components/PolandMap";
import { getSuggestions, matchPlate } from "@/lib/matchPlate";

export default function Home() {
  const [value, setValue] = useState("");
  const result = useMemo(() => matchPlate(value), [value]);
  const suggestions = useMemo(() => getSuggestions(value), [value]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-12">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Skąd ta tablica?
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Wpisz początkowe znaki polskiej tablicy rejestracyjnej i sprawdź,
            z jakiego powiatu pochodzi pojazd.
          </p>
        </header>

        <PlateInput value={value} onChange={setValue} />
        <PlateSuggestions
          suggestions={suggestions}
          activeCode={result?.matchedCode}
          onSelect={setValue}
        />
        <PowiatInfo result={result} hasInput={value.length > 0} />

        <div className="w-full">
          <PolandMap highlightedGeoId={result?.powiat.geoId ?? null} />
        </div>
      </main>
    </div>
  );
}
