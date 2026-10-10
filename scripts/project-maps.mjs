// Rzutuje granice z scripts/maps/*-boundaries.json na gotowe ścieżki SVG
// w public/data. Przeglądarka dostaje same ścieżki, bez biblioteki map i bez
// liczenia projekcji. Uruchom po zmianie granic albo kadru: `npm run maps`.
import { readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath } from "d3-geo";

// Kadr musi się zgadzać z viewBoxem w src/components/GeoMap.tsx.
const WIDTH = 800;
const HEIGHT = 620;

const MAPS = [
  // Skala dobrana tak, by kraj wypełniał ~90% wysokości kadru — przy 2600
  // zajmował tylko 69% i granice powiatów były trudne do odczytania.
  { name: "powiaty", center: [19, 52.1], scale: 3350 },
  { name: "warszawa-dzielnice", center: [21.0614, 52.233], scale: 75295 },
];

for (const { name, center, scale } of MAPS) {
  const geo = JSON.parse(readFileSync(new URL(`maps/${name}-boundaries.json`, import.meta.url)));
  const projection = geoMercator().translate([WIDTH / 2, HEIGHT / 2]).center(center).scale(scale);
  // 0,1 jednostki viewBoxa to poniżej 0,1 px CSS na każdej szerokości ekranu.
  const path = geoPath(projection).digits(1);
  const shapes = geo.features.map((f) => ({ id: f.properties.id, d: path(f) }));
  writeFileSync(new URL(`../public/data/${name}.json`, import.meta.url), JSON.stringify(shapes));
  console.log(`public/data/${name}.json: ${shapes.length} kształtów`);
}
