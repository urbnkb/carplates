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

// Po uproszczeniu granic stykają się dwoma punktami, ale w rzeczywistości nie
// sąsiadują. Porównanie z sekcjami „Sąsiednie powiaty” na Wikipedii: 1104 z 1107
// par zgodnych przy progu 2 wspólnych wierzchołków; wyższy próg gubi prawdziwych sąsiadów.
const FALSZYWI_SASIEDZI = [["powiat krakowski", "powiat bocheński"]];

const pierscienie = (geometry) =>
  geometry.type === "Polygon" ? geometry.coordinates : geometry.coordinates.flat();

function sasiedzi(features) {
  const wierzcholki = new Map();
  features.forEach((f, i) => {
    for (const [x, y] of pierscienie(f.geometry).flat()) {
      const klucz = `${x.toFixed(4)},${y.toFixed(4)}`;
      wierzcholki.set(klucz, (wierzcholki.get(klucz) ?? new Set()).add(i));
    }
  });

  const wspolne = features.map(() => new Map());
  for (const ids of wierzcholki.values()) {
    for (const a of ids) for (const b of ids) if (a !== b) wspolne[a].set(b, (wspolne[a].get(b) ?? 0) + 1);
  }

  return features.map((f, i) =>
    [...wspolne[i]]
      .filter(([, n]) => n >= 2)
      .map(([j]) => features[j])
      .filter(
        (s) =>
          !FALSZYWI_SASIEDZI.some(
            ([a, b]) =>
              (a === f.properties.nazwa && b === s.properties.nazwa) ||
              (b === f.properties.nazwa && a === s.properties.nazwa),
          ),
      )
      .map((s) => s.properties.id)
      .sort((a, b) => a - b),
  );
}

function odleglosc([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

// Reguła parzystości po wszystkich pierścieniach, więc enklawy-dziury są „na zewnątrz”.
function wSrodku([px, py], rings) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/**
 * [x, y, r]: środek i promień największego koła wpisanego w kształt. Środek
 * bboxa lub centroid wypada u powiatów-obwarzanków (krakowski, poznański) na
 * mieście w środku; r mówi od razu, czy etykieta kodu się zmieści.
 * ponytail: siatka 40×40 zamiast polylabel, dokładność ~1/40 szerokości powiatu wystarcza.
 */
function miejsceNaEtykiete(rings) {
  const xs = rings.flat().map(([x]) => x);
  const ys = rings.flat().map(([, y]) => y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const krok = Math.max(maxX - minX, maxY - minY) / 40;
  let najlepsze = [minX, minY, 0];
  for (let y = minY; y <= maxY; y += krok) {
    for (let x = minX; x <= maxX; x += krok) {
      if (!wSrodku([x, y], rings)) continue;
      let r = Infinity;
      for (const ring of rings) {
        for (let i = 1; i < ring.length; i++) r = Math.min(r, odleglosc([x, y], ring[i - 1], ring[i]));
      }
      if (r > najlepsze[2]) najlepsze = [x, y, r];
    }
  }
  return najlepsze.map((v) => Math.round(v * 10) / 10);
}

for (const { name, center, scale } of MAPS) {
  const geo = JSON.parse(readFileSync(new URL(`maps/${name}-boundaries.json`, import.meta.url)));
  const projection = geoMercator().translate([WIDTH / 2, HEIGHT / 2]).center(center).scale(scale);
  // 0,1 jednostki viewBoxa to poniżej 0,1 px CSS na każdej szerokości ekranu.
  const path = geoPath(projection).digits(1);
  const shapes = geo.features.map((f) => ({ id: f.properties.id, d: path(f) }));
  writeFileSync(new URL(`../public/data/${name}.json`, import.meta.url), JSON.stringify(shapes));
  console.log(`public/data/${name}.json: ${shapes.length} kształtów`);

  if (name === "powiaty") {
    const listaSasiadow = sasiedzi(geo.features);
    const dane = Object.fromEntries(
      geo.features.map((f, i) => [
        f.properties.id,
        {
          sasiedzi: listaSasiadow[i],
          etykieta: miejsceNaEtykiete(
            pierscienie(f.geometry).map((ring) => ring.map((p) => projection(p))),
          ),
        },
      ]),
    );
    writeFileSync(new URL("../src/data/powiaty-geo.json", import.meta.url), JSON.stringify(dane));
    console.log("src/data/powiaty-geo.json: sąsiedzi i miejsca na etykiety");
  }
}
