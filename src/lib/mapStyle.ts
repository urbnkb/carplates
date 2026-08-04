import type { CSSProperties } from "react";

/**
 * Wspólny wygląd obu map (Polska i dzielnice Warszawy). Kolory są tu, a nie
 * w tokenach Tailwinda, bo trafiają do atrybutów SVG — tak samo jak kolory
 * w `opengraph-image.tsx`.
 *
 * Tła ramki tu nie ma: to zwykły element HTML, więc bierze je z tokenu
 * `--color-sea` w globals.css przez klasę `bg-sea`. Kolor `land` musi się
 * odcinać właśnie od niego — przy zmianie jednego przelicz drugi.
 */
export const MAP_COLORS = {
  land: "#ffffff",
  landHover: "#d8e1ee",
  /*
   * Kontrast granicy względem białego powiatu: 2,13:1. To 20% mniej niż
   * poprzednie #8fa0b8 (2,66:1) — przy pełnopikselowej grubości mocniejszy
   * kolor zbijał gęste południe kraju w ciemną plamę.
   */
  border: "#a5b3c6",
  highlight: "#1d4ed8",
  highlightPressed: "#1e3a8a",
  highlightBorder: "#1e3a8a",
} as const;

/**
 * Granice liczymy w pikselach CSS, nie w jednostkach viewBoxa. Bez tego
 * `strokeWidth` jest skalowany razem z mapą: przy viewBoxie 800 i szerokości
 * ~370 px na telefonie grubość 0,4 schodziła do 0,18 px i granice zlewały się
 * w jednolitą plamę. `non-scaling-stroke` sprawia, że 1 oznacza 1 px CSS na
 * każdej szerokości ekranu.
 */
export const NON_SCALING_STROKE = "non-scaling-stroke";

const BORDER_WIDTH = 1;
const HIGHLIGHT_BORDER_WIDTH = 2;

/** Poświata wokół podświetlonego kształtu — promień w px CSS, więc też nie skaluje się z viewBoxem. */
const HIGHLIGHT_GLOW = "drop-shadow(0 0 5px rgb(29 78 216 / 0.55))";

type GeographyStyle = {
  default: CSSProperties;
  hover: CSSProperties;
  pressed: CSSProperties;
};

/**
 * Trójka stylów wymagana przez `<Geography>` z react-simple-maps.
 * Podświetlony kształt dostaje ciemniejszy kontur i poświatę, żeby dało się go
 * znaleźć również wtedy, gdy powiat jest mały (Wałbrzych, Sopot, Świnoujście).
 */
export function geographyStyle(isHighlighted: boolean): GeographyStyle {
  const base: CSSProperties = {
    stroke: isHighlighted ? MAP_COLORS.highlightBorder : MAP_COLORS.border,
    strokeWidth: isHighlighted ? HIGHLIGHT_BORDER_WIDTH : BORDER_WIDTH,
    outline: "none",
    ...(isHighlighted ? { filter: HIGHLIGHT_GLOW } : {}),
  };

  return {
    default: {
      ...base,
      fill: isHighlighted ? MAP_COLORS.highlight : MAP_COLORS.land,
      transition: "fill 200ms ease-in-out",
    },
    hover: {
      ...base,
      fill: isHighlighted ? MAP_COLORS.highlight : MAP_COLORS.landHover,
    },
    pressed: {
      ...base,
      fill: isHighlighted ? MAP_COLORS.highlightPressed : MAP_COLORS.landHover,
    },
  };
}

/**
 * Przestawia podświetlone kształty na koniec listy. SVG rysuje w kolejności
 * dokumentu, więc bez tego sąsiedni powiat zamalowuje podświetlonemu kontur
 * i poświatę — czyli dokładnie to, co miało go wyróżniać.
 */
export function highlightedLast<T>(
  geographies: T[],
  isHighlighted: (geography: T) => boolean,
): T[] {
  const normal: T[] = [];
  const highlighted: T[] = [];
  for (const geography of geographies) {
    (isHighlighted(geography) ? highlighted : normal).push(geography);
  }
  return [...normal, ...highlighted];
}
