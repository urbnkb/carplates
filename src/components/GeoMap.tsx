"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dzielnice } from "@/data/dzielnice";
import { powiaty } from "@/data/powiaty";
import { bareName } from "@/lib/format";

/** Kształt z pliku wygenerowanego przez scripts/project-maps.mjs. */
interface Shape {
  id: number;
  d: string;
}

interface Label {
  name: string;
  kody: string[];
}

const MAPS = {
  polska: {
    src: "/data/powiaty.json",
    labels: new Map<number, Label>(
      powiaty.map((p) => [p.geoId, { name: bareName(p.nazwa), kody: p.kody }]),
    ),
  },
  warszawa: {
    src: "/data/warszawa-dzielnice.json",
    labels: new Map<number, Label>(dzielnice.map((d) => [d.geoId, { name: d.nazwa, kody: [d.kod] }])),
  },
};

const TOOLTIP_MARGIN = 8;

interface GeoMapProps {
  map: keyof typeof MAPS;
  highlightedIds: readonly number[];
  /** Etykieta dla czytników ekranu — bez niej mapa jest pustym <svg>. */
  ariaLabel?: string;
}

interface PointerState {
  id: number;
  x: number;
  y: number;
}

export default function GeoMap({ map, highlightedIds, ariaLabel }: GeoMapProps) {
  const { src, labels } = MAPS[map];
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [hover, setHover] = useState<PointerState | null>(null);
  const [tapped, setTapped] = useState<PointerState | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let current = true;
    fetch(src)
      .then((res) => res.json())
      .then((data: Shape[]) => {
        if (current) setShapes(data);
      });
    return () => {
      current = false;
    };
  }, [src]);

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
  const activeLabel = active ? labels.get(active.id) : undefined;

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

  const isHighlighted = (id: number) => highlightedIds.includes(id);
  // SVG rysuje w kolejności dokumentu, więc podświetlone kształty idą na koniec —
  // inaczej sąsiad zamalowałby im grubszy kontur, czyli to, co miało je wyróżniać.
  const ordered = [
    ...shapes.filter((s) => !isHighlighted(s.id)),
    ...shapes.filter((s) => isHighlighted(s.id)),
  ];

  return (
    <div ref={mapRef} className="neu-sunken w-full overflow-hidden rounded-2xl bg-sea">
      <svg
        viewBox="0 0 800 620"
        width={800}
        height={620}
        className="h-auto w-full"
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
      >
        {ordered.map(({ id, d }) => (
          <path
            key={id}
            d={d}
            className="map-shape"
            data-highlighted={isHighlighted(id) || undefined}
            // Granice w pikselach CSS, nie w jednostkach viewBoxa — patrz .map-shape w globals.css.
            vectorEffect="non-scaling-stroke"
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              setHover({ id, x: event.clientX, y: event.clientY });
            }}
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse") return;
              setHover((prev) =>
                prev && prev.id === id ? { ...prev, x: event.clientX, y: event.clientY } : prev,
              );
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              setHover(null);
            }}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setTapped((prev) =>
                prev && prev.id === id ? null : { id, x: rect.left + rect.width / 2, y: rect.top },
              );
            }}
          />
        ))}
      </svg>

      {activeLabel && active && (
        <div
          ref={tooltipRef}
          className="neu-raised pointer-events-none fixed z-50 rounded-xl bg-surface px-3 py-2"
          style={{ left: active.x, top: active.y, transform: "translate(-50%, calc(-100% - 12px))" }}
        >
          <p className="text-center text-sm font-semibold whitespace-nowrap text-zinc-900">
            {activeLabel.name}
          </p>
          <div className="mt-1.5 flex max-w-56 flex-wrap justify-center gap-1">
            {activeLabel.kody.map((kod) => (
              <span
                key={kod}
                className="neu-sunken-sm rounded-full bg-well px-2 py-0.5 font-mono text-xs font-semibold text-zinc-700"
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
