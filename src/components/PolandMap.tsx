"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const GEO_URL = "/data/powiaty-boundaries.json";

interface PolandMapProps {
  highlightedGeoId: number | null;
}

export default function PolandMap({ highlightedGeoId }: PolandMapProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/10 bg-sky-50 dark:border-white/10 dark:bg-slate-900">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [19, 52.1], scale: 2600 }}
        width={800}
        height={620}
        className="w-full h-auto"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHighlighted = geo.properties.id === highlightedGeoId;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isHighlighted ? "#2563eb" : "#e2e8f0",
                      stroke: "#94a3b8",
                      strokeWidth: 0.4,
                      outline: "none",
                      transition: "fill 200ms ease-in-out",
                    },
                    hover: {
                      fill: isHighlighted ? "#2563eb" : "#cbd5e1",
                      stroke: "#94a3b8",
                      strokeWidth: 0.4,
                      outline: "none",
                    },
                    pressed: {
                      fill: isHighlighted ? "#1d4ed8" : "#cbd5e1",
                      stroke: "#94a3b8",
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
    </div>
  );
}
