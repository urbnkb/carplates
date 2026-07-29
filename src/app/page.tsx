"use client";

import { useMemo, useState, useTransition, ViewTransition } from "react";
import PlateInput from "@/components/PlateInput";
import PlateSuggestions from "@/components/PlateSuggestions";
import LocationVisual from "@/components/LocationVisual";
import LocationSuggestions from "@/components/LocationSuggestions";
import PlatePreview from "@/components/PlatePreview";
import PowiatInfo from "@/components/PowiatInfo";
import PolandMap from "@/components/PolandMap";
import ModeToggle, { type Mode } from "@/components/ModeToggle";
import HeroIcons from "@/components/HeroIcons";
import ProductWindow from "@/components/ProductWindow";
import { getSuggestions, matchPlate } from "@/lib/matchPlate";
import { getLocationSuggestions, matchLocation } from "@/lib/matchLocation";
import { bareName } from "@/lib/format";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";
import type { Powiat } from "@/types/powiat";

const JSON_LD = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Skąd ta rejestracja?",
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  description:
    "Rozpoznawanie powiatu po polskiej tablicy rejestracyjnej oraz sprawdzanie kodów tablic dla wybranego powiatu.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
});

export default function Home() {
  const [mode, setMode] = useState<Mode>("plate");
  const [, startTransition] = useTransition();
  function handleModeChange(nextMode: Mode) {
    startTransition(() => setMode(nextMode));
  }

  const [plateValue, setPlateValue] = useState("");
  const plateResult = useMemo(() => matchPlate(plateValue), [plateValue]);
  const plateSuggestions = useMemo(() => getSuggestions(plateValue), [plateValue]);

  const [locationValue, setLocationValue] = useState("");
  const [pinnedGeoId, setPinnedGeoId] = useState<number | null>(null);
  const locationMatch = useMemo(() => matchLocation(locationValue), [locationValue]);
  const locationSuggestions = useMemo(
    () => getLocationSuggestions(locationValue),
    [locationValue],
  );
  const resolvedPowiat: Powiat | null = useMemo(() => {
    if (locationMatch.kind === "unique") return locationMatch.powiat;
    if (locationMatch.kind === "ambiguous" && pinnedGeoId != null) {
      return locationMatch.candidates.find((p) => p.geoId === pinnedGeoId) ?? null;
    }
    return null;
  }, [locationMatch, pinnedGeoId]);

  function handleLocationChange(value: string) {
    setLocationValue(value);
    setPinnedGeoId(null);
  }

  function handleLocationSelect(powiat: Powiat) {
    setLocationValue(bareName(powiat.nazwa));
    setPinnedGeoId(powiat.geoId);
  }

  const highlightedGeoId =
    mode === "plate" ? plateResult?.powiat.geoId ?? null : resolvedPowiat?.geoId ?? null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-14 sm:py-20">
        <div className="flex w-full justify-end">
          <ModeToggle mode={mode} onChange={handleModeChange} />
        </div>

        <div className="relative w-full">
          <HeroIcons />
          <ViewTransition key={mode} name="mode-header" share="auto" enter="auto" default="none">
            <header data-hero-header className="text-center">
              <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                {mode === "plate" ? "Skąd ta rejestracja?" : "Jakie tablice ma ten powiat?"}
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-base text-zinc-600 sm:max-w-md sm:text-lg dark:text-zinc-400">
                {mode === "plate"
                  ? "Wpisz początkowe znaki polskiej tablicy rejestracyjnej i sprawdź, z jakiego powiatu pochodzi pojazd."
                  : "Wpisz nazwę gminy, miasta lub powiatu i sprawdź, jakie kody tablic tam obowiązują."}
              </p>
            </header>
          </ViewTransition>
        </div>

        <ProductWindow>
          <ViewTransition key={mode} name="mode-content" share="auto" enter="auto" default="none">
            <>
              {mode === "plate" ? (
                <div className="flex w-full flex-col items-center gap-8">
                  <PlateInput value={plateValue} onChange={setPlateValue} />
                  <PlateSuggestions
                    suggestions={plateSuggestions}
                    activeCode={plateResult?.matchedCode}
                    onSelect={setPlateValue}
                  />
                  <PowiatInfo
                    powiat={plateResult?.powiat ?? null}
                    matchedCode={plateResult?.matchedCode}
                  />
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-8">
                  <LocationVisual value={locationValue} onChange={handleLocationChange} />
                  <LocationSuggestions
                    suggestions={locationSuggestions}
                    activeGeoId={resolvedPowiat?.geoId}
                    onSelect={handleLocationSelect}
                  />
                  {resolvedPowiat && (
                    <div className="flex w-full max-w-xl flex-wrap justify-center gap-3">
                      {resolvedPowiat.kody.map((kod) => (
                        <PlatePreview key={kod} code={kod} />
                      ))}
                    </div>
                  )}
                  <PowiatInfo powiat={resolvedPowiat} />
                </div>
              )}
            </>
          </ViewTransition>

          <div className="w-full">
            <PolandMap highlightedGeoId={highlightedGeoId} />
          </div>
        </ProductWindow>

        <footer className="mt-4 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-6 text-center dark:border-pink-900/40 dark:bg-pink-950/20">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Jeżeli doceniasz moją działalność, wesprzyj mnie ♥
          </p>
          <a
            href="https://suppi.pl/urbnkb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700"
          >
            Wesprzyj na suppi.pl
          </a>
        </footer>
      </main>
    </div>
  );
}
