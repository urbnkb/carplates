"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { powiaty } from "@/data/powiaty";
import { bareName } from "@/lib/format";

const GEO_URL = "/data/powiaty-boundaries.json";
const TOOLTIP_MARGIN = 8;

const powiatById = new Map(powiaty.map((powiat) => [powiat.geoId, powiat]));

interface PolandMapProps {
  highlightedGeoId: number | null;
  /** Etykieta dla czytników ekranu — bez niej mapa jest pustym <svg>. */
  ariaLabel?: string;
}

interface HoverState {
  geoId: number;
  x: number;
  y: number;
}

export default function PolandMap({ highlightedGeoId, ariaLabel }: PolandMapProps) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const [tapped, setTapped] = useState<HoverState | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tapped) return;
    function handleOutsideInteraction(event: Event) {
      if (mapRef.current && event.target instanceof Node && !mapRef.current.contains(event.target)) {
        setTapped(null);
      }
    }
    document.addEventListener("click", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    return () => {
      document.removeEventListener("click", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [tapped]);

  const active = tapped ?? hover;
  const activePowiat = active ? powiatById.get(active.geoId) ?? null : null;

  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el || !active) return;
    el.style.transform = "translate(-50%, calc(-100% - 12px))";
    const rect = el.getBoundingClientRect();
    let shift = 0;
    if (rect.left < TOOLTIP_MARGIN) {
      shift = TOOLTIP_MARGIN - rect.left;
    } else if (rect.right > window.innerWidth - TOOLTIP_MARGIN) {
      shift = window.innerWidth - TOOLTIP_MARGIN - rect.right;
    }
    if (shift !== 0) {
      el.style.transform = `translate(calc(-50% + ${shift}px), calc(-100% - 12px))`;
    }
  }, [active]);

  return (
    <div
      ref={mapRef}
      className="neu-sunken w-full overflow-hidden rounded-2xl bg-surface"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [19, 52.1], scale: 2600 }}
        width={800}
        height={620}
        className="w-full h-auto"
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHighlighted = geo.properties.id === highlightedGeoId;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHover({ geoId: geo.properties.id, x: event.clientX, y: event.clientY });
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHover((prev) =>
                      prev && prev.geoId === geo.properties.id
                        ? { ...prev, x: event.clientX, y: event.clientY }
                        : prev,
                    );
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHover(null);
                  }}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const geoId = geo.properties.id;
                    setTapped((prev) =>
                      prev && prev.geoId === geoId
                        ? null
                        : { geoId, x: rect.left + rect.width / 2, y: rect.top },
                    );
                  }}
                  style={{
                    default: {
                      fill: isHighlighted ? "#1d4ed8" : "#f3f6fa",
                      stroke: "#9fadc0",
                      strokeWidth: 0.4,
                      outline: "none",
                      transition: "fill 200ms ease-in-out",
                    },
                    hover: {
                      fill: isHighlighted ? "#1d4ed8" : "#e2e8f1",
                      stroke: "#9fadc0",
                      strokeWidth: 0.4,
                      outline: "none",
                    },
                    pressed: {
                      fill: isHighlighted ? "#1e3a8a" : "#e2e8f1",
                      stroke: "#9fadc0",
                      strokeWidth: 0.4,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {activePowiat && active && (
        <div
          ref={tooltipRef}
          className="neu-raised pointer-events-none fixed z-50 rounded-xl bg-surface px-3 py-2"
          style={{ left: active.x, top: active.y, transform: "translate(-50%, calc(-100% - 12px))" }}
        >
          <p className="text-center text-sm font-semibold whitespace-nowrap text-zinc-900">
            {bareName(activePowiat.nazwa)}
          </p>
          <div className="mt-1.5 flex max-w-56 flex-wrap justify-center gap-1">
            {activePowiat.kody.map((kod) => (
              <span
                key={kod}
                className="neu-sunken-sm rounded-full bg-surface px-2 py-0.5 font-mono text-xs font-semibold text-zinc-700"
              >
                {kod}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
