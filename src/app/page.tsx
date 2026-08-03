"use client";

import { useMemo, useState, useTransition, ViewTransition } from "react";
import PlateInput from "@/components/PlateInput";
import PlateSuggestions from "@/components/PlateSuggestions";
import LocationVisual from "@/components/LocationVisual";
import LocationSuggestions from "@/components/LocationSuggestions";
import PlatePreview from "@/components/PlatePreview";
import PowiatInfo from "@/components/PowiatInfo";
import PolandMap from "@/components/PolandMap";
import WarszawaDzielniceMap from "@/components/WarszawaDzielniceMap";
import ModeToggle, { type Mode } from "@/components/ModeToggle";
import HeroIcons from "@/components/HeroIcons";
import ProductWindow from "@/components/ProductWindow";
import { getSuggestions, matchPlate } from "@/lib/matchPlate";
import {
  getLocationSuggestions,
  locationTargetKey,
  matchLocation,
  targetName,
  type LocationTarget,
} from "@/lib/matchLocation";
import { getDzielniceForKod, WARSZAWA_GEO_ID } from "@/lib/dzielnice";
import { dzielnice } from "@/data/dzielnice";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/site";

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
  // Klucz, nie geoId: geoId dzielnic (1–18) kolidują liczbowo z geoId powiatów.
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const locationMatch = useMemo(() => matchLocation(locationValue), [locationValue]);
  const locationSuggestions = useMemo(
    () => getLocationSuggestions(locationValue),
    [locationValue],
  );
  const resolvedTarget: LocationTarget | null = useMemo(() => {
    if (locationMatch.kind === "unique") return locationMatch.target;
    if (locationMatch.kind === "ambiguous" && pinnedKey != null) {
      return locationMatch.candidates.find((c) => locationTargetKey(c) === pinnedKey) ?? null;
    }
    return null;
  }, [locationMatch, pinnedKey]);

  function handleLocationChange(value: string) {
    setLocationValue(value);
    setPinnedKey(null);
  }

  function handleLocationSelect(target: LocationTarget) {
    setLocationValue(targetName(target));
    setPinnedKey(locationTargetKey(target));
  }

  const highlightedGeoId =
    mode === "plate" ? plateResult?.powiat.geoId ?? null : resolvedTarget?.powiat.geoId ?? null;

  const isWarszawaPlate = mode === "plate" && plateResult?.powiat.geoId === WARSZAWA_GEO_ID;
  const isWarszawaLocation =
    mode === "location" && resolvedTarget?.powiat.geoId === WARSZAWA_GEO_ID;
  const showDzielniceMap = isWarszawaPlate || isWarszawaLocation;

  const highlightedDzielniceIds = useMemo(() => {
    if (isWarszawaPlate && plateResult) {
      return getDzielniceForKod(plateResult.matchedCode).map((d) => d.geoId);
    }
    if (isWarszawaLocation && resolvedTarget) {
      // Wpisana dzielnica podświetla siebie; wpisana "Warszawa" — całe miasto.
      return resolvedTarget.dzielnica
        ? [resolvedTarget.dzielnica.geoId]
        : dzielnice.map((d) => d.geoId);
    }
    return [];
  }, [isWarszawaPlate, isWarszawaLocation, plateResult, resolvedTarget]);

  // Dzielnica niesie własny kod, więc po jej wskazaniu nie ma sensu pokazywać
  // wszystkich piętnastu kodów Warszawy.
  const locationKody = resolvedTarget
    ? resolvedTarget.dzielnica
      ? [resolvedTarget.dzielnica.kod]
      : resolvedTarget.powiat.kody
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-14 sm:py-20">
        <div className="flex w-full justify-end">
          <ModeToggle mode={mode} onChange={handleModeChange} />
        </div>

        <div className="relative w-full">
          <HeroIcons />
          <ViewTransition key={mode} name="mode-header" share="auto" enter="auto" default="none">
            <header data-hero-header className="text-center">
              <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                {mode === "plate" ? "Skąd ta rejestracja?" : "Jakie tablice ma ten powiat?"}
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-base text-zinc-600 sm:max-w-md sm:text-lg">
                {mode === "plate"
                  ? "Wpisz początkowe znaki polskiej tablicy rejestracyjnej i sprawdź, z jakiego powiatu pochodzi pojazd."
                  : "Wpisz nazwę gminy, miasta, powiatu lub dzielnicy Warszawy i sprawdź, jakie kody tablic tam obowiązują."}
              </p>
            </header>
          </ViewTransition>
        </div>

        <ProductWindow accent={mode === "plate" ? "plate" : "location"}>
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
                    activeKey={resolvedTarget ? locationTargetKey(resolvedTarget) : null}
                    onSelect={handleLocationSelect}
                  />
                  {resolvedTarget && (
                    <div className="flex w-full max-w-xl flex-wrap justify-center gap-3">
                      {locationKody.map((kod) => (
                        <PlatePreview key={kod} code={kod} />
                      ))}
                    </div>
                  )}
                  <PowiatInfo
                    powiat={resolvedTarget?.powiat ?? null}
                    matchedCode={resolvedTarget?.dzielnica?.kod}
                    dzielnica={resolvedTarget?.dzielnica}
                  />
                </div>
              )}
            </>
          </ViewTransition>

          <ViewTransition key={showDzielniceMap ? "warszawa" : "poland"} name="map" share="auto" enter="auto" default="none">
            <div className="w-full">
              {showDzielniceMap ? (
                <WarszawaDzielniceMap highlightedGeoIds={highlightedDzielniceIds} />
              ) : (
                <PolandMap highlightedGeoId={highlightedGeoId} />
              )}
            </div>
          </ViewTransition>
        </ProductWindow>

        <footer className="neu-raised mt-4 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl bg-surface p-6 text-center">
          <p className="text-sm text-zinc-700">
            Jeżeli doceniasz moją działalność, wesprzyj mnie ♥
          </p>
          <a
            href="https://suppi.pl/urbnkb"
            target="_blank"
            rel="noopener noreferrer"
            className="neu-raised-sm inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2 text-sm font-semibold text-pink-700 transition-shadow active:neu-sunken-sm"
          >
            Wesprzyj na suppi.pl
          </a>
        </footer>
      </main>
    </div>
  );
}
